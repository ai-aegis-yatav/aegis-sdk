import type { Transport } from "./transport";

export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  has_more?: boolean;
}

export class Paginator<T> implements AsyncIterable<T> {
  private transport: Transport;
  private path: string;
  private params: Record<string, string | number | undefined>;
  private currentPage: number;
  private exhausted = false;
  private _total?: number;

  constructor(
    transport: Transport,
    path: string,
    params: Record<string, string | number | undefined> = {},
  ) {
    this.transport = transport;
    this.path = path;
    this.params = params;
    this.currentPage = (params.page as number) ?? 1;
  }

  get total(): number | undefined {
    return this._total;
  }

  private extractItems(data: any): T[] {
    if (Array.isArray(data)) return data;
    if (!data || typeof data !== "object") return [];
    if (Array.isArray(data.items)) return data.items;
    for (const key of [
      "results", "data", "events", "campaigns", "rules",
      "judgments", "escalations", "evidence", "api_keys", "templates",
    ]) {
      if (Array.isArray(data[key])) return data[key];
    }
    return [];
  }

  async *[Symbol.asyncIterator](): AsyncIterator<T> {
    while (!this.exhausted) {
      const data = await this.transport.request<any>({
        method: "GET",
        path: this.path,
        params: { ...this.params, page: this.currentPage },
      });

      this._total = data?.total;
      const items = this.extractItems(data);
      for (const item of items) yield item;

      const limit = (this.params.limit as number) ?? 20;
      if (!items.length || items.length < limit || data?.has_more === false) {
        this.exhausted = true;
      }
      this.currentPage++;
    }
  }

  async toArray(): Promise<T[]> {
    const results: T[] = [];
    for await (const item of this) {
      results.push(item);
    }
    return results;
  }
}
