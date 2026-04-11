import { aegisApi } from "../aegis-client.js";
import { GuardCache, cacheKey } from "../cache.js";
import { localPromptGuard } from "./local-fallback.js";
import type {
  AegisGuardConfig,
  GuardResult,
  OpenClawPluginAPI,
} from "../types.js";

const TAG = "[aegis-guard:reasoning]";

export function registerReasoningGuard(
  api: OpenClawPluginAPI,
  config: AegisGuardConfig,
  cache: GuardCache,
): void {
  const log = api.logger;

  api.on("llm_input", async (event: any, _ctx: any) => {
    const messages = event?.messages ?? event?.payload?.messages;
    if (!messages || !Array.isArray(messages)) return;

    const lastMsg = [...messages].reverse().find(
      (m: any) => m.role === "user" || m.role === "system"
    );
    const content = typeof lastMsg?.content === "string"
      ? lastMsg.content
      : JSON.stringify(lastMsg?.content ?? "").slice(0, 1000);
    if (!content) return;

    log.info(`${TAG} ━━━ SCANNING LLM input for reasoning hijack ━━━`);
    log.info(`${TAG} messages=${messages.length} last_role=${lastMsg?.role} len=${content.length}`);

    const key = cacheKey("reasoning", content.slice(0, 256));
    const cached = cache.get(key);
    if (cached) {
      log.info(`${TAG} cache HIT action=${cached.action} risk=${cached.riskScore.toFixed(2)}`);
      return;
    }

    const apiResult = await detectReasoningHijack(content, config, log);
    const localResult = localPromptGuard(content);

    log.info(`${TAG} API: action=${apiResult.action} risk=${apiResult.riskScore.toFixed(2)}`);
    log.info(`${TAG} Local: action=${localResult.action} risk=${localResult.riskScore.toFixed(2)}`);

    const result = (apiResult.action !== "allow")
      ? apiResult
      : (localResult.action === "block") ? localResult : apiResult;

    cache.set(key, result);

    const icon = result.action === "block" ? "🛑" : "✅";
    log.info(`${TAG} ━━━ RESULT: ${icon} ${result.action.toUpperCase()} ━━━`);
    log.info(`${TAG} risk=${result.riskScore.toFixed(2)} latency=${result.latencyMs}ms`);
    if (result.reason) log.warn(`${TAG} hijack detected: ${result.reason}`);
  });

  log.info(`${TAG} registered (llm_input)`);
}

async function detectReasoningHijack(
  content: string,
  config: AegisGuardConfig,
  log: OpenClawPluginAPI["logger"],
): Promise<GuardResult> {
  const start = Date.now();
  try {
    log.info(`${TAG} calling AEGIS /v3/agent/reasoning-hijack ...`);
    const res: any = await aegisApi.reasoningHijack({
      prompt: content,
      check_types: [],
    });

    const riskScore = res.risk_score ?? 0;
    const types = (res.hijack_types ?? []).map((h: any) => `${h.hijack_type}(${h.confidence?.toFixed(2)})`);
    log.info(`${TAG} reasoning-hijack → hijacked=${res.is_hijacked} risk=${riskScore.toFixed(2)} types=[${types.join(", ")}]`);

    return {
      action: res.is_hijacked && riskScore >= config.riskThresholds.block
        ? "block"
        : res.is_hijacked && riskScore >= config.riskThresholds.escalate
          ? "escalate" : "allow",
      reason: res.is_hijacked
        ? `Reasoning hijack: ${(res.hijack_types ?? []).map((h: any) => h.hijack_type).join(", ")} (risk=${riskScore.toFixed(2)})` : undefined,
      riskScore,
      details: { source: "v3/agent/reasoning-hijack" },
      latencyMs: Date.now() - start,
    };
  } catch (err) {
    log.warn(`${TAG} reasoning-hijack API failed: ${String(err)}`);
    return {
      action: config.guardMode === "strict" ? "block" : "allow",
      reason: "AEGIS reasoning scan unavailable — fallback policy applied",
      riskScore: 0, details: { source: "fallback" }, latencyMs: Date.now() - start,
    };
  }
}
