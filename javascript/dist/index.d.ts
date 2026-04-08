interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    has_more?: boolean;
}
interface QuotaInfo {
    limit?: number;
    used?: number;
    remaining?: number;
}
interface ClientOptions {
    apiKey?: string;
    accessToken?: string;
    baseUrl?: string;
    timeout?: number;
    maxRetries?: number;
    customHeaders?: Record<string, string>;
}

interface RequestOptions {
    method: string;
    path: string;
    body?: unknown;
    params?: Record<string, string | number | undefined>;
    headers?: Record<string, string>;
    signal?: AbortSignal;
}
interface TransportConfig {
    apiKey?: string;
    accessToken?: string;
    baseUrl: string;
    timeout: number;
    maxRetries: number;
    customHeaders: Record<string, string>;
}
declare class Transport {
    private config;
    quota: QuotaInfo;
    constructor(config: TransportConfig);
    request<T>(opts: RequestOptions): Promise<T>;
    stream(opts: RequestOptions): AsyncGenerator<string>;
    private authHeaders;
    private buildUrl;
    private updateQuota;
    private throwForStatus;
    private backoff;
}

declare class Paginator<T> implements AsyncIterable<T> {
    private transport;
    private path;
    private params;
    private currentPage;
    private exhausted;
    private _total?;
    constructor(transport: Transport, path: string, params?: Record<string, string | number | undefined>);
    get total(): number | undefined;
    private extractItems;
    [Symbol.asyncIterator](): AsyncIterator<T>;
    toArray(): Promise<T[]>;
}

interface JudgeOptions {
    enable_streaming?: boolean;
    fast_mode?: boolean;
    skip_layers?: string[];
}
interface JudgeRequest {
    prompt: string;
    context?: unknown;
    metadata?: Record<string, unknown>;
    options?: JudgeOptions;
}
interface Risk {
    label: string;
    severity: string;
    description?: string;
    score?: number;
    categories?: string[];
}
interface DefenseLayer {
    name: string;
    passed: boolean;
    latency_ms?: number;
    details?: Record<string, unknown>;
}
interface JudgeResponse {
    id: string;
    decision: string;
    confidence: number;
    risks: Risk[];
    layers: DefenseLayer[];
    latency_ms?: number;
}
interface JudgeStreamEvent {
    event_type?: string;
    partial_decision?: string;
    layer?: DefenseLayer;
    risk?: Risk;
    final_response?: JudgeResponse;
    done?: boolean;
}

declare class Judge {
    private transport;
    constructor(transport: Transport);
    create(request: JudgeRequest): Promise<JudgeResponse>;
    batch(requests: JudgeRequest[]): Promise<JudgeResponse[]>;
    stream(request: JudgeRequest): AsyncGenerator<JudgeStreamEvent>;
    list(opts?: {
        page?: number;
        limit?: number;
    }): Paginator<JudgeResponse>;
    get(judgmentId: string): Promise<JudgeResponse>;
}

interface RuleCreateRequest {
    name: string;
    pattern: string;
    pattern_type?: string;
    action: string;
    severity?: string;
    category?: string;
    description?: string;
    priority?: number;
    enabled?: boolean;
}
interface RuleUpdateRequest {
    name?: string;
    pattern?: string;
    pattern_type?: string;
    action?: string;
    severity?: string;
    category?: string;
    description?: string;
    priority?: number;
    enabled?: boolean;
}
interface Rule {
    id: string;
    name: string;
    pattern: string;
    pattern_type: string;
    action: string;
    severity: string;
    category: string;
    description?: string;
    priority: number;
    enabled: boolean;
    created_at?: string;
    updated_at?: string;
}
interface RuleTestRequest {
    content: string;
    rule_ids?: string[];
}
interface RuleTestResponse {
    matched: boolean;
    matched_rules: Record<string, unknown>[];
    details?: Record<string, unknown>;
}

