// src/errors.ts
var AegisError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "AegisError";
  }
};
var ApiError = class extends AegisError {
  statusCode;
  errorCode;
  requestId;
  body;
  constructor(message, statusCode, opts) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errorCode = opts?.errorCode;
    this.requestId = opts?.requestId;
    this.body = opts?.body;
  }
};
var AuthenticationError = class extends ApiError {
  constructor(message = "Invalid or expired API key", opts) {
    super(message, 401, opts);
    this.name = "AuthenticationError";
  }
};
var TierAccessError = class extends ApiError {
  requiredTier;
  upgradeUrl;
  constructor(message, opts) {
    super(message, 403, opts);
    this.name = "TierAccessError";
    this.requiredTier = opts?.requiredTier;
    this.upgradeUrl = opts?.upgradeUrl;
  }
};
var QuotaExceededError = class extends ApiError {
  limit;
  used;
  resetAt;
  constructor(message = "Monthly quota exceeded", opts) {
    super(message, 429, opts);
    this.name = "QuotaExceededError";
    this.limit = opts?.limit;
    this.used = opts?.used;
    this.resetAt = opts?.resetAt;
  }
};
var RateLimitError = class extends ApiError {
  retryAfter;
  constructor(message = "Rate limit exceeded", opts) {
    super(message, 429, opts);
    this.name = "RateLimitError";
    this.retryAfter = opts?.retryAfter;
  }
};
var ValidationError = class extends ApiError {
  constructor(message, statusCode = 400, opts) {
    super(message, statusCode, opts);
    this.name = "ValidationError";
  }
};
var NotFoundError = class extends ApiError {
  constructor(message = "Resource not found", opts) {
    super(message, 404, opts);
    this.name = "NotFoundError";
  }
};
var ServerError = class extends ApiError {
  constructor(message = "Internal server error", statusCode = 500, opts) {
    super(message, statusCode, opts);
    this.name = "ServerError";
  }
};
var NetworkError = class extends AegisError {
  cause;
  constructor(message = "Network error", cause) {
    super(message);
    this.name = "NetworkError";
    this.cause = cause;
  }
};

