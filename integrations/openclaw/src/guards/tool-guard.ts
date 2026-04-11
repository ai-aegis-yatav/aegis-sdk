import { aegisApi } from "../aegis-client.js";
import { GuardCache, cacheKey } from "../cache.js";
import { localToolGuard } from "./local-fallback.js";
import type {
  AegisGuardConfig,
  GuardResult,
  OpenClawPluginAPI,
} from "../types.js";

const GUARD_NAME = "tool";
const TAG = "[aegis-guard:tool]";

export function registerToolGuard(
  api: OpenClawPluginAPI,
  config: AegisGuardConfig,
  cache: GuardCache,
): void {
  const log = api.logger;

  api.on("before_tool_call", async (event: any, _ctx: any) => {
    const toolName = event?.toolName ?? "unknown";
    const params = event?.params;
    log.info(`${TAG} ━━━ CHECKING tool call ━━━`);
    log.info(`${TAG} tool="${toolName}" params=${JSON.stringify(params ?? {}).slice(0, 200)}`);

    const key = cacheKey(GUARD_NAME, toolName, JSON.stringify(params ?? {}));
    const cached = cache.get(key);
    if (cached) {
      log.info(`${TAG} cache HIT action=${cached.action} risk=${cached.riskScore.toFixed(2)}`);
      if (cached.action === "block") {
        log.warn(`${TAG} 🛑 BLOCKED (cached) tool="${toolName}" reason=${cached.reason}`);
        return { block: true, blockReason: cached.reason ?? "Blocked by AEGIS Guard" };
      }
      log.info(`${TAG} ✅ ALLOWED (cached) tool="${toolName}"`);
      return;
    }

    const apiResult = await analyzeToolCall(toolName, params, config, log);
    const localResult = localToolGuard([toolName], JSON.stringify(params ?? {}));

    log.info(`${TAG} API: action=${apiResult.action} risk=${apiResult.riskScore.toFixed(2)}`);
    log.info(`${TAG} Local: action=${localResult.action} risk=${localResult.riskScore.toFixed(2)}`);

    const result = (apiResult.action !== "allow")
      ? apiResult
      : (localResult.action === "block") ? localResult : apiResult;

    cache.set(key, result);

    const icon = result.action === "block" ? "🛑" : "✅";
    log.info(`${TAG} ━━━ RESULT: ${icon} ${result.action.toUpperCase()} ━━━`);
    log.info(`${TAG} risk=${result.riskScore.toFixed(2)} latency=${result.latencyMs}ms`);
    if (result.reason) log.warn(`${TAG} reason: ${result.reason}`);

    if (result.action === "block") {
      return { block: true, blockReason: result.reason ?? "Blocked by AEGIS Guard" };
    }
  });

  log.info(`${TAG} registered (before_tool_call)`);
}

async function analyzeToolCall(
  toolName: string,
  params: any,
  config: AegisGuardConfig,
  log: OpenClawPluginAPI["logger"],
): Promise<GuardResult> {
  const start = Date.now();

  if (config.deniedTools.length && config.deniedTools.includes(toolName)) {
    log.warn(`${TAG} tool "${toolName}" is in deny list`);
    return {
      action: "block",
      reason: `Tool "${toolName}" is denied by policy`,
      riskScore: 1.0,
      details: { source: "deny-list" },
      latencyMs: Date.now() - start,
    };
  }

  try {
    log.info(`${TAG} calling AEGIS /v3/agent/tool-disguise ...`);
    const res: any = await aegisApi.toolDisguise({
      tool_name: toolName,
      tool_description: "",
      tool_input: JSON.stringify(params ?? {}),
      previous_invocations: [],
      tool_catalog: [],
    });

    const riskScore = res.risk_score ?? 0;
    log.info(`${TAG} tool-disguise → risk=${riskScore.toFixed(2)} disguised=${res.is_disguised ?? false} type=${res.disguise_type ?? "none"}`);

    return {
      action: riskScore >= config.riskThresholds.block ? "block"
        : riskScore >= config.riskThresholds.escalate ? "escalate"
        : "allow",
      reason: riskScore >= config.riskThresholds.escalate
        ? `Tool disguise risk=${riskScore.toFixed(2)} type=${res.disguise_type ?? "unknown"}`
        : undefined,
      riskScore,
      details: { source: "v3/agent/tool-disguise" },
      latencyMs: Date.now() - start,
    };
  } catch (err) {
    log.warn(`${TAG} tool-disguise API failed: ${String(err)} — allowing`);
    return { action: "allow", riskScore: 0, details: { source: "fallback" }, latencyMs: Date.now() - start };
  }
}