declare class Rules {
    private transport;
    constructor(transport: Transport);
    create(request: RuleCreateRequest): Promise<Rule>;
    get(ruleId: string): Promise<Rule>;
    update(ruleId: string, request: RuleUpdateRequest): Promise<Rule>;
    delete(ruleId: string): Promise<void>;
    list(opts?: {
        page?: number;
        limit?: number;
    }): Paginator<Rule>;
    test(request: RuleTestRequest): Promise<RuleTestResponse>;
    reload(): Promise<Record<string, unknown>>;
    templates(): Promise<Record<string, unknown>[]>;
    templatesByIndustry(industry: string): Promise<Record<string, unknown>[]>;
    seed(industry: string): Promise<Record<string, unknown>>;
}

interface Escalation {
    id: string;
    judgment_id: string;
    reason: string;
    status: string;
    priority: number;
    assigned_to?: string;
    resolved_by?: string;
    resolution?: string;
    notes?: string;
    created_at?: string;
    updated_at?: string;
}
interface EscalationCreateRequest {
    judgment_id: string;
    reason: string;
    priority?: number;
}
interface EscalationStats {
    total: number;
    pending: number;
    in_review: number;
    resolved: number;
    average_resolution_time_ms?: number;
    by_priority: Record<string, number>;
}
interface Evidence {
    id: string;
    judgment_id: string;
    evidence_type: string;
    content: unknown;
    hash?: string;
    metadata: Record<string, unknown>;
    created_at?: string;
}
interface EvidenceVerification {
    id: string;
    is_valid: boolean;
    hash_match: boolean;
    verified_at: string;
    details?: Record<string, unknown>;
}
interface AnalyticsOverview {
    total_judgments: number;
    total_blocked: number;
    total_allowed: number;
    avg_latency_ms?: number;
    risk_distribution: Record<string, number>;
    time_series: Record<string, unknown>[];
    defense_layers: Record<string, unknown>[];
    top_threats: Record<string, unknown>[];
}
interface EmbedRequest {
    text: string;
    model?: string;
}
interface EmbedResponse {
    embedding: number[];
    model: string;
    dimensions: number;
}
interface ClassifyMLRequest {
    text: string;
    labels?: string[];
    model?: string;
}
interface ClassifyMLResponse {
    label: string;
    confidence: number;
    scores: Record<string, number>;
}
interface SimilarityRequest {
    query: string;
    documents: string[];
    top_k?: number;
    model?: string;
}
interface SimilarityResponse {
    results: Record<string, unknown>[];
    model: string;
}
interface ContentClassifyRequest {
    content: string;
    categories?: string[];
    threshold?: number;
    model?: string;
}
interface ContentClassifyResponse {
    category: string;
    confidence: number;
    sub_categories: Record<string, unknown>[];
    scores: Record<string, number>;
    model: string;
}
interface SafetyCheckRequest {
    content: string;
    categories?: string[];
    backend?: string;
    threshold?: number;
}
interface SafetyCheckResponse {
    is_safe: boolean;
    overall_score: number;
    categories: Record<string, unknown>[];
    flagged_categories: string[];
    backend: string;
    details?: Record<string, unknown>;
}
interface JailbreakDetectRequest {
    content: string;
    detection_methods?: string[];
    threshold?: number;
}
interface JailbreakDetectResponse {
    is_jailbreak: boolean;
    confidence: number;
    jailbreak_type?: string;
    matched_patterns: string[];
    details?: Record<string, unknown>;
}
interface AdvancedDetectRequest {
    content: string;
    attack_types?: string[];
    context?: Record<string, unknown>;
}
interface AdvancedDetectResponse {
    detected: boolean;
    attack_type?: string;
    confidence: number;
    attack_details: Record<string, unknown>[];
    mitigations: string[];
    details?: Record<string, unknown>;
}
interface TrustValidateRequest {
    content: string;
    context?: Record<string, unknown>;
    source?: string;
}
interface TrustValidateResponse {
    trust_score: number;
    is_trusted: boolean;
    factors: Record<string, unknown>[];
    details?: Record<string, unknown>;
}
interface RagDetectRequest {
    query: string;
    documents: string[];
    context?: Record<string, unknown>;
}
interface RagDetectResponse {
    is_poisoned: boolean;
    poisoned_documents: number[];
    confidence: number;
    details?: Record<string, unknown>;
}
interface CircuitBreakerResponse {
    tripped: boolean;
    reason?: string;
    severity: string;
    details?: Record<string, unknown>;
}
interface CircuitBreakerStatus {
    state: string;
    failure_count: number;
    last_failure_at?: string;
    cooldown_remaining_ms?: number;
}
interface AdaptiveEvalResponse {
    threat_level: string;
    adapted_defenses: string[];
    confidence: number;
    recommendations: string[];
    details?: Record<string, unknown>;
}
interface AgentScanRequest {
    prompt: string;
    tools?: string[];
    context?: Record<string, unknown>;
    scan_type?: string;
}
interface AgentScanResponse {
    injection_detected: boolean;
    injection_type?: string;
    confidence: number;
    dpi_results?: Record<string, unknown>;
    ipi_results?: Record<string, unknown>;
    recommendations: string[];
    details?: Record<string, unknown>;
}
interface ToolchainRequest {
    tools: Record<string, unknown>[];
    execution_plan?: string[];
    context?: Record<string, unknown>;
}
interface ToolchainResponse {
    is_safe: boolean;
    risk_level: string;
    tool_risks: Record<string, unknown>[];
    chain_risks: Record<string, unknown>[];
    recommendations: string[];
}
interface AnomalyDetectRequest {
    metric: string;
    algorithm?: string;
    data_range?: Record<string, unknown>;
    parameters?: Record<string, unknown>;
}
interface AnomalyDetectResponse {
    anomalies_detected: number;
    anomalies: Record<string, unknown>[];
    algorithm: string;
    threshold: number;
    details?: Record<string, unknown>;
}
interface MultimodalScanRequest {
    content: string;
    content_type?: string;
    image_url?: string;
    image_base64?: string;
    scan_types?: string[];
    context?: Record<string, unknown>;
}
interface MultimodalScanResponse {
    is_safe: boolean;
    threats: Record<string, unknown>[];
    modality_results: Record<string, unknown>;
    overall_risk: number;
    details?: Record<string, unknown>;
}
interface SaberEstimateRequest {
    content: string;
    prior_alpha?: number;
    prior_beta?: number;
    context?: Record<string, unknown>;
}
interface SaberEstimateResponse {
    risk_estimate: number;
    confidence_interval: number[];
    alpha: number;
    beta: number;
    details?: Record<string, unknown>;
}
interface SaberEvaluateRequest {
    content: string;
    n_samples?: number;
    defense?: string;
    parameters?: Record<string, unknown>;
}
interface SaberEvaluateResponse {
    safety_rate: number;
    n_safe: number;
    n_total: number;
    confidence: number;
    samples: Record<string, unknown>[];
    details?: Record<string, unknown>;
}
interface WatermarkRequest {
    content: string;
    watermark_type?: string;
    metadata?: Record<string, unknown>;
}
interface WatermarkResponse {
    watermarked_content: string;
    watermark_id: string;
    verification_url?: string;
    details?: Record<string, unknown>;
}
interface PiiDetectRequest {
    content: string;
    locale?: string;
    categories?: string[];
}
interface PiiDetectResponse {
    pii_found: boolean;
    entities: Record<string, unknown>[];
    redacted_content?: string;
    details?: Record<string, unknown>;
}
interface ApiKeyCreateRequest {
    name: string;
    description?: string;
    scopes?: string[];
    expires_in_days?: number;
}
interface ApiKey {
    id: string;
    name: string;
    key_prefix: string;
    key_preview: string;
    scopes: string[];
    permissions: string[];
    created_at?: string;
    last_used_at?: string;
    expires_at?: string;
    is_active: boolean;
}
interface ApiKeyCreateResponse extends ApiKey {
    api_key: string;
    key: string;
}
interface CiGateRequest {
    test_suite: string;
    thresholds?: Record<string, number>;
    parameters?: Record<string, unknown>;
}
interface CiGateResponse {
    passed: boolean;
    score: number;
    results: Record<string, unknown>[];
    failures: Record<string, unknown>[];
    details?: Record<string, unknown>;
}