// src/transport.ts
var Transport = class {
  config;
  quota = {};
  constructor(config) {
    this.config = config;
  }
  async request(opts) {
    let lastError;
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        const url = this.buildUrl(opts.path, opts.params);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "aegis-js-sdk/0.1.0",
          ...this.authHeaders(),
          ...this.config.customHeaders,
          ...opts.headers
        };
        const response = await fetch(url, {
          method: opts.method,
          headers,
          body: opts.body ? JSON.stringify(opts.body) : void 0,
          signal: opts.signal ?? controller.signal
        });
        clearTimeout(timeoutId);
        const requestId = response.headers.get("x-request-id") ?? void 0;
        this.updateQuota(response.headers);
        if (response.status === 429 && attempt < this.config.maxRetries) {
          const retryAfter = response.headers.get("retry-after");
          const wait = retryAfter ? parseFloat(retryAfter) * 1e3 : this.backoff(attempt);
          await sleep(wait);
          continue;
        }
        if (response.status >= 500 && attempt < this.config.maxRetries) {
          await sleep(this.backoff(attempt));
          continue;
        }
        if (!response.ok) {
          const body = await response.json().catch(() => ({ error: response.statusText }));
          this.throwForStatus(response.status, body, requestId);
        }
        if (response.status === 204) return void 0;
        return await response.json();
      } catch (err) {
        if (err instanceof AuthenticationError || err instanceof TierAccessError || err instanceof ValidationError || err instanceof NotFoundError || err instanceof QuotaExceededError) {
          throw err;
        }
        lastError = err;
        if (attempt < this.config.maxRetries) {
          await sleep(this.backoff(attempt));
          continue;
        }
      }
    }
    throw new NetworkError("Max retries exceeded", lastError);
  }
  async *stream(opts) {
    const url = this.buildUrl(opts.path, opts.params);
    const headers = {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      "User-Agent": "aegis-js-sdk/0.1.0",
      ...this.authHeaders(),
      ...this.config.customHeaders
    };
    const response = await fetch(url, {
      method: opts.method,
      headers,
      body: opts.body ? JSON.stringify(opts.body) : void 0
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({ error: response.statusText }));
      const requestId = response.headers.get("x-request-id") ?? void 0;
      this.throwForStatus(response.status, body, requestId);
    }
    if (!response.body) return;
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (line.startsWith("data:")) {
            const data = line.slice(5).trim();
            if (data === "[DONE]") return;
            yield data;
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
  authHeaders() {
    if (this.config.apiKey) {
      return { "X-API-Key": this.config.apiKey };
    }
    if (this.config.accessToken) {
      return { Authorization: `Bearer ${this.config.accessToken}` };
    }
    return {};
  }
  buildUrl(path, params) {
    const url = new URL(path, this.config.baseUrl);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== void 0) url.searchParams.set(key, String(value));
      }
    }
    return url.toString();
  }
  updateQuota(headers) {
    const limit = headers.get("x-quota-limit");
    const used = headers.get("x-quota-used");
    const remaining = headers.get("x-quota-remaining");
    if (limit) this.quota.limit = parseInt(limit, 10);
    if (used) this.quota.used = parseInt(used, 10);
    if (remaining) this.quota.remaining = parseInt(remaining, 10);
  }
  throwForStatus(status, body, requestId) {
    const message = body.error ?? body.message ?? `HTTP ${status}`;
    const opts = { requestId, body };
    if (status === 401) throw new AuthenticationError(message, opts);
    if (status === 403) throw new TierAccessError(message, { ...opts, requiredTier: body.required_tier, upgradeUrl: body.upgrade_url });
    if (status === 404) throw new NotFoundError(message, opts);
    if (status === 429) {
      if (body.code === "QUOTA_EXCEEDED" || message.toLowerCase().includes("quota")) {
        throw new QuotaExceededError(message, { ...opts, limit: body.limit, used: body.used, resetAt: body.reset_at });
      }
      throw new RateLimitError(message, opts);
    }
    if (status === 400 || status === 422) throw new ValidationError(message, status, opts);
    if (status >= 500) throw new ServerError(message, status, opts);
    throw new ServerError(message, status, opts);
  }
  backoff(attempt) {
    return 500 * Math.pow(2, attempt);
  }
};
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// src/pagination.ts
var Paginator = class {
  transport;
  path;
  params;
  currentPage;
  exhausted = false;
  _total;
  constructor(transport, path, params = {}) {
    this.transport = transport;
    this.path = path;
    this.params = params;
    this.currentPage = params.page ?? 1;
  }
  get total() {
    return this._total;
  }
  extractItems(data) {
    if (Array.isArray(data)) return data;
    if (!data || typeof data !== "object") return [];
    if (Array.isArray(data.items)) return data.items;
    for (const key of [
      "results",
      "data",
      "events",
      "campaigns",
      "rules",
      "judgments",
      "escalations",
      "evidence",
      "api_keys",
      "templates"
    ]) {
      if (Array.isArray(data[key])) return data[key];
    }
    return [];
  }
  async *[Symbol.asyncIterator]() {
    while (!this.exhausted) {
      const data = await this.transport.request({
        method: "GET",
        path: this.path,
        params: { ...this.params, page: this.currentPage }
      });
      this._total = data?.total;
      const items = this.extractItems(data);
      for (const item of items) yield item;
      const limit = this.params.limit ?? 20;
      if (!items.length || items.length < limit || data?.has_more === false) {
        this.exhausted = true;
      }
      this.currentPage++;
    }
  }
  async toArray() {
    const results = [];
    for await (const item of this) {
      results.push(item);
    }
    return results;
  }
};

// src/resources/judge.ts
var Judge = class {
  constructor(transport) {
    this.transport = transport;
  }
  transport;
  async create(request) {
    return this.transport.request({ method: "POST", path: "/v1/judge", body: request });
  }
  async batch(requests) {
    const data = await this.transport.request({
      method: "POST",
      path: "/v1/judge/batch",
      body: { requests }
    });
    return data.results ?? data;
  }
  async *stream(request) {
    for await (const data of this.transport.stream({ method: "POST", path: "/v1/judge/stream", body: request })) {
      yield JSON.parse(data);
    }
  }
  list(opts = {}) {
    return new Paginator(this.transport, "/v1/judgments", { page: opts.page ?? 1, limit: opts.limit ?? 20 });
  }
  async get(judgmentId) {
    return this.transport.request({ method: "GET", path: `/v1/judgments/${judgmentId}` });
  }
};

