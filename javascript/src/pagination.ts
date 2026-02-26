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

  async *[Symbol.asyncIterator](): AsyncIterator<T> {
    while (!this.exhausted) {
      const data = await this.transport.request<PageResult<T>>({
        method: "GET",
        path: this.path,
        params: { ...this.params, page: this.currentPage },
      });

      this._total = data.total;
      for (const item of data.items) {
        yield item;
      }

      const limit = (this.params.limit as number) ?? 20;
      if (!data.items.length || data.items.length < limit || data.has_more === false) {
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
