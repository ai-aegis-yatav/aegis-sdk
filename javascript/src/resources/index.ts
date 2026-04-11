import type { Transport } from "../transport";
import { Paginator } from "../pagination";
import type * as M from "../models/index";

export { Orchestration } from "./orchestration";
export type {
  OrchestrationScenario,
  OrchestrationMode,
  EnsembleAlgorithm,
  Contributor,
  OrchestratedDecision,
  RunRequest as OrchestrationRunRequest,
  RunResponse as OrchestrationRunResponse,
  OrchestrationConfig,
  UpsertConfigRequest as OrchestrationUpsertConfigRequest,
  GridSearchJobRequest as OrchestrationGridSearchJobRequest,
  GridSearchJob as OrchestrationGridSearchJob,
  GridSearchResult as OrchestrationGridSearchResult,
  TimeseriesAnomalyRequest,
  TimeseriesAnomalyResponse,
} from "./orchestration";

export class Escalations {
  constructor(private t: Transport) {}
  async create(req: M.EscalationCreateRequest): Promise<M.Escalation> { return this.t.request({ method: "POST", path: "/v1/escalations", body: req }); }
  async get(id: string): Promise<M.Escalation> { return this.t.request({ method: "GET", path: `/v1/escalations/${id}` }); }
  list(opts: { page?: number; limit?: number } = {}) { return new Paginator<M.Escalation>(this.t, "/v1/escalations", { page: opts.page ?? 1, limit: opts.limit ?? 20 }); }
  async resolve(id: string, body: { resolution: string; notes?: string }): Promise<M.Escalation> { return this.t.request({ method: "POST", path: `/v1/escalations/${id}/resolve`, body }); }
  async assign(id: string, assignee: string): Promise<M.Escalation> { return this.t.request({ method: "POST", path: `/v1/escalations/${id}/assign`, body: { assignee } }); }
  async claim(id: string): Promise<M.Escalation> { return this.t.request({ method: "POST", path: `/v1/escalations/${id}/claim` }); }
  async stats(): Promise<M.EscalationStats> { return this.t.request({ method: "GET", path: "/v1/escalations/stats" }); }
}

export class Analytics {
  constructor(private t: Transport) {}
  async overview(params?: Record<string, string>): Promise<M.AnalyticsOverview> { return this.t.request({ method: "GET", path: "/v1/analytics/overview", params }); }
  async judgments(params?: Record<string, string>): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v1/analytics/judgments", params }); }
  async defenseLayers(params?: Record<string, string>): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v1/analytics/defense-layers", params }); }
  async threats(params?: Record<string, string>): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v1/analytics/threats", params }); }
  async performance(params?: Record<string, string>): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v1/analytics/performance", params }); }
}

export class EvidenceResource {
  constructor(private t: Transport) {}
  async get(id: string): Promise<M.Evidence> { return this.t.request({ method: "GET", path: `/v1/evidence/${id}` }); }
  list(opts: { page?: number; limit?: number } = {}) { return new Paginator<M.Evidence>(this.t, "/v1/evidence", { page: opts.page ?? 1, limit: opts.limit ?? 20 }); }
  async verify(id: string): Promise<M.EvidenceVerification> { return this.t.request({ method: "GET", path: `/v1/evidence/${id}/verify` }); }
  async forJudgment(judgmentId: string): Promise<M.Evidence[]> { return this.t.request({ method: "GET", path: `/v1/evidence/judgment/${judgmentId}` }); }
}

export class ML {
  constructor(private t: Transport) {}
  async health(): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v1/ml/health" }); }
  async embed(text: string, model?: string): Promise<Record<string, unknown>> {
    return this.t.request({ method: "POST", path: "/v1/ml/embed", body: { text, ...(model ? { model } : {}) } });
  }
  async embedBatch(texts: string[], model?: string): Promise<Record<string, unknown>> {
    return this.t.request({ method: "POST", path: "/v1/ml/embed/batch", body: { texts, ...(model ? { model } : {}) } });
  }
  async classify(text: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.t.request({ method: "POST", path: "/v1/ml/classify", body: { text, ...opts } });
  }
  async similarity(query: string, documents?: string[], opts?: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.t.request({ method: "POST", path: "/v1/ml/similarity", body: { query, ...(documents ? { documents } : {}), ...opts } });
  }
}

