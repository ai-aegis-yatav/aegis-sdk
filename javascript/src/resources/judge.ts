import type { Transport } from "../transport";
import { Paginator } from "../pagination";
import type { JudgeRequest, JudgeResponse, JudgeStreamEvent } from "../models/judge";

export class Judge {
  constructor(private transport: Transport) {}

  async create(request: JudgeRequest): Promise<JudgeResponse> {
    return this.transport.request({ method: "POST", path: "/v1/judge", body: request });
  }

  async batch(requests: JudgeRequest[]): Promise<JudgeResponse[]> {
    const data = await this.transport.request<{ results: JudgeResponse[] }>({
      method: "POST", path: "/v1/judge/batch", body: { requests },
    });
    return (data as any).results ?? data;
  }

  async *stream(request: JudgeRequest): AsyncGenerator<JudgeStreamEvent> {
    for await (const data of this.transport.stream({ method: "POST", path: "/v1/judge/stream", body: request })) {
      yield JSON.parse(data) as JudgeStreamEvent;
    }
  }

  list(opts: { page?: number; limit?: number } = {}): Paginator<JudgeResponse> {
    return new Paginator(this.transport, "/v1/judgments", { page: opts.page ?? 1, limit: opts.limit ?? 20 });
  }

  async get(judgmentId: string): Promise<JudgeResponse> {
    return this.transport.request({ method: "GET", path: `/v1/judgments/${judgmentId}` });
  }
}