type OrchestrationScenario = "basic" | "standard" | "full" | "advanced" | "agent" | "anomaly" | "pii";
type OrchestrationMode = "balanced" | "recall" | "precision" | "strict" | "bayes" | "auto";
type EnsembleAlgorithm = "max" | "arith_mean" | "weighted_mean" | "noisy_or" | "majority_vote" | "log_odds_sum" | "strict_consensus" | "two_stage_veto" | "hierarchical_cascade";
interface Contributor {
    name: string;
    score: number;
    block: boolean;
    latency_ms?: number;
}
interface OrchestratedDecision {
    scenario: OrchestrationScenario;
    mode: OrchestrationMode;
    algorithm: EnsembleAlgorithm;
    decision: "block" | "allow";
    ensemble_score: number;
    threshold: number;
    contributors: Contributor[];
    explanation: string;
    total_latency_ms: number;
}
interface RunRequest {
    content: string;
    scenario?: OrchestrationScenario;
    mode?: OrchestrationMode;
    algorithm?: EnsembleAlgorithm;
    weights?: Record<string, number>;
    threshold?: number;
}
interface TimeseriesAnomalyRequest {
    value: number;
    history: number[];
    algorithm?: "zscore" | "moving_average" | "iqr" | "isolation_forest";
}
interface TimeseriesAnomalyResponse {
    is_anomaly: boolean;
    anomaly_score: number;
    algorithm: string;
    latency_ms: number;
}
interface OrchestrationConfig {
    tenant_id: string;
    scenario: OrchestrationScenario;
    algorithm: EnsembleAlgorithm;
    mode: OrchestrationMode;
    weights: Record<string, number>;
    thresholds: Record<string, number>;
    source_job_id?: string | null;
    updated_at: string;
}
interface UpsertConfigRequest {
    algorithm: EnsembleAlgorithm;
    mode: OrchestrationMode;
    weights?: Record<string, number>;
    thresholds?: Record<string, number>;
    source_job_id?: string;
}
interface GridSearchRequest {
    domain: string;
    scenario: OrchestrationScenario;
    max_samples?: number;
}
interface GridSearchEntry {
    label: string;
    algorithm: string;
    precision: number;
    recall: number;
    f1: number;
    pr_auc: number;
}
interface GridSearchResponse {
    domain: string;
    total_samples: number;
    top_combos: GridSearchEntry[];
}
interface GridSearchJobRequest {
    domain: string;
    scenario: OrchestrationScenario;
    max_samples?: number;
}
interface GridSearchJob {
    id: string;
    tenant_id?: string | null;
    domain: string;
    scenario: OrchestrationScenario;
    status: "queued" | "running" | "done" | "failed" | "cancelled";
    dataset_path: string;
    created_at: string;
    started_at?: string | null;
    finished_at?: string | null;
    error?: string | null;
}
interface GridSearchResult {
    id: string;
    job_id: string;
    algorithm: EnsembleAlgorithm;
    params: Record<string, unknown>;
    metrics: {
        precision: number;
        recall: number;
        f1: number;
        pr_auc: number;
        support: number;
    };
    is_optimal: boolean;
    created_at: string;
}
declare class Orchestration {
    private t;
    constructor(t: Transport);
    private _run;
    run(req: RunRequest): Promise<OrchestratedDecision>;
    basic(req: RunRequest): Promise<OrchestratedDecision>;
    standard(req: RunRequest): Promise<OrchestratedDecision>;
    full(req: RunRequest): Promise<OrchestratedDecision>;
    advanced(req: RunRequest): Promise<OrchestratedDecision>;
    agent(req: RunRequest): Promise<OrchestratedDecision>;
    anomaly(req: RunRequest): Promise<OrchestratedDecision>;
    pii(req: RunRequest): Promise<OrchestratedDecision>;
    anomalyTimeseries(req: TimeseriesAnomalyRequest): Promise<TimeseriesAnomalyResponse>;
    getConfig(tenantId: string, scenario: OrchestrationScenario): Promise<OrchestrationConfig>;
    upsertConfig(tenantId: string, scenario: OrchestrationScenario, body: UpsertConfigRequest): Promise<OrchestrationConfig>;
    gridsearch(req: GridSearchRequest): Promise<GridSearchResponse>;
    createGridsearchJob(req: GridSearchJobRequest): Promise<{
        job_id: string;
        status: string;
    }>;
    getGridsearchJob(jobId: string): Promise<GridSearchJob>;
    listGridsearchResults(jobId: string): Promise<GridSearchResult[]>;
    promoteGridsearchJob(jobId: string, body: {
        tenant_id: string;
        scenario: OrchestrationScenario;
    }): Promise<OrchestrationConfig>;
    listDatasets(): Promise<Array<{
        domain: string;
        path: string;
    }>>;
    pipelineRun(req: PipelineRequest): Promise<PipelineResponse>;
    militaryOrchestrate(req: MilitaryOrchestrateRequest): Promise<MilitaryOrchestrateResponse>;
    militaryStatus(): Promise<MilitaryStatusResponse>;
}
interface PipelineRequest {
    prompt: string;
    scenario_id?: string;
    algorithms?: string[];
    category?: string;
    target_provider_id?: string;
    evolution_generations?: number;
    saber_trials?: number;
}
interface PipelineResponse {
    unprotected: Record<string, unknown>;
    redteam: Record<string, unknown>;
    paladin: Record<string, unknown>;
    output_defense: Record<string, unknown>;
    evolution: Record<string, unknown>;
    total_latency_ms: number;
}
interface MilitaryOrchestrateRequest {
    text: string;
    channel_level?: number;
    source_domain?: string;
    target_domain?: string;
    session_id?: string;
}
interface MilitaryModuleResult {
    status: string;
    risk_score: number;
    latency_ms: number;
    summary: string;
    details: unknown;
}
interface MilitaryOrchestrateResponse {
    overall_risk: number;
    overall_status: string;
    modules: Record<string, MilitaryModuleResult>;
    total_latency_ms: number;
    timestamp: string;
}
interface MilitaryStatusResponse {
    modules: Array<{
        name: string;
        available: boolean;
        last_analysis?: string | null;
    }>;
    overall_health: string;
    version: string;
}