export class NLP {
  constructor(private t: Transport) {}
  async detectLanguage(content: string): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v1/nlp/detect-language", body: { text: content } }); }
  async detectJailbreak(content: string): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v1/nlp/detect-jailbreak", body: { text: content } }); }
  async detectHarmful(content: string): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v1/nlp/detect-harmful", body: { text: content } }); }
}

function _bytesOf(s: string): number[] {
  return Array.from(new TextEncoder().encode(s));
}
function _watermarkBody(content: string, overrides?: Record<string, unknown>): Record<string, unknown> {
  return {
    content_type: "text",
    content: _bytesOf(content),
    ai_model: { model_name: "smoke-test", model_version: "1.0", model_type: "text-generation", provider: "aegis" },
    service_provider: { provider_name: "smoke-test", provider_id: "aegis-smoke" },
    risk_level: "limited",
    watermark_config: { method: "invisible", strength: 0.5 },
    ...overrides,
  };
}
function _highImpactBody(content: string, overrides?: Record<string, unknown>): Record<string, unknown> {
  return {
    domain: "education",
    content_type: "text",
    content: _bytesOf(content),
    ai_model: { model_name: "smoke-test", model_version: "1.0", model_type: "text-generation", provider: "aegis" },
    risk_assessment: { risk_level: "high", impact_areas: ["education"] },
    watermark_config: { method: "invisible", strength: 0.9, high_impact: true },
    ...overrides,
  };
}
function _verifyBody(content: string, overrides?: Record<string, unknown>): Record<string, unknown> {
  return {
    content_type: "text",
    content: _bytesOf(content),
    check_tampering: true,
    include_provenance: false,
    ...overrides,
  };
}

