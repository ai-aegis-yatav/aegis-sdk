import type { Transport } from "../transport";
import { Paginator } from "../pagination";
import type * as M from "../models/index";

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
  async embed(req: M.EmbedRequest): Promise<M.EmbedResponse> { return this.t.request({ method: "POST", path: "/v1/ml/embed", body: req }); }
  async embedBatch(texts: string[], model?: string): Promise<M.EmbedResponse[]> { return this.t.request({ method: "POST", path: "/v1/ml/embed/batch", body: { texts, model } }); }
  async classify(req: M.ClassifyMLRequest): Promise<M.ClassifyMLResponse> { return this.t.request({ method: "POST", path: "/v1/ml/classify", body: req }); }
  async similarity(req: M.SimilarityRequest): Promise<M.SimilarityResponse> { return this.t.request({ method: "POST", path: "/v1/ml/similarity", body: req }); }
}

export class NLP {
  constructor(private t: Transport) {}
  async detectLanguage(content: string): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v1/nlp/detect-language", body: { content } }); }
  async detectJailbreak(content: string): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v1/nlp/detect-jailbreak", body: { content } }); }
  async detectHarmful(content: string): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v1/nlp/detect-harmful", body: { content } }); }
}

export class AiAct {
  constructor(private t: Transport) {}
  async watermark(req: M.WatermarkRequest): Promise<M.WatermarkResponse> { return this.t.request({ method: "POST", path: "/v1/ai-act/watermark", body: req }); }
  async highImpactWatermark(req: M.WatermarkRequest): Promise<M.WatermarkResponse> { return this.t.request({ method: "POST", path: "/v1/ai-act/high-impact/watermark", body: req }); }
  async deepfakeLabel(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v1/ai-act/deepfake/label", body }); }
  async verify(content: string): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v1/ai-act/verify", body: { content } }); }
  async guidelines(): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v1/ai-act/guidelines" }); }
  async guardrailCheck(content: string): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v1/ai-act/guardrail/check", body: { content } }); }
  async piiDetect(req: M.PiiDetectRequest): Promise<M.PiiDetectResponse> { return this.t.request({ method: "POST", path: "/v1/ai-act/pii/detect", body: req }); }
  async riskAssess(systemDescription: string, domain?: string): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v1/ai-act/risk/assess", body: { system_description: systemDescription, domain } }); }
  async auditLogs(params?: Record<string, string>): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v1/ai-act/audit/logs", params }); }
}

// V2
export class Classify {
  constructor(private t: Transport) {}
  async classify(req: M.ContentClassifyRequest): Promise<M.ContentClassifyResponse> { return this.t.request({ method: "POST", path: "/v2/classify", body: req }); }
  async batch(requests: M.ContentClassifyRequest[]): Promise<M.ContentClassifyResponse[]> { return this.t.request({ method: "POST", path: "/v2/classify/batch", body: { requests } }); }
  async categories(): Promise<Record<string, unknown>[]> { return this.t.request({ method: "GET", path: "/v2/classify/categories" }); }
}

export class Jailbreak {
  constructor(private t: Transport) {}
  async detect(req: M.JailbreakDetectRequest): Promise<M.JailbreakDetectResponse> { return this.t.request({ method: "POST", path: "/v2/jailbreak/detect", body: req }); }
  async detectBatch(requests: M.JailbreakDetectRequest[]): Promise<M.JailbreakDetectResponse[]> { return this.t.request({ method: "POST", path: "/v2/jailbreak/detect/batch", body: { requests } }); }
  async types(): Promise<Record<string, unknown>[]> { return this.t.request({ method: "GET", path: "/v2/jailbreak/types" }); }
}

export class Safety {
  constructor(private t: Transport) {}
  async check(req: M.SafetyCheckRequest): Promise<M.SafetyCheckResponse> { return this.t.request({ method: "POST", path: "/v2/safety/check", body: req }); }
  async checkBatch(requests: M.SafetyCheckRequest[]): Promise<M.SafetyCheckResponse[]> { return this.t.request({ method: "POST", path: "/v2/safety/check/batch", body: { requests } }); }
  async categories(): Promise<Record<string, unknown>[]> { return this.t.request({ method: "GET", path: "/v2/safety/categories" }); }
  async backends(): Promise<Record<string, unknown>[]> { return this.t.request({ method: "GET", path: "/v2/safety/backends" }); }
}

export class Defense {
  constructor(private t: Transport) {}
  async paladinStats(): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v2/defense/paladin/stats" }); }
  async enableLayer(layerName: string): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: `/v2/defense/paladin/layer/${layerName}/enable` }); }
  async trustValidate(req: M.TrustValidateRequest): Promise<M.TrustValidateResponse> { return this.t.request({ method: "POST", path: "/v2/defense/trust/validate", body: req }); }
  async trustProfile(): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v2/defense/trust/profile" }); }
  async ragDetect(req: M.RagDetectRequest): Promise<M.RagDetectResponse> { return this.t.request({ method: "POST", path: "/v2/defense/rag/detect", body: req }); }
  async ragSecureQuery(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v2/defense/rag/secure-query", body }); }
  async circuitBreakerEvaluate(content: string): Promise<M.CircuitBreakerResponse> { return this.t.request({ method: "POST", path: "/v2/defense/circuit-breaker/evaluate", body: { content } }); }
  async circuitBreakerStatus(): Promise<M.CircuitBreakerStatus> { return this.t.request({ method: "GET", path: "/v2/defense/circuit-breaker/status" }); }
  async adaptiveEvaluate(content: string): Promise<M.AdaptiveEvalResponse> { return this.t.request({ method: "POST", path: "/v2/defense/adaptive/evaluate", body: { content } }); }
  async adaptiveLearn(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v2/defense/adaptive/learn", body }); }
}

export class Advanced {
  constructor(private t: Transport) {}
  async detect(req: M.AdvancedDetectRequest): Promise<M.AdvancedDetectResponse> { return this.t.request({ method: "POST", path: "/v2/advanced/detect", body: req }); }
  async hybridWeb(content: string): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v2/advanced/hybrid-web", body: { content } }); }
  async vsh(content: string): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v2/advanced/vsh", body: { content } }); }
  async fewShot(content: string): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v2/advanced/few-shot", body: { content } }); }
  async cot(content: string): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v2/advanced/cot", body: { content } }); }
  async acoustic(content: string): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v2/advanced/acoustic", body: { content } }); }
  async contextConfusion(content: string): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v2/advanced/context-confusion", body: { content } }); }
  async infoExtraction(content: string): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v2/advanced/info-extraction", body: { content } }); }
}

export class AdversaFlow {
  constructor(private t: Transport) {}
  campaigns(opts: { page?: number; limit?: number } = {}) { return new Paginator(this.t, "/v2/adversaflow/campaigns", { page: opts.page ?? 1, limit: opts.limit ?? 20 }); }
  async tree(): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v2/adversaflow/tree" }); }
  async trace(campaignId: string): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: `/v2/adversaflow/trace/${campaignId}` }); }
  async stats(campaignId: string): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: `/v2/adversaflow/stats/${campaignId}` }); }
  async record(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v2/adversaflow/record", body }); }
}

