import { aegisApi } from "../aegis-client.js";
import { GuardCache, cacheKey } from "../cache.js";
import { localPromptGuard } from "./local-fallback.js";
import type {
  AegisGuardConfig,
  GuardResult,
  OpenClawPluginAPI,
} from "../types.js";

const TAG = "[aegis-guard:memory]";

export function registerMemoryGuard(
  api: OpenClawPluginAPI,
  config: AegisGuardConfig,
  cache: GuardCache,
): void {
  const log = api.logger;

  api.on("llm_output", async (event: any, _ctx: any) => {
    const output = event?.output ?? event?.content ?? event?.text;
    if (!output || typeof output !== "string") return;

    log.info(`${TAG} ━━━ SCANNING LLM output for memory safety ━━━`);
    log.info(`${TAG} output_len=${output.length}`);

    const key = cacheKey("memory", output.slice(0, 256));
    const cached = cache.get(key);
    if (cached) {
      log.info(`${TAG} cache HIT action=${cached.action} risk=${cached.riskScore.toFixed(2)}`);
      return;
    }

    const apiResult = await analyzeMemory(output, config, log);
    const localResult = localPromptGuard(output);

    log.info(`${TAG} API: action=${apiResult.action} risk=${apiResult.riskScore.toFixed(2)}`);
    log.info(`${TAG} Local: action=${localResult.action} risk=${localResult.riskScore.toFixed(2)}`);

    const result = (apiResult.action !== "allow")
      ? apiResult
      : (localResult.action === "block") ? localResult : apiResult;

    cache.set(key, result);

    const icon = result.action === "block" ? "🛑" : "✅";
    log.info(`${TAG} ━━━ RESULT: ${icon} ${result.action.toUpperCase()} ━━━`);
    log.info(`${TAG} risk=${result.riskScore.toFixed(2)} latency=${result.latencyMs}ms`);
    if (result.reason) log.warn(`${TAG} memory threat: ${result.reason}`);
  });

  log.info(`${TAG} registered (llm_output for memory safety)`);
}

async function analyzeMemory(
  content: string,
  config: AegisGuardConfig,
  log: OpenClawPluginAPI["logger"],
): Promise<GuardResult> {
  const start = Date.now();
  try {
    log.info(`${TAG} calling AEGIS /v3/agent/memory-poisoning ...`);
    const res: any = await aegisApi.memoryPoisoning({
      messages: [{ role: "assistant", content }],
      memory_entries: [content],
      session_id: "current",
    });

    const riskScore = res.risk_score ?? 0;
    log.info(`${TAG} memory-poisoning → poisoned=${res.is_poisoned} risk=${riskScore.toFixed(2)} attacks=[${(res.attack_types ?? []).join(", ")}]`);

    return {
      action: res.is_poisoned && riskScore >= config.riskThresholds.block
        ? "block"
        : res.is_poisoned && riskScore >= config.riskThresholds.escalate
          ? "escalate" : "allow",
      reason: res.is_poisoned
        ? `Memory poisoning: ${(res.attack_types ?? []).join(", ")} (risk=${riskScore.toFixed(2)})` : undefined,
      riskScore,
      details: { source: "v3/agent/memory-poisoning" },
      latencyMs: Date.now() - start,
    };
  } catch (err) {
    log.warn(`${TAG} memory-poisoning API failed: ${String(err)}`);
    return {
      action: config.guardMode === "strict" ? "block" : "allow",
      reason: "AEGIS memory scan unavailable — fallback policy applied",
      riskScore: 0, details: { source: "fallback" }, latencyMs: Date.now() - start,
    };
  }
}