// src/resources/rules.ts
var Rules = class {
  constructor(transport) {
    this.transport = transport;
  }
  transport;
  async create(request) {
    return this.transport.request({ method: "POST", path: "/v1/rules", body: request });
  }
  async get(ruleId) {
    return this.transport.request({ method: "GET", path: `/v1/rules/${ruleId}` });
  }
  async update(ruleId, request) {
    return this.transport.request({ method: "PUT", path: `/v1/rules/${ruleId}`, body: request });
  }
  async delete(ruleId) {
    await this.transport.request({ method: "DELETE", path: `/v1/rules/${ruleId}` });
  }
  list(opts = {}) {
    return new Paginator(this.transport, "/v1/rules", { page: opts.page ?? 1, limit: opts.limit ?? 20 });
  }
  async test(request) {
    return this.transport.request({ method: "POST", path: "/v1/rules/test", body: request });
  }
  async reload() {
    return this.transport.request({ method: "POST", path: "/v1/rules/reload" });
  }
  async templates() {
    return this.transport.request({ method: "GET", path: "/v1/rules/templates" });
  }
  async templatesByIndustry(industry) {
    return this.transport.request({ method: "GET", path: `/v1/rules/templates/${industry}` });
  }
  async seed(industry) {
    return this.transport.request({ method: "POST", path: `/v1/rules/seed/${industry}` });
  }
};

// src/resources/orchestration.ts
var Orchestration = class {
  constructor(t) {
    this.t = t;
  }
  t;
  // --- Runs (v1 always included) ---
  async _run(path, req) {
    const res = await this.t.request({
      method: "POST",
      path,
      body: req
    });
    return res.decision;
  }
  run(req) {
    return this._run("/v1/orchestration/runs", req);
  }
  basic(req) {
    return this._run("/v1/orchestration/runs/basic", req);
  }
  standard(req) {
    return this._run("/v1/orchestration/runs/standard", req);
  }
  full(req) {
    return this._run("/v1/orchestration/runs/full", req);
  }
  advanced(req) {
    return this._run("/v1/orchestration/runs/advanced", req);
  }
  agent(req) {
    return this._run("/v1/orchestration/runs/agent", req);
  }
  anomaly(req) {
    return this._run("/v1/orchestration/runs/anomaly", req);
  }
  pii(req) {
    return this._run("/v1/orchestration/runs/pii", req);
  }
  anomalyTimeseries(req) {
    return this.t.request({
      method: "POST",
      path: "/v1/orchestration/runs/anomaly/timeseries",
      body: req
    });
  }
  // --- Tenant configs ---
  getConfig(tenantId, scenario) {
    return this.t.request({
      method: "GET",
      path: `/v1/orchestration/configs/${tenantId}/${scenario}`
    });
  }
  upsertConfig(tenantId, scenario, body) {
    return this.t.request({
      method: "PUT",
      path: `/v1/orchestration/configs/${tenantId}/${scenario}`,
      body
    });
  }
  // --- Gridsearch (synchronous, smoke-test variant) ---
  gridsearch(req) {
    return this.t.request({
      method: "POST",
      path: "/v1/orchestration/gridsearch",
      body: req
    });
  }
  // --- Gridsearch jobs (async, DB-persisted) ---
  createGridsearchJob(req) {
    return this.t.request({
      method: "POST",
      path: "/v1/orchestration/gridsearch/jobs",
      body: req
    });
  }
  getGridsearchJob(jobId) {
    return this.t.request({
      method: "GET",
      path: `/v1/orchestration/gridsearch/jobs/${jobId}`
    });
  }
  listGridsearchResults(jobId) {
    return this.t.request({
      method: "GET",
      path: `/v1/orchestration/gridsearch/jobs/${jobId}/results`
    });
  }
  promoteGridsearchJob(jobId, body) {
    return this.t.request({
      method: "POST",
      path: `/v1/orchestration/gridsearch/jobs/${jobId}/promote`,
      body
    });
  }
  listDatasets() {
    return this.t.request({
      method: "GET",
      path: "/v1/orchestration/datasets"
    });
  }
  // --- V3 Integrated Pipeline (RedTeam → LLM → PALADIN → SABER → Evolution) ---
  pipelineRun(req) {
    return this.t.request({
      method: "POST",
      path: "/v3/pipeline/run",
      body: req
    });
  }
  // --- V3 Military Orchestrator (7 defense modules) ---
  militaryOrchestrate(req) {
    return this.t.request({
      method: "POST",
      path: "/v3/military/orchestrate",
      body: req
    });
  }
  militaryStatus() {
    return this.t.request({
      method: "GET",
      path: "/v3/military/status"
    });
  }
};