// V3
export class GuardNet {
  constructor(private t: Transport) {}
  async analyze(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/defense/guardnet", body: { content, ...opts } }); }
  async jbshield(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/defense/jbshield", body: { content, ...opts } }); }
  async ccfc(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/defense/ccfc", body: { content, ...opts } }); }
  async muli(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/defense/muli", body: { content, ...opts } }); }
  async unified(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/defense/unified", body: { content, ...opts } }); }
}

export class Agent {
  constructor(private t: Transport) {}
  async scan(req: M.AgentScanRequest): Promise<M.AgentScanResponse> { return this.t.request({ method: "POST", path: "/v3/agent/scan", body: req }); }
  async toolchain(req: M.ToolchainRequest): Promise<M.ToolchainResponse> { return this.t.request({ method: "POST", path: "/v3/agent/toolchain", body: req }); }
  async memoryPoisoning(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/agent/memory-poisoning", body }); }
  async reasoningHijack(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/agent/reasoning-hijack", body }); }
  async toolDisguise(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/agent/tool-disguise", body }); }
}

export class Anomaly {
  constructor(private t: Transport) {}
  async algorithms(): Promise<Record<string, unknown>[]> { return this.t.request({ method: "GET", path: "/v3/anomaly/algorithms" }); }
  async detect(req: M.AnomalyDetectRequest): Promise<M.AnomalyDetectResponse> { return this.t.request({ method: "POST", path: "/v3/anomaly/detect", body: req }); }
  async detectBatch(requests: M.AnomalyDetectRequest[]): Promise<M.AnomalyDetectResponse[]> { return this.t.request({ method: "POST", path: "/v3/anomaly/detect/batch", body: { requests } }); }
  events(opts: { page?: number; limit?: number } = {}) { return new Paginator(this.t, "/v3/anomaly/events", { page: opts.page ?? 1, limit: opts.limit ?? 20 }); }
  async stats(): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v3/anomaly/stats" }); }
}

export class Multimodal {
  constructor(private t: Transport) {}
  async scan(req: M.MultimodalScanRequest): Promise<M.MultimodalScanResponse> { return this.t.request({ method: "POST", path: "/v3/multimodal/scan", body: req }); }
  async imageAttack(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/multimodal/image-attack", body }); }
  async viscra(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/multimodal/viscra", body }); }
  async mml(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/multimodal/mml", body }); }
}

export class Evolution {
  constructor(private t: Transport) {}
  async generate(seedPrompt: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/evolution/generate", body: { seed_prompt: seedPrompt, ...opts } }); }
  async evolve(body: Record<string, unknown>): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/evolution/evolve", body }); }
  async stats(): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v3/evolution/stats" }); }
}

export class Saber {
  constructor(private t: Transport) {}
  async estimate(req: M.SaberEstimateRequest): Promise<M.SaberEstimateResponse> { return this.t.request({ method: "POST", path: "/v3/saber/estimate", body: req }); }
  async evaluate(req: M.SaberEvaluateRequest): Promise<M.SaberEvaluateResponse> { return this.t.request({ method: "POST", path: "/v3/saber/evaluate", body: req }); }
  async budget(): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: "/v3/saber/budget" }); }
  async compare(content: string, defenses: string[]): Promise<Record<string, unknown>> { return this.t.request({ method: "POST", path: "/v3/saber/compare", body: { content, defenses } }); }
  async report(reportId: string): Promise<Record<string, unknown>> { return this.t.request({ method: "GET", path: `/v3/saber/report/${reportId}` }); }
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
