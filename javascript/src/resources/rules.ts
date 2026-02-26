import type { Transport } from "../transport";
import { Paginator } from "../pagination";
import type { Rule, RuleCreateRequest, RuleUpdateRequest, RuleTestRequest, RuleTestResponse } from "../models/rules";

export class Rules {
  constructor(private transport: Transport) {}

  async create(request: RuleCreateRequest): Promise<Rule> {
    return this.transport.request({ method: "POST", path: "/v1/rules", body: request });
  }

  async get(ruleId: string): Promise<Rule> {
    return this.transport.request({ method: "GET", path: `/v1/rules/${ruleId}` });
  }

  async update(ruleId: string, request: RuleUpdateRequest): Promise<Rule> {
    return this.transport.request({ method: "PUT", path: `/v1/rules/${ruleId}`, body: request });
  }

  async delete(ruleId: string): Promise<void> {
    await this.transport.request({ method: "DELETE", path: `/v1/rules/${ruleId}` });
  }

  list(opts: { page?: number; limit?: number } = {}): Paginator<Rule> {
    return new Paginator(this.transport, "/v1/rules", { page: opts.page ?? 1, limit: opts.limit ?? 20 });
  }

  async test(request: RuleTestRequest): Promise<RuleTestResponse> {
    return this.transport.request({ method: "POST", path: "/v1/rules/test", body: request });
  }

  async reload(): Promise<Record<string, unknown>> {
    return this.transport.request({ method: "POST", path: "/v1/rules/reload" });
  }

  async templates(): Promise<Record<string, unknown>[]> {
    return this.transport.request({ method: "GET", path: "/v1/rules/templates" });
  }

  async templatesByIndustry(industry: string): Promise<Record<string, unknown>[]> {
    return this.transport.request({ method: "GET", path: `/v1/rules/templates/${industry}` });
  }

  async seed(industry: string): Promise<Record<string, unknown>> {
    return this.transport.request({ method: "POST", path: `/v1/rules/seed/${industry}` });
  }
}