declare class Escalations {
    private t;
    constructor(t: Transport);
    create(req: EscalationCreateRequest): Promise<Escalation>;
    get(id: string): Promise<Escalation>;
    list(opts?: {
        page?: number;
        limit?: number;
    }): Paginator<Escalation>;
    resolve(id: string, body: {
        resolution: string;
        notes?: string;
    }): Promise<Escalation>;
    assign(id: string, assignee: string): Promise<Escalation>;
    claim(id: string): Promise<Escalation>;
    stats(): Promise<EscalationStats>;
}
declare class Analytics {
    private t;
    constructor(t: Transport);
    overview(params?: Record<string, string>): Promise<AnalyticsOverview>;
    judgments(params?: Record<string, string>): Promise<Record<string, unknown>>;
    defenseLayers(params?: Record<string, string>): Promise<Record<string, unknown>>;
    threats(params?: Record<string, string>): Promise<Record<string, unknown>>;
    performance(params?: Record<string, string>): Promise<Record<string, unknown>>;
}
declare class EvidenceResource {
    private t;
    constructor(t: Transport);
    get(id: string): Promise<Evidence>;
    list(opts?: {
        page?: number;
        limit?: number;
    }): Paginator<Evidence>;
    verify(id: string): Promise<EvidenceVerification>;
    forJudgment(judgmentId: string): Promise<Evidence[]>;
}
declare class ML {
    private t;
    constructor(t: Transport);
    health(): Promise<Record<string, unknown>>;
    embed(text: string, model?: string): Promise<Record<string, unknown>>;
    embedBatch(texts: string[], model?: string): Promise<Record<string, unknown>>;
    classify(text: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>>;
    similarity(query: string, documents?: string[], opts?: Record<string, unknown>): Promise<Record<string, unknown>>;
}
declare class NLP {
    private t;
    constructor(t: Transport);
    detectLanguage(content: string): Promise<Record<string, unknown>>;
    detectJailbreak(content: string): Promise<Record<string, unknown>>;
    detectHarmful(content: string): Promise<Record<string, unknown>>;
}
declare class AiAct {
    private t;
    constructor(t: Transport);
    watermark(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>>;
    highImpactWatermark(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>>;
    deepfakeLabel(body: Record<string, unknown>): Promise<Record<string, unknown>>;
    verify(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>>;
    guidelines(): Promise<Record<string, unknown>>;
    guardrailCheck(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>>;
    piiDetect(content: string, opts?: {
        mask?: boolean;
        entity_types?: string[];
    }): Promise<Record<string, unknown>>;
    riskAssess(systemDescription: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>>;
    auditLogs(params?: Record<string, string>): Promise<Record<string, unknown>>;
}
declare class Classify {
    private t;
    constructor(t: Transport);
    classify(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>>;
    batch(requests: any[]): Promise<Record<string, unknown>>;
    categories(): Promise<Record<string, unknown>[]>;
}
declare class Jailbreak {
    private t;
    constructor(t: Transport);
    detect(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>>;
    detectBatch(requests: any[]): Promise<Record<string, unknown>>;
    types(): Promise<Record<string, unknown>[]>;
}
declare class Safety {
    private t;
    constructor(t: Transport);
    check(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>>;
    checkBatch(requests: any[]): Promise<Record<string, unknown>>;
    categories(): Promise<Record<string, unknown>[]>;
    backends(): Promise<Record<string, unknown>[]>;
}
declare class Defense {
    private t;
    constructor(t: Transport);
    paladinStats(): Promise<Record<string, unknown>>;
    enableLayer(layerName: string): Promise<Record<string, unknown>>;
    trustValidate(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>>;
    trustProfile(): Promise<Record<string, unknown>>;
    ragDetect(query: string, documents?: string[], opts?: Record<string, unknown>): Promise<Record<string, unknown>>;
    ragSecureQuery(body: Record<string, unknown>): Promise<Record<string, unknown>>;
    circuitBreakerEvaluate(content: string): Promise<CircuitBreakerResponse>;
    circuitBreakerStatus(): Promise<CircuitBreakerStatus>;
    adaptiveEvaluate(content: string): Promise<AdaptiveEvalResponse>;
    adaptiveLearn(body: Record<string, unknown>): Promise<Record<string, unknown>>;
}
declare class Advanced {
    private t;
    constructor(t: Transport);
    detect(content: string): Promise<Record<string, unknown>>;
    hybridWeb(content: string): Promise<Record<string, unknown>>;
    vsh(content: string): Promise<Record<string, unknown>>;
    fewShot(content: string): Promise<Record<string, unknown>>;
    cot(content: string): Promise<Record<string, unknown>>;
    acoustic(content: string): Promise<Record<string, unknown>>;
    contextConfusion(content: string): Promise<Record<string, unknown>>;
    infoExtraction(content: string): Promise<Record<string, unknown>>;
}
declare class AdversaFlow {
    private t;
    constructor(t: Transport);
    campaigns(opts?: {
        page?: number;
        limit?: number;
    }): Paginator<unknown>;
    tree(campaignId: string): Promise<Record<string, unknown>>;
    trace(campaignId: string, nodeId: string): Promise<Record<string, unknown>>;
    stats(campaignId: string): Promise<Record<string, unknown>>;
    metrics(campaignId: string): Promise<Record<string, unknown>>;
    record(body: Record<string, unknown>): Promise<Record<string, unknown>>;
}
declare class GuardNet {
    private t;
    constructor(t: Transport);
    analyze(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>>;
    jbshield(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>>;
    ccfc(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>>;
    muli(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>>;
    unified(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>>;
}
declare class Agent {
    private t;
    constructor(t: Transport);
    scan(prompt: string, opts?: {
        external_data?: string[];
        session_id?: string;
        user_id?: string;
        agent_type?: string;
        context?: Record<string, unknown>;
    }): Promise<Record<string, unknown>>;
    toolchain(tools: any[], opts?: Record<string, unknown>): Promise<Record<string, unknown>>;
    memoryPoisoning(body: Record<string, unknown>): Promise<Record<string, unknown>>;
    reasoningHijack(body: Record<string, unknown>): Promise<Record<string, unknown>>;
    toolDisguise(body: Record<string, unknown>): Promise<Record<string, unknown>>;
}
declare class Anomaly {
    private t;
    constructor(t: Transport);
    algorithms(): Promise<Record<string, unknown>[]>;
    detect(opts: {
        metric?: string;
        algorithm?: string;
        value?: number;
        history?: number[];
        data_points?: any[];
        threshold?: number;
    }): Promise<Record<string, unknown>>;
    events(opts?: {
        limit?: number;
        range?: string;
        min_score?: number;
    }): Promise<Record<string, unknown>>;
    stats(): Promise<Record<string, unknown>>;
}
declare class Multimodal {
    private t;
    constructor(t: Transport);
    scan(content: string | null, opts?: {
        image?: Record<string, unknown>;
        audio_transcription?: string;
        check_types?: string[];
    }): Promise<Record<string, unknown>>;
    image(body: Record<string, unknown>): Promise<Record<string, unknown>>;
    viscra(body: Record<string, unknown>): Promise<Record<string, unknown>>;
    mml(body: Record<string, unknown>): Promise<Record<string, unknown>>;
    imageAttack(body: Record<string, unknown>): Promise<Record<string, unknown>>;
}
declare class Evolution {
    private t;
    constructor(t: Transport);
    generate(seedPrompt: string, opts?: {
        categories?: string[];
        attack_type?: string;
        count?: number;
        difficulty?: string;
        include_multi_turn?: boolean;
        mutation_rate?: number;
    }): Promise<Record<string, unknown>>;
    evolve(body: Record<string, unknown>): Promise<Record<string, unknown>>;
    stats(): Promise<Record<string, unknown>>;
}
declare class Saber {
    private t;
    constructor(t: Transport);
    estimate(content?: any, opts?: Record<string, unknown>): Promise<Record<string, unknown>>;
    evaluate(content: string, opts?: Record<string, unknown>): Promise<Record<string, unknown>>;
    budget(opts?: {
        tau?: number;
        alpha?: number;
        beta?: number;
    }): Promise<Record<string, unknown>>;
    compare(content: string, defenses: string[]): Promise<Record<string, unknown>>;
    report(reportId: string): Promise<Record<string, unknown>>;
}
declare class Ops {
    private t;
    constructor(t: Transport);
    ciGate(req: CiGateRequest): Promise<CiGateResponse>;
    benchmark(name: string, body?: Record<string, unknown>): Promise<Record<string, unknown>>;
    getThresholds(): Promise<Record<string, unknown>>;
    setThresholds(body: Record<string, unknown>): Promise<Record<string, unknown>>;
    redteamStats(): Promise<Record<string, unknown>>;
    attackLibrary(): Promise<Record<string, unknown>[]>;
    attackLibraryByCategory(category: string): Promise<Record<string, unknown>[]>;
}
declare class ApiKeys {
    private t;
    constructor(t: Transport);
    create(req: ApiKeyCreateRequest): Promise<ApiKeyCreateResponse>;
    list(opts?: {
        page?: number;
        limit?: number;
    }): Paginator<ApiKey>;
    get(keyId: string): Promise<ApiKey>;
    revoke(keyId: string): Promise<void>;
    delete(keyId: string): Promise<void>;
}

declare class AegisClient {
    private transport;
    readonly judge: Judge;
    readonly rules: Rules;
    readonly escalations: Escalations;
    readonly analytics: Analytics;
    readonly evidence: EvidenceResource;
    readonly ml: ML;
    readonly nlp: NLP;
    readonly aiAct: AiAct;
    readonly classify: Classify;
    readonly jailbreak: Jailbreak;
    readonly safety: Safety;
    readonly defense: Defense;
    readonly advanced: Advanced;
    readonly adversaflow: AdversaFlow;
    readonly guardnet: GuardNet;
    readonly agent: Agent;
    readonly anomaly: Anomaly;
    readonly multimodal: Multimodal;
    readonly evolution: Evolution;
    readonly saber: Saber;
    readonly ops: Ops;
    readonly apiKeys: ApiKeys;
    readonly orchestration: Orchestration;
    constructor(options: ClientOptions);
    get quota(): QuotaInfo;
}

declare class AegisError extends Error {
    constructor(message: string);
}
declare class ApiError extends AegisError {
    readonly statusCode: number;
    readonly errorCode?: string;
    readonly requestId?: string;
    readonly body?: Record<string, unknown>;
    constructor(message: string, statusCode: number, opts?: {
        errorCode?: string;
        requestId?: string;
        body?: Record<string, unknown>;
    });
}
declare class AuthenticationError extends ApiError {
    constructor(message?: string, opts?: {
        requestId?: string;
        body?: Record<string, unknown>;
    });
}
declare class TierAccessError extends ApiError {
    readonly requiredTier?: string;
    readonly upgradeUrl?: string;
    constructor(message: string, opts?: {
        requiredTier?: string;
        upgradeUrl?: string;
        requestId?: string;
        body?: Record<string, unknown>;
    });
}
declare class QuotaExceededError extends ApiError {
    readonly limit?: number;
    readonly used?: number;
    readonly resetAt?: string;
    constructor(message?: string, opts?: {
        limit?: number;
        used?: number;
        resetAt?: string;
        requestId?: string;
        body?: Record<string, unknown>;
    });
}
declare class RateLimitError extends ApiError {
    readonly retryAfter?: number;
    constructor(message?: string, opts?: {
        retryAfter?: number;
        requestId?: string;
        body?: Record<string, unknown>;
    });
}
declare class ValidationError extends ApiError {
    constructor(message: string, statusCode?: number, opts?: {
        requestId?: string;
        body?: Record<string, unknown>;
    });
}
declare class NotFoundError extends ApiError {
    constructor(message?: string, opts?: {
        requestId?: string;
        body?: Record<string, unknown>;
    });
}
declare class ServerError extends ApiError {
    constructor(message?: string, statusCode?: number, opts?: {
        requestId?: string;
        body?: Record<string, unknown>;
    });
}
declare class NetworkError extends AegisError {
    readonly cause?: Error;
    constructor(message?: string, cause?: Error);
}

export { type AdaptiveEvalResponse, type AdvancedDetectRequest, type AdvancedDetectResponse, AegisClient, AegisError, type AgentScanRequest, type AgentScanResponse, type AnalyticsOverview, type AnomalyDetectRequest, type AnomalyDetectResponse, ApiError, type ApiKey, type ApiKeyCreateRequest, type ApiKeyCreateResponse, AuthenticationError, type CiGateRequest, type CiGateResponse, type CircuitBreakerResponse, type CircuitBreakerStatus, type ClassifyMLRequest, type ClassifyMLResponse, type ClientOptions, type ContentClassifyRequest, type ContentClassifyResponse, type DefenseLayer, type EmbedRequest, type EmbedResponse, type Escalation, type EscalationCreateRequest, type EscalationStats, type Evidence, type EvidenceVerification, type JailbreakDetectRequest, type JailbreakDetectResponse, type JudgeOptions, type JudgeRequest, type JudgeResponse, type JudgeStreamEvent, type MultimodalScanRequest, type MultimodalScanResponse, NetworkError, NotFoundError, type PaginatedResponse, Paginator, type PiiDetectRequest, type PiiDetectResponse, QuotaExceededError, type QuotaInfo, type RagDetectRequest, type RagDetectResponse, RateLimitError, type Risk, type Rule, type RuleCreateRequest, type RuleTestRequest, type RuleTestResponse, type RuleUpdateRequest, type SaberEstimateRequest, type SaberEstimateResponse, type SaberEvaluateRequest, type SaberEvaluateResponse, type SafetyCheckRequest, type SafetyCheckResponse, ServerError, type SimilarityRequest, type SimilarityResponse, TierAccessError, type ToolchainRequest, type ToolchainResponse, type TrustValidateRequest, type TrustValidateResponse, ValidationError, type WatermarkRequest, type WatermarkResponse };