export class AiAct {
  constructor(private t: Transport) {}
  async watermark(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.t.request({ method: "POST", path: "/v1/ai-act/watermark", body: _watermarkBody(content, opts) });
  }
  async highImpactWatermark(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.t.request({ method: "POST", path: "/v1/ai-act/high-impact-watermark", body: _highImpactBody(content, opts) });
  }
  async deepfakeLabel(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v1/ai-act/deepfake-label", body }); }
  async verify(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.t.request({ method: "POST", path: "/v1/ai-act/verify", body: _verifyBody(content, opts) });
  }
  async guidelines(): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v1/ai-act/guidelines" }); }
  async guardrailCheck(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.t.request({
      method: "POST", path: "/v1/ai-act/guardrail-check",
      body: { content, content_type: "text", check_prompt_injection: true, check_pii: true, check_toxicity: true, mask_pii: false, use_llm: false, ...opts },
    });
  }
  async piiDetect(content: string, opts?: { mask?: boolean; entity_types?: string[] }): Promise<Record<string, unknown>> {
    return this.t.request({
      method: "POST", path: "/v1/ai-act/pii-detect",
      body: { content, mask: opts?.mask ?? false, entity_types: opts?.entity_types ?? [] },
    });
  }
  async riskAssess(systemDescription: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.t.request({
      method: "POST", path: "/v1/ai-act/risk-assess",
      body: {
        system_name: (opts?.system_name as string) ?? "smoke-test-system",
        model_type: (opts?.model_type as string) ?? "text-generation",
        application_domains: (opts?.application_domains as string[]) ?? ["education"],
        compute_flops: opts?.compute_flops ?? null,
        handles_personal_data: opts?.handles_personal_data ?? false,
        system_description: systemDescription,
        ...opts,
      },
    });
  }
  async auditLogs(params?: Record<string, string>): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v1/ai-act/audit-logs", params }); }
}

function _toText(item: any): string {
  if (typeof item === "string") return item;
  if (item && typeof item === "object") return item.text ?? item.content ?? "";
  return "";
}

// V2
export class Classify {
  constructor(private t: Transport) {}
  async classify(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.t.request({ method: "POST", path: "/v2/classify", body: { text: content, ...opts } });
  }
  async batch(requests: any[]): Promise<Record<string, unknown>> {
    return this.t.request({ method: "POST", path: "/v2/classify/batch", body: { texts: requests.map(_toText) } });
  }
  async categories(): Promise<Record<string, unknown>[]> { return this.t.request({ method: "GET", path: "/v2/classify/categories" }); }
}

export class Jailbreak {
  constructor(private t: Transport) {}
  async detect(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.t.request({ method: "POST", path: "/v2/jailbreak/detect", body: { text: content, ...opts } });
  }
  async detectBatch(requests: any[]): Promise<Record<string, unknown>> {
    return this.t.request({ method: "POST", path: "/v2/jailbreak/detect/batch", body: { texts: requests.map(_toText) } });
  }
  async types(): Promise<Record<string, unknown>[]> { return this.t.request({ method: "GET", path: "/v2/jailbreak/types" }); }
}

export class Safety {
  constructor(private t: Transport) {}
  async check(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.t.request({ method: "POST", path: "/v2/safety/check", body: { text: content, ...opts } });
  }
  async checkBatch(requests: any[]): Promise<Record<string, unknown>> {
    return this.t.request({ method: "POST", path: "/v2/safety/check/batch", body: { texts: requests.map(_toText) } });
  }
  async categories(): Promise<Record<string, unknown>[]> { return this.t.request({ method: "GET", path: "/v2/safety/categories" }); }
  async backends(): Promise<Record<string, unknown>[]> { return this.t.request({ method: "GET", path: "/v2/safety/backends" }); }
}

export class Defense {
  constructor(private t: Transport) {}
  async paladinStats(): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v2/defense/paladin/stats" }); }
  async enableLayer(layerName: string): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: `/v2/defense/paladin/layer/${layerName}/enable` }); }
  async trustValidate(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.t.request({ method: "POST", path: "/v2/defense/trust/validate", body: { content, ...opts } });
  }
  async trustProfile(): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v2/defense/trust/profile" }); }
  async ragDetect(query: string, documents?: string[], opts?: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.t.request({ method: "POST", path: "/v2/defense/rag/detect", body: { content: query, ...(documents ? { documents } : {}), ...opts } });
  }
  async ragSecureQuery(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v2/defense/rag/secure-query", body }); }
  async circuitBreakerEvaluate(content: string): Promise<M.CircuitBreakerResponse> { return this.t.request({ method: "POST", path: "/v2/defense/circuit-breaker/evaluate", body: { content } }); }
  async circuitBreakerStatus(): Promise<M.CircuitBreakerStatus> { return this.t.request({ method: "GET", path: "/v2/defense/circuit-breaker/status" }); }
  async adaptiveEvaluate(content: string): Promise<M.AdaptiveEvalResponse> { return this.t.request({ method: "POST", path: "/v2/defense/adaptive/evaluate", body: { content } }); }
  async adaptiveLearn(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v2/defense/adaptive/learn", body }); }
}

export class Advanced {
  constructor(private t: Transport) {}
  async detect(content: string): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v2/advanced/detect", body: { text: content } }); }
  async hybridWeb(content: string): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v2/advanced/hybrid-web", body: { text: content } }); }
  async vsh(content: string): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v2/advanced/vsh", body: { text: content } }); }
  async fewShot(content: string): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v2/advanced/few-shot", body: { text: content } }); }
  async cot(content: string): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v2/advanced/cot", body: { text: content } }); }
  async acoustic(content: string): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v2/advanced/acoustic", body: { text: content } }); }
  async contextConfusion(content: string): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v2/advanced/context-confusion", body: { text: content } }); }
  async infoExtraction(content: string): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v2/advanced/info-extraction", body: { text: content } }); }
}

export class AdversaFlow {
  constructor(private t: Transport) {}
  campaigns(opts: { page?: number; limit?: number } = {}) { return new Paginator(this.t, "/v2/adversaflow/campaigns", { page: opts.page ?? 1, limit: opts.limit ?? 20 }); }
  async tree(campaignId: string): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: `/v2/adversaflow/tree/${campaignId}` }); }
  async trace(campaignId: string, nodeId: string): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: `/v2/adversaflow/trace/${campaignId}/${nodeId}` }); }
  async stats(campaignId: string): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: `/v2/adversaflow/stats/${campaignId}` }); }
  async metrics(campaignId: string): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: `/v2/adversaflow/metrics/${campaignId}` }); }
  async record(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v2/adversaflow/record", body }); }
}