// src/resources/index.ts
var Escalations = class {
  constructor(t) {
    this.t = t;
  }
  t;
  async create(req) {
    return this.t.request({ method: "POST", path: "/v1/escalations", body: req });
  }
  async get(id) {
    return this.t.request({ method: "GET", path: `/v1/escalations/${id}` });
  }
  list(opts = {}) {
    return new Paginator(this.t, "/v1/escalations", { page: opts.page ?? 1, limit: opts.limit ?? 20 });
  }
  async resolve(id, body) {
    return this.t.request({ method: "POST", path: `/v1/escalations/${id}/resolve`, body });
  }
  async assign(id, assignee) {
    return this.t.request({ method: "POST", path: `/v1/escalations/${id}/assign`, body: { assignee } });
  }
  async claim(id) {
    return this.t.request({ method: "POST", path: `/v1/escalations/${id}/claim` });
  }
  async stats() {
    return this.t.request({ method: "GET", path: "/v1/escalations/stats" });
  }
};
var Analytics = class {
  constructor(t) {
    this.t = t;
  }
  t;
  async overview(params) {
    return this.t.request({ method: "GET", path: "/v1/analytics/overview", params });
  }
  async judgments(params) {
    return this.t.request({ method: "GET", path: "/v1/analytics/judgments", params });
  }
  async defenseLayers(params) {
    return this.t.request({ method: "GET", path: "/v1/analytics/defense-layers", params });
  }
  async threats(params) {
    return this.t.request({ method: "GET", path: "/v1/analytics/threats", params });
  }
  async performance(params) {
    return this.t.request({ method: "GET", path: "/v1/analytics/performance", params });
  }
};
var EvidenceResource = class {
  constructor(t) {
    this.t = t;
  }
  t;
  async get(id) {
    return this.t.request({ method: "GET", path: `/v1/evidence/${id}` });
  }
  list(opts = {}) {
    return new Paginator(this.t, "/v1/evidence", { page: opts.page ?? 1, limit: opts.limit ?? 20 });
  }
  async verify(id) {
    return this.t.request({ method: "GET", path: `/v1/evidence/${id}/verify` });
  }
  async forJudgment(judgmentId) {
    return this.t.request({ method: "GET", path: `/v1/evidence/judgment/${judgmentId}` });
  }
};
var ML = class {
  constructor(t) {
    this.t = t;
  }
  t;
  async health() {
    return this.t.request({ method: "GET", path: "/v1/ml/health" });
  }
  async embed(text, model) {
    return this.t.request({ method: "POST", path: "/v1/ml/embed", body: { text, ...model ? { model } : {} } });
  }
  async embedBatch(texts, model) {
    return this.t.request({ method: "POST", path: "/v1/ml/embed/batch", body: { texts, ...model ? { model } : {} } });
  }
  async classify(text, opts) {
    return this.t.request({ method: "POST", path: "/v1/ml/classify", body: { text, ...opts } });
  }
  async similarity(query, documents, opts) {
    return this.t.request({ method: "POST", path: "/v1/ml/similarity", body: { query, ...documents ? { documents } : {}, ...opts } });
  }
};
var NLP = class {
  constructor(t) {
    this.t = t;
  }
  t;
  async detectLanguage(content) {
    return this.t.request({ method: "POST", path: "/v1/nlp/detect-language", body: { text: content } });
  }
  async detectJailbreak(content) {
    return this.t.request({ method: "POST", path: "/v1/nlp/detect-jailbreak", body: { text: content } });
  }
  async detectHarmful(content) {
    return this.t.request({ method: "POST", path: "/v1/nlp/detect-harmful", body: { text: content } });
  }
};
function _bytesOf(s) {
  return Array.from(new TextEncoder().encode(s));
}
function _watermarkBody(content, overrides) {
  return {
    content_type: "text",
    content: _bytesOf(content),
    ai_model: { model_name: "smoke-test", model_version: "1.0", model_type: "text-generation", provider: "aegis" },
    service_provider: { provider_name: "smoke-test", provider_id: "aegis-smoke" },
    risk_level: "limited",
    watermark_config: { method: "invisible", strength: 0.5 },
    ...overrides
  };
}
function _highImpactBody(content, overrides) {
  return {
    domain: "education",
    content_type: "text",
    content: _bytesOf(content),
    ai_model: { model_name: "smoke-test", model_version: "1.0", model_type: "text-generation", provider: "aegis" },
    risk_assessment: { risk_level: "high", impact_areas: ["education"] },
    watermark_config: { method: "invisible", strength: 0.9, high_impact: true },
    ...overrides
  };
}
function _verifyBody(content, overrides) {
  return {
    content_type: "text",
    content: _bytesOf(content),
    check_tampering: true,
    include_provenance: false,
    ...overrides
  };
}
var AiAct = class {
  constructor(t) {
    this.t = t;
  }
  t;
  async watermark(content, opts) {
    return this.t.request({ method: "POST", path: "/v1/ai-act/watermark", body: _watermarkBody(content, opts) });
  }
  async highImpactWatermark(content, opts) {
    return this.t.request({ method: "POST", path: "/v1/ai-act/high-impact-watermark", body: _highImpactBody(content, opts) });
  }
  async deepfakeLabel(body) {
    return this.t.request({ method: "POST", path: "/v1/ai-act/deepfake-label", body });
  }
  async verify(content, opts) {
    return this.t.request({ method: "POST", path: "/v1/ai-act/verify", body: _verifyBody(content, opts) });
  }
  async guidelines() {
    return this.t.request({ method: "GET", path: "/v1/ai-act/guidelines" });
  }
  async guardrailCheck(content, opts) {
    return this.t.request({
      method: "POST",
      path: "/v1/ai-act/guardrail-check",
      body: { content, content_type: "text", check_prompt_injection: true, check_pii: true, check_toxicity: true, mask_pii: false, use_llm: false, ...opts }
    });
  }
  async piiDetect(content, opts) {
    return this.t.request({
      method: "POST",
      path: "/v1/ai-act/pii-detect",
      body: { content, mask: opts?.mask ?? false, entity_types: opts?.entity_types ?? [] }
    });
  }
  async riskAssess(systemDescription, opts) {
    return this.t.request({
      method: "POST",
      path: "/v1/ai-act/risk-assess",
      body: {
        system_name: opts?.system_name ?? "smoke-test-system",
        model_type: opts?.model_type ?? "text-generation",
        application_domains: opts?.application_domains ?? ["education"],
        compute_flops: opts?.compute_flops ?? null,
        handles_personal_data: opts?.handles_personal_data ?? false,
        system_description: systemDescription,
        ...opts
      }
    });
  }
  async auditLogs(params) {
    return this.t.request({ method: "GET", path: "/v1/ai-act/audit-logs", params });
  }
};
function _toText(item) {
  if (typeof item === "string") return item;
  if (item && typeof item === "object") return item.text ?? item.content ?? "";
  return "";
}
var Classify = class {
  constructor(t) {
    this.t = t;
  }
  t;
  async classify(content, opts) {
    return this.t.request({ method: "POST", path: "/v2/classify", body: { text: content, ...opts } });
  }
  async batch(requests) {
    return this.t.request({ method: "POST", path: "/v2/classify/batch", body: { texts: requests.map(_toText) } });
  }
  async categories() {
    return this.t.request({ method: "GET", path: "/v2/classify/categories" });
  }
};
var Jailbreak = class {
  constructor(t) {
    this.t = t;
  }
  t;
  async detect(content, opts) {
    return this.t.request({ method: "POST", path: "/v2/jailbreak/detect", body: { text: content, ...opts } });
  }
  async detectBatch(requests) {
    return this.t.request({ method: "POST", path: "/v2/jailbreak/detect/batch", body: { texts: requests.map(_toText) } });
  }
  async types() {
    return this.t.request({ method: "GET", path: "/v2/jailbreak/types" });
  }
};
var Safety = class {
  constructor(t) {
    this.t = t;
  }
  t;
  async check(content, opts) {
    return this.t.request({ method: "POST", path: "/v2/safety/check", body: { text: content, ...opts } });
  }
  async checkBatch(requests) {
    return this.t.request({ method: "POST", path: "/v2/safety/check/batch", body: { texts: requests.map(_toText) } });
  }
  async categories() {
    return this.t.request({ method: "GET", path: "/v2/safety/categories" });
  }
  async backends() {
    return this.t.request({ method: "GET", path: "/v2/safety/backends" });
  }
};
var Defense = class {
  constructor(t) {
    this.t = t;
  }
  t;
  async paladinStats() {
    return this.t.request({ method: "GET", path: "/v2/defense/paladin/stats" });
  }
  async enableLayer(layerName) {
    return this.t.request({ method: "POST", path: `/v2/defense/paladin/layer/${layerName}/enable` });
  }
  async trustValidate(content, opts) {
    return this.t.request({ method: "POST", path: "/v2/defense/trust/validate", body: { content, ...opts } });
  }
  async trustProfile() {
    return this.t.request({ method: "GET", path: "/v2/defense/trust/profile" });
  }
  async ragDetect(query, documents, opts) {
    return this.t.request({ method: "POST", path: "/v2/defense/rag/detect", body: { content: query, ...documents ? { documents } : {}, ...opts } });
  }
  async ragSecureQuery(body) {
    return this.t.request({ method: "POST", path: "/v2/defense/rag/secure-query", body });
  }
  async circuitBreakerEvaluate(content) {
    return this.t.request({ method: "POST", path: "/v2/defense/circuit-breaker/evaluate", body: { content } });
  }
  async circuitBreakerStatus() {
    return this.t.request({ method: "GET", path: "/v2/defense/circuit-breaker/status" });
  }
  async adaptiveEvaluate(content) {
    return this.t.request({ method: "POST", path: "/v2/defense/adaptive/evaluate", body: { content } });
  }
  async adaptiveLearn(body) {
    return this.t.request({ method: "POST", path: "/v2/defense/adaptive/learn", body });
  }
};
var Advanced = class {
  constructor(t) {
    this.t = t;
  }
  t;
  async detect(content) {
    return this.t.request({ method: "POST", path: "/v2/advanced/detect", body: { text: content } });
  }
  async hybridWeb(content) {
    return this.t.request({ method: "POST", path: "/v2/advanced/hybrid-web", body: { text: content } });
  }
  async vsh(content) {
    return this.t.request({ method: "POST", path: "/v2/advanced/vsh", body: { text: content } });
  }
  async fewShot(content) {
    return this.t.request({ method: "POST", path: "/v2/advanced/few-shot", body: { text: content } });
  }
  async cot(content) {
    return this.t.request({ method: "POST", path: "/v2/advanced/cot", body: { text: content } });
  }
  async acoustic(content) {
    return this.t.request({ method: "POST", path: "/v2/advanced/acoustic", body: { text: content } });
  }
  async contextConfusion(content) {
    return this.t.request({ method: "POST", path: "/v2/advanced/context-confusion", body: { text: content } });
  }
  async infoExtraction(content) {
    return this.t.request({ method: "POST", path: "/v2/advanced/info-extraction", body: { text: content } });
  }
};
var AdversaFlow = class {
  constructor(t) {
    this.t = t;
  }
  t;
  campaigns(opts = {}) {
    return new Paginator(this.t, "/v2/adversaflow/campaigns", { page: opts.page ?? 1, limit: opts.limit ?? 20 });
  }
  async tree(campaignId) {
    return this.t.request({ method: "GET", path: `/v2/adversaflow/tree/${campaignId}` });
  }
  async trace(campaignId, nodeId) {
    return this.t.request({ method: "GET", path: `/v2/adversaflow/trace/${campaignId}/${nodeId}` });
  }
  async stats(campaignId) {
    return this.t.request({ method: "GET", path: `/v2/adversaflow/stats/${campaignId}` });
  }
  async metrics(campaignId) {
    return this.t.request({ method: "GET", path: `/v2/adversaflow/metrics/${campaignId}` });
  }
  async record(body) {
    return this.t.request({ method: "POST", path: "/v2/adversaflow/record", body });
  }
};
var GuardNet = class {
  constructor(t) {
    this.t = t;
  }
  t;
  async analyze(content, opts) {
    return this.t.request({ method: "POST", path: "/v3/defense/guardnet", body: { text: content, ...opts } });
  }
  async jbshield(content, opts) {
    return this.t.request({ method: "POST", path: "/v3/defense/jbshield", body: { text: content, ...opts } });
  }
  async ccfc(content, opts) {
    return this.t.request({ method: "POST", path: "/v3/defense/ccfc", body: { text: content, ...opts } });
  }
  async muli(content, opts) {
    return this.t.request({ method: "POST", path: "/v3/defense/muli", body: { text: content, ...opts } });
  }
  async unified(content, opts) {
    return this.t.request({ method: "POST", path: "/v3/defense/unified", body: { text: content, ...opts } });
  }
};
var Agent = class {
  constructor(t) {
    this.t = t;
  }
  t;
  async scan(prompt, opts) {
    return this.t.request({
      method: "POST",
      path: "/v3/agent/scan",
      body: {
        prompt,
        external_data: opts?.external_data ?? [],
        session_id: opts?.session_id ?? (globalThis.crypto?.randomUUID?.() ?? "smoke-session"),
        user_id: opts?.user_id ?? "sdk-smoke",
        ...opts?.agent_type ? { agent_type: opts.agent_type } : {},
        ...opts?.context ? { context: opts.context } : {}
      }
    });
  }
  async toolchain(tools, opts) {
    return this.t.request({ method: "POST", path: "/v3/agent/toolchain", body: { tools, ...opts } });
  }
  async memoryPoisoning(body) {
    return this.t.request({ method: "POST", path: "/v3/agent/memory-poisoning", body });
  }
  async reasoningHijack(body) {
    return this.t.request({ method: "POST", path: "/v3/agent/reasoning-hijack", body });
  }
  async toolDisguise(body) {
    return this.t.request({ method: "POST", path: "/v3/agent/tool-disguise", body });
  }
};
function _anomalyDetectBody(opts) {
  const body = { algorithm: opts.algorithm ?? "zscore" };
  if (opts.metric != null) body.metric = opts.metric;
  if (opts.data_points) {
    body.data_points = opts.data_points;
  } else if (opts.history) {
    const now = Math.floor(Date.now() / 1e3);
    const points = opts.history.map((v, i) => ({ timestamp: now - (opts.history.length - i) * 60, value: v }));
    if (opts.value != null) points.push({ timestamp: now, value: opts.value });
    body.data_points = points;
  }
  if (opts.threshold != null) body.threshold = opts.threshold;
  for (const k of Object.keys(opts)) {
    if (!["metric", "algorithm", "value", "history", "data_points", "threshold"].includes(k)) body[k] = opts[k];
  }
  return body;
}
var Anomaly = class {
  constructor(t) {
    this.t = t;
  }
  t;
  async algorithms() {
    const data = await this.t.request({ method: "GET", path: "/v3/anomaly/algorithms" });
    if (Array.isArray(data)) return data;
    return data?.algorithms ?? [];
  }
  async detect(opts) {
    return this.t.request({ method: "POST", path: "/v3/anomaly/detect", body: _anomalyDetectBody(opts) });
  }
  async events(opts = {}) {
    return this.t.request({ method: "GET", path: "/v3/anomaly/events", params: { limit: opts.limit ?? 20, ...opts.range ? { range: opts.range } : {}, ...opts.min_score != null ? { min_score: opts.min_score } : {} } });
  }
  async stats() {
    return this.t.request({ method: "GET", path: "/v3/anomaly/stats" });
  }
};
var Multimodal = class {
  constructor(t) {
    this.t = t;
  }
  t;
  async scan(content, opts) {
    const body = {};
    if (content != null) body.text = content;
    if (opts?.image) body.image = opts.image;
    if (opts?.audio_transcription) body.audio_transcription = opts.audio_transcription;
    if (opts?.check_types) body.check_types = opts.check_types;
    return this.t.request({ method: "POST", path: "/v3/multimodal/scan", body });
  }
  async image(body) {
    return this.t.request({ method: "POST", path: "/v3/multimodal/image", body });
  }
  async viscra(body) {
    return this.t.request({ method: "POST", path: "/v3/multimodal/viscra", body });
  }
  async mml(body) {
    return this.t.request({ method: "POST", path: "/v3/multimodal/mml", body });
  }
  // Backwards-compat alias
  async imageAttack(body) {
    return this.image(body);
  }
};
var Evolution = class {
  constructor(t) {
    this.t = t;
  }
  t;
  async generate(seedPrompt, opts) {
    return this.t.request({
      method: "POST",
      path: "/v3/evolution/generate",
      body: {
        target_behavior: seedPrompt,
        categories: opts?.categories ?? ["jailbreak"],
        count: opts?.count ?? 10,
        difficulty: opts?.difficulty ?? "medium",
        include_multi_turn: opts?.include_multi_turn ?? false,
        ...opts?.attack_type ? { attack_type: opts.attack_type } : {},
        ...opts?.mutation_rate != null ? { mutation_rate: opts.mutation_rate } : {}
      }
    });
  }
  async evolve(body) {
    return this.t.request({ method: "POST", path: "/v3/evolution/evolve", body });
  }
  async stats() {
    return this.t.request({ method: "GET", path: "/v3/evolution/stats" });
  }
};
var Saber = class {
  constructor(t) {
    this.t = t;
  }
  t;
  async estimate(content, opts) {
    const queries = Array.isArray(content) ? content : [{ query_id: "default", total_trials: 100, success_count: 5, category: "smoke" }];
    return this.t.request({ method: "POST", path: "/v3/saber/estimate", body: { queries, ...opts } });
  }
  async evaluate(content, opts) {
    return this.t.request({ method: "POST", path: "/v3/saber/evaluate", body: { content, ...opts } });
  }
  async budget(opts) {
    return this.t.request({ method: "GET", path: "/v3/saber/budget", params: { tau: opts?.tau ?? 0.5, ...opts?.alpha != null ? { alpha: opts.alpha } : {}, ...opts?.beta != null ? { beta: opts.beta } : {} } });
  }
  async compare(content, defenses) {
    return this.t.request({ method: "POST", path: "/v3/saber/compare", body: { content, defenses } });
  }
  async report(reportId) {
    return this.t.request({ method: "GET", path: `/v3/saber/report/${reportId}` });
  }
};
var Ops = class {
  constructor(t) {
    this.t = t;
  }
  t;
  async ciGate(req) {
    return this.t.request({ method: "POST", path: "/ops/evalops/ci-gate", body: req });
  }
  async benchmark(name, body) {
    return this.t.request({ method: "POST", path: `/ops/evalops/benchmark/${name}`, body });
  }
  async getThresholds() {
    return this.t.request({ method: "GET", path: "/ops/evalops/thresholds" });
  }
  async setThresholds(body) {
    return this.t.request({ method: "POST", path: "/ops/evalops/thresholds", body });
  }
  async redteamStats() {
    return this.t.request({ method: "GET", path: "/ops/redteam/stats" });
  }
  async attackLibrary() {
    return this.t.request({ method: "GET", path: "/ops/redteam/attack-library" });
  }
  async attackLibraryByCategory(category) {
    return this.t.request({ method: "GET", path: `/ops/redteam/attack-library/${category}` });
  }
};
var ApiKeys = class {
  constructor(t) {
    this.t = t;
  }
  t;
  async create(req) {
    return this.t.request({ method: "POST", path: "/v1/api-keys", body: req });
  }
  list(opts = {}) {
    return new Paginator(this.t, "/v1/api-keys", { page: opts.page ?? 1, limit: opts.limit ?? 20 });
  }
  async get(keyId) {
    return this.t.request({ method: "GET", path: `/v1/api-keys/${keyId}` });
  }
  async revoke(keyId) {
    await this.t.request({ method: "POST", path: `/v1/api-keys/${keyId}/revoke` });
  }
  async delete(keyId) {
    await this.t.request({ method: "DELETE", path: `/v1/api-keys/${keyId}` });
  }
};

