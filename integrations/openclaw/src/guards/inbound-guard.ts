import { getClient } from "../aegis-client.js";
import { GuardCache, cacheKey } from "../cache.js";
import { localPromptGuard } from "./local-fallback.js";
import type {
  AegisGuardConfig,
  GuardResult,
  MessageProcessContext,
  OpenClawPluginAPI,
} from "../types.js";

const GUARD_NAME = "inbound";

/**
 * Registers the inbound message guard on the `preMessageProcess` phase.
 *
 * For every user message that enters the OpenClaw gateway this hook:
 *  1. Checks the local cache to avoid duplicate API calls within the TTL.
 *  2. Calls AEGIS `POST /v3/agent/scan` for DPI/IPI detection.
 *  3. Falls back to a lightweight `POST /v1/judge` call when the V3 scan
 *     is unavailable (rate limit, network failure).
 *  4. Applies the configured guard-mode thresholds to decide block / escalate / allow.
 */
export function registerInboundGuard(
  api: OpenClawPluginAPI,
  config: AegisGuardConfig,
  cache: GuardCache,
): void {
  api.lifecycle.on<MessageProcessContext>(
    "preMessageProcess",
    async (ctx) => {
      const content = ctx.message.content;
      if (!content) return;

      const key = cacheKey(GUARD_NAME, ctx.session.id, content);
      const cached = cache.get(key);
      if (cached) {
        applyAction(ctx, cached, config);
        return;
      }

      const result = await scanInbound(content, ctx, config);
      cache.set(key, result);
      applyAction(ctx, result, config);
    },
    { priority: 0, timeout: config.timeout },
  );

  api.log.info("[aegis-guard] inbound guard registered (preMessageProcess)");
}

async function scanInbound(
  content: string,
  ctx: MessageProcessContext,
  config: AegisGuardConfig,
): Promise<GuardResult> {
  const start = Date.now();
  const aegis = getClient();

  try {
    const res = await aegis.agent.scan({
      prompt: content,
      context: {
        session_id: ctx.session.id,
        user_id: ctx.sender.id,
        agent_type: "openclaw",
        platform: ctx.sender.platform,
      },
    });

    const riskScore = res.confidence;
    return {
      action: riskScore >= config.riskThresholds.block
        ? "block"
        : riskScore >= config.riskThresholds.escalate
          ? "escalate"
          : "allow",
      reason: res.injection_detected
        ? `${res.injection_type ?? "injection"} detected (confidence=${riskScore.toFixed(2)})`
        : undefined,
      riskScore,
      details: { source: "v3/agent/scan", ...res.details },
      latencyMs: Date.now() - start,
    };
  } catch {
    return fallbackJudge(content, start, config);
  }
}

/**
 * Two-tier fallback: first try the V1 judge endpoint (lighter weight),
 * then fall back to a purely local pattern matcher if the API is
 * completely unreachable.
 */
async function fallbackJudge(
  content: string,
  start: number,
  config: AegisGuardConfig,
): Promise<GuardResult> {
  try {
    const aegis = getClient();
    const res = await aegis.judge.create({ content });
    const riskScore = res.risk?.score ?? 0;
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
  } catch {
    return localPromptGuard(content);
  }
}

function applyAction(
  ctx: MessageProcessContext,
  result: GuardResult,
  _config: AegisGuardConfig,
): void {
  switch (result.action) {
    case "block":
      ctx.block(result.reason ?? "Blocked by AEGIS Guard");
      break;
    case "escalate":
      ctx.escalate(result.reason ?? "Flagged for human review by AEGIS Guard");
      break;
  }
}