// V3
export class GuardNet {
  constructor(private t: Transport) {}
  async analyze(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/defense/guardnet", body: { text: content, ...opts } }); }
  async jbshield(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/defense/jbshield", body: { text: content, ...opts } }); }
  async ccfc(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/defense/ccfc", body: { text: content, ...opts } }); }
  async muli(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/defense/muli", body: { text: content, ...opts } }); }
  async unified(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/defense/unified", body: { text: content, ...opts } }); }
}

export class Agent {
  constructor(private t: Transport) {}
  async scan(prompt: string, opts?: { external_data?: string[]; session_id?: string; user_id?: string; agent_type?: string; context?: Record<string, unknown> }): Promise<Record<string, unknown>> {
    return this.t.request({
      method: "POST", path: "/v3/agent/scan",
      body: {
        prompt,
        external_data: opts?.external_data ?? [],
        session_id: opts?.session_id ?? (globalThis.crypto?.randomUUID?.() ?? "smoke-session"),
        user_id: opts?.user_id ?? "sdk-smoke",
        ...(opts?.agent_type ? { agent_type: opts.agent_type } : {}),
        ...(opts?.context ? { context: opts.context } : {}),
      },
    });
  }
  async toolchain(tools: any[], opts?: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/agent/toolchain", body: { tools, ...opts } }); }
  async memoryPoisoning(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/agent/memory-poisoning", body }); }
  async reasoningHijack(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/agent/reasoning-hijack", body }); }
  async toolDisguise(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/agent/tool-disguise", body }); }
}

function _anomalyDetectBody(opts: { metric?: string; algorithm?: string; value?: number; history?: number[]; data_points?: any[]; threshold?: number; [k: string]: any }): Record<string, unknown> {
  const body: Record<string, unknown> = { algorithm: opts.algorithm ?? "zscore" };
  if (opts.metric != null) body.metric = opts.metric;
  if (opts.data_points) {
    body.data_points = opts.data_points;
  } else if (opts.history) {
    const now = Math.floor(Date.now() / 1000);
    const points = opts.history.map((v, i) => ({ timestamp: now - (opts.history!.length - i) * 60, value: v }));
    if (opts.value != null) points.push({ timestamp: now, value: opts.value });
    body.data_points = points;
  }
  if (opts.threshold != null) body.threshold = opts.threshold;
  for (const k of Object.keys(opts)) {
    if (!["metric", "algorithm", "value", "history", "data_points", "threshold"].includes(k)) body[k] = opts[k];
  }
  return body;
}

export class Anomaly {
  constructor(private t: Transport) {}
  async algorithms(): Promise<Record<string, unknown>[]> {
    const data = await this.t.request<any>({ method: "GET", path: "/v3/anomaly/algorithms" });
    if (Array.isArray(data)) return data;
    return data?.algorithms ?? [];
  }
  async detect(opts: { metric?: string; algorithm?: string; value?: number; history?: number[]; data_points?: any[]; threshold?: number }): Promise<Record<string, unknown>> {
    return this.t.request({ method: "POST", path: "/v3/anomaly/detect", body: _anomalyDetectBody(opts) });
  }
  async events(opts: { limit?: number; range?: string; min_score?: number } = {}): Promise<Record<string, unknown>> {
    return this.t.request({ method: "GET", path: "/v3/anomaly/events", params: { limit: opts.limit ?? 20, ...(opts.range ? { range: opts.range } : {}), ...(opts.min_score != null ? { min_score: opts.min_score } : {}) } as any });
  }
  async stats(): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v3/anomaly/stats" }); }
}

export class Multimodal {
  constructor(private t: Transport) {}
  async scan(content: string | null, opts?: { image?: Record<string, unknown>; audio_transcription?: string; check_types?: string[] }): Promise<Record<string, unknown>> {
    const body: Record<string, unknown> = {};
    if (content != null) body.text = content;
    if (opts?.image) body.image = opts.image;
    if (opts?.audio_transcription) body.audio_transcription = opts.audio_transcription;
    if (opts?.check_types) body.check_types = opts.check_types;
    return this.t.request({ method: "POST", path: "/v3/multimodal/scan", body });
  }
  async image(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/multimodal/image", body }); }
  async viscra(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/multimodal/viscra", body }); }
  async mml(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/multimodal/mml", body }); }
  // Backwards-compat alias
  async imageAttack(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.image(body); }
}

export class Evolution {
  constructor(private t: Transport) {}
  async generate(seedPrompt: string, opts?: { categories?: string[]; attack_type?: string; count?: number; difficulty?: string; include_multi_turn?: boolean; mutation_rate?: number }): Promise<Record<string, unknown>> {
    return this.t.request({
      method: "POST", path: "/v3/evolution/generate",
      body: {
        target_behavior: seedPrompt,
        categories: opts?.categories ?? ["jailbreak"],
        count: opts?.count ?? 10,
        difficulty: opts?.difficulty ?? "medium",
        include_multi_turn: opts?.include_multi_turn ?? false,
        ...(opts?.attack_type ? { attack_type: opts.attack_type } : {}),
        ...(opts?.mutation_rate != null ? { mutation_rate: opts.mutation_rate } : {}),
      },
    });
  }
  async evolve(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/evolution/evolve", body }); }
  async stats(): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v3/evolution/stats" }); }
}

export class Saber {
  constructor(private t: Transport) {}
  async estimate(content?: any, opts?: Record<string, unknown>): Promise<Record<string, unknown>> {
    const queries = Array.isArray(content) ? content : [{ query_id: "default", total_trials: 100, success_count: 5, category: "smoke" }];
    return this.t.request({ method: "POST", path: "/v3/saber/estimate", body: { queries, ...opts } });
  }
  async evaluate(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.t.request({ method: "POST", path: "/v3/saber/evaluate", body: { content, ...opts } });
  }
  async budget(opts?: { tau?: number; alpha?: number; beta?: number }): Promise<Record<string, unknown>> {
    return this.t.request({ method: "GET", path: "/v3/saber/budget", params: { tau: opts?.tau ?? 0.5, ...(opts?.alpha != null ? { alpha: opts.alpha } : {}), ...(opts?.beta != null ? { beta: opts.beta } : {}) } as any });
  }
  async compare(content: string, defenses: string[]): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/saber/compare", body: { content, defenses } }); }
  async report(reportId: string): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: `/v3/saber/report/${reportId}` }); }
}

export class Dreamdojo {
  constructor(private t: Transport) {}
  async validateAction(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/dreamdojo/validate-action", body }); }
  async validateInput(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/dreamdojo/validate-input", body }); }
  async validatePipeline(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/dreamdojo/validate-pipeline", body }); }
  async validateLatent(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/dreamdojo/validate-latent", body }); }
  async embodiments(): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v3/dreamdojo/embodiments" }); }
}

export class Military {
  constructor(private t: Transport) {}
  async antiSpoofing(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/military/anti-spoofing/analyze", body }); }
  async classification(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/military/classification/analyze", body }); }
  async commandChain(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/military/command-chain/analyze", body }); }
  async crossDomain(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/military/cross-domain/analyze", body }); }
  async opsec(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/military/opsec/analyze", body }); }
  async roe(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/military/roe/analyze", body }); }
  async tacticalAutonomy(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/military/tactical-autonomy/analyze", body }); }
  async orchestrate(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/military/orchestrate", body }); }
  async status(): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v3/military/status" }); }
}

export class GuardModel {
  constructor(private t: Transport) {}
  async stats(): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v3/guard-model/stats" }); }
  async performance(): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v3/guard-model/performance" }); }
  async train(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/guard-model/train", body }); }
  async trainStatus(): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v3/guard-model/train/status" }); }
  async trainCancel(): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/guard-model/train/cancel" }); }
}

export class Korean {
  constructor(private t: Transport) {}
  async analyze(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/korean/analyze", body }); }
}

export class Pipeline {
  constructor(private t: Transport) {}
  async run(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/pipeline/run", body }); }
}

export class Reports {
  constructor(private t: Transport) {}
  async generate(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/reports/generate", body }); }
}

export class TokenMonitor {
  constructor(private t: Transport) {}
  async usage(params?: Record<string, string>): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v3/token-monitor/usage", params }); }
  async listQuotas(): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v3/token-monitor/quotas" }); }
  async createQuota(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/token-monitor/quotas", body }); }
  async updateQuota(id: string, body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "PATCH", path: `/v3/token-monitor/quotas/${id}`, body }); }
  async listAlerts(params?: Record<string, string>): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v3/token-monitor/alerts", params }); }
  async updateAlert(id: string, body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "PATCH", path: `/v3/token-monitor/alerts/${id}`, body }); }
  async overview(): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v3/token-monitor/overview" }); }
}

export class V3Analytics {
  constructor(private t: Transport) {}
  async explain(judgmentId: string): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: `/v3/analytics/explain/${judgmentId}` }); }
  async layerStats(params?: Record<string, string>): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v3/analytics/layer-stats", params }); }
  async attackClusters(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/analytics/attack-clusters", body }); }
  async baseline(params?: Record<string, string>): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v3/analytics/baseline", params }); }
}

// Ops
export class Ops {
  constructor(private t: Transport) {}
  async ciGate(req: M.CiGateRequest): Promise<M.CiGateResponse> { return this.t.request({ method: "POST", path: "/ops/evalops/ci-gate", body: req }); }
  async benchmark(name: string, body?: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: `/ops/evalops/benchmark/${name}`, body }); }
  async getThresholds(): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/ops/evalops/thresholds" }); }
  async setThresholds(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/ops/evalops/thresholds", body }); }
  async redteamStats(): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/ops/redteam/stats" }); }
  async attackLibrary(): Promise<Record<string, unknown>[]> { return this.t.request({ method: "GET", path: "/ops/redteam/attack-library" }); }
  async attackLibraryByCategory(category: string): Promise<Record<string, unknown>[]> { return this.t.request({ method: "GET", path: `/ops/redteam/attack-library/${category}` }); }
}

// API Keys
export class ApiKeys {
  constructor(private t: Transport) {}
  async create(req: M.ApiKeyCreateRequest): Promise<M.ApiKeyCreateResponse> { return this.t.request({ method: "POST", path: "/v1/api-keys", body: req }); }
  list(opts: { page?: number; limit?: number } = {}) { return new Paginator<M.ApiKey>(this.t, "/v1/api-keys", { page: opts.page ?? 1, limit: opts.limit ?? 20 }); }
  async get(keyId: string): Promise<M.ApiKey> { return this.t.request({ method: "GET", path: `/v1/api-keys/${keyId}` }); }
  async revoke(keyId: string): Promise<void> { await this.t.request({ method: "POST", path: `/v1/api-keys/${keyId}/revoke` }); }
  async delete(keyId: string): Promise<void> { await this.t.request({ method: "DELETE", path: `/v1/api-keys/${keyId}` }); }
}