// src/client.ts
var AegisClient = class {
  transport;
  // V1 resources
  judge;
  rules;
  escalations;
  analytics;
  evidence;
  ml;
  nlp;
  aiAct;
  // V2 resources
  classify;
  jailbreak;
  safety;
  defense;
  advanced;
  adversaflow;
  // V3 resources
  guardnet;
  agent;
  anomaly;
  multimodal;
  evolution;
  saber;
  // Ops
  ops;
  // Management
  apiKeys;
  // Orchestration (v1 always included)
  orchestration;
  constructor(options) {
    if (!options.apiKey && !options.accessToken) {
      throw new Error("apiKey or accessToken is required");
    }
    this.transport = new Transport({
      apiKey: options.apiKey,
      accessToken: options.accessToken,
      baseUrl: (options.baseUrl ?? "https://api.aiaegis.io").replace(/\/$/, ""),
      timeout: options.timeout ?? 3e4,
      maxRetries: options.maxRetries ?? 3,
      customHeaders: options.customHeaders ?? {}
    });
    this.judge = new Judge(this.transport);
    this.rules = new Rules(this.transport);
    this.escalations = new Escalations(this.transport);
    this.analytics = new Analytics(this.transport);
    this.evidence = new EvidenceResource(this.transport);
    this.ml = new ML(this.transport);
    this.nlp = new NLP(this.transport);
    this.aiAct = new AiAct(this.transport);
    this.classify = new Classify(this.transport);
    this.jailbreak = new Jailbreak(this.transport);
    this.safety = new Safety(this.transport);
    this.defense = new Defense(this.transport);
    this.advanced = new Advanced(this.transport);
    this.adversaflow = new AdversaFlow(this.transport);
    this.guardnet = new GuardNet(this.transport);
    this.agent = new Agent(this.transport);
    this.anomaly = new Anomaly(this.transport);
    this.multimodal = new Multimodal(this.transport);
    this.evolution = new Evolution(this.transport);
    this.saber = new Saber(this.transport);
    this.ops = new Ops(this.transport);
    this.apiKeys = new ApiKeys(this.transport);
    this.orchestration = new Orchestration(this.transport);
  }
  get quota() {
    return this.transport.quota;
  }
};

export { AegisClient, AegisError, ApiError, AuthenticationError, NetworkError, NotFoundError, Paginator, QuotaExceededError, RateLimitError, ServerError, TierAccessError, ValidationError };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map