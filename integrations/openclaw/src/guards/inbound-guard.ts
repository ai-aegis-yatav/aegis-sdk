import { aegisApi } from "../aegis-client.js";
import { GuardCache, cacheKey } from "../cache.js";
import { localPromptGuard } from "./local-fallback.js";
import { formatInboundReport, formatCompactStatus, maskContent } from "./report-formatter.js";
import type {
  AegisGuardConfig,
  GuardResult,
  OpenClawPluginAPI,
} from "../types.js";

const GUARD_NAME = "inbound";
const TAG = "[aegis-guard:inbound]";

export function registerInboundGuard(
  api: OpenClawPluginAPI,
  config: AegisGuardConfig,
  cache: GuardCache,
): void {
  const log = api.logger;

  api.on("message_received", async (event: any, ctx: any) => {
    const content = event?.content;
    if (!content) return;

    const sessionId = ctx?.conversationId ?? ctx?.channelId ?? "unknown";
    const from = event?.from ?? "unknown";
    log.info(`${TAG} ━━━ SCANNING inbound message ━━━`);
    log.info(`${TAG} from="${from}" len=${content.length} session=${sessionId}`);
    log.info(`${TAG} preview: "${content.slice(0, 100)}${content.length > 100 ? "..." : ""}"`);

    const key = cacheKey(GUARD_NAME, sessionId, content);
    const cached = cache.get(key);
    if (cached) {
      log.info(`${TAG} cache HIT action=${cached.action} risk=${cached.riskScore.toFixed(2)}`);
      if (cached.action === "block") {
        return {
          block: true,
          blockReason: cached.reason ?? "Blocked by AEGIS Guard",
          reply: formatInboundReport(cached, content.slice(0, 60), "inbound"),
        };
      }
      return;
    }

    const apiResult = await scanInbound(content, sessionId, from, config, log);
    const localResult = localPromptGuard(content);

    log.info(`${TAG} API: action=${apiResult.action} risk=${apiResult.riskScore.toFixed(2)}`);
    log.info(`${TAG} Local: action=${localResult.action} risk=${localResult.riskScore.toFixed(2)}`);

    const result = (apiResult.action !== "allow")
      ? apiResult
      : (localResult.action === "block") ? localResult : apiResult;

    log.info(`${TAG} FINAL: action=${result.action} risk=${result.riskScore.toFixed(2)} source=${result.details?.source ?? "?"}`);
    cache.set(key, result);
    logResult(result, log);

    // --- Report to chat ---
    if (result.action === "block") {
      return {
        block: true,
        blockReason: result.reason ?? "Blocked by AEGIS Guard",
        reply: formatInboundReport(result, content.slice(0, 60), "inbound"),
      };
    }

    if (result.action === "escalate") {
      return {
        reply: formatInboundReport(result, content.slice(0, 60), "inbound"),
      };
    }

    // ALLOW — inject compact status as metadata (visible in logs, non-intrusive)
    return {
      metadata: { aegisStatus: formatCompactStatus(result, "in") },
    };
  });

  log.info(`${TAG} registered (message_received)`);
}

function logResult(result: GuardResult, log: OpenClawPluginAPI["logger"]): void {
  const icon = result.action === "block" ? "🛑" : result.action === "escalate" ? "⚠️" : "✅";
  log.info(`${TAG} ━━━ RESULT: ${icon} ${result.action.toUpperCase()} ━━━`);
  log.info(`${TAG} risk=${result.riskScore.toFixed(2)} latency=${result.latencyMs}ms source=${result.details?.source ?? "?"}`);
  if (result.reason) log.warn(`${TAG} reason: ${result.reason}`);
}

async function scanInbound(
  content: string,
  sessionId: string,
  from: string,
  config: AegisGuardConfig,
  log: OpenClawPluginAPI["logger"],
): Promise<GuardResult> {
  const start = Date.now();

  try {
    log.info(`${TAG} calling AEGIS /v3/agent/scan ...`);
    const res: any = await aegisApi.agentScan({
      prompt: content,
      context: {
        session_id: sessionId,
        user_id: from,
        agent_type: "openclaw",
      },
    });

    const threats = res.threats ?? [];
    const topThreat = threats[0];
    const riskScore = topThreat?.confidence ?? 0;
    const injectionDetected = !res.is_safe && threats.length > 0;
    const injectionType = topThreat?.threat_type ?? "none";
    log.info(`${TAG} /v3/agent/scan → is_safe=${res.is_safe} threats=${threats.length} type=${injectionType} confidence=${riskScore.toFixed(2)}`);
    return {
      action: riskScore >= config.riskThresholds.block
        ? "block"
        : riskScore >= config.riskThresholds.escalate
          ? "escalate"
          : "allow",
      reason: injectionDetected
        ? `${injectionType} detected (confidence=${riskScore.toFixed(2)})`
        : undefined,
      riskScore,
      details: { source: "v3/agent/scan", ...res.details },
      latencyMs: Date.now() - start,
    };
  } catch (err) {
    log.warn(`${TAG} /v3/agent/scan failed: ${String(err)} — falling back`);
    return fallbackJudge(content, start, config, log);
  }
}

async function fallbackJudge(
  content: string,
  start: number,
  config: AegisGuardConfig,
  log: OpenClawPluginAPI["logger"],
): Promise<GuardResult> {
  try {
    log.info(`${TAG} trying fallback /v1/judge ...`);
    const res: any = await aegisApi.judge({ content });
    const riskScore = res.risk?.score ?? 0;
    log.info(`${TAG} /v1/judge → decision=${res.decision} risk=${riskScore.toFixed(2)} label=${res.risk?.label ?? "none"}`);
    return {
      action: riskScore >= config.riskThresholds.block
        ? "block"
        : riskScore >= config.riskThresholds.escalate
          ? "escalate"
          : "allow",
      reason: res.decision === "Block" ? `PALADIN blocked: ${res.risk?.label}` : undefined,
      riskScore,
      details: { source: "v1/judge", decision: res.decision },
      latencyMs: Date.now() - start,
    };
  } catch (err) {
    log.warn(`${TAG} /v1/judge failed: ${String(err)} — using local pattern guard`);
    const result = localPromptGuard(content);
    log.info(`${TAG} local fallback → action=${result.action} risk=${result.riskScore.toFixed(2)}`);
    return result;
  }
}
