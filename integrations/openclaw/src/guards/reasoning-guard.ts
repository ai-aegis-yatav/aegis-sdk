import { getClient } from "../aegis-client.js";
import { GuardCache, cacheKey } from "../cache.js";
import type {
  AegisGuardConfig,
  GuardResult,
  ReasoningContext,
  HeartbeatContext,
  OpenClawPluginAPI,
} from "../types.js";

const GUARD_REASONING = "reasoning";
const GUARD_HEARTBEAT = "heartbeat";

/**
 * Registers two reasoning-level guards:
 *
 *  1. `onAgentReasoning` — intercepts the agent's Chain-of-Thought / planning
 *     output and calls AEGIS `POST /v3/agent/reasoning-hijack` to detect:
 *       - UDora reasoning perturbation
 *       - PoT (Plan-of-Thought) backdoors
 *       - CoT manipulation
 *       - Goal substitution & logic poisoning
 *
 *  2. `heartbeat` — runs periodic anomaly detection on session-level metrics
 *     using AEGIS `POST /v3/anomaly/detect` with Isolation Forest.
 */
export function registerReasoningGuard(
  api: OpenClawPluginAPI,
  config: AegisGuardConfig,
  cache: GuardCache,
): void {
  // --- onAgentReasoning ---
  api.lifecycle.on<ReasoningContext>(
    "onAgentReasoning",
    async (ctx) => {
      if (!ctx.prompt && !ctx.reasoningOutput) return;

      const key = cacheKey(
        GUARD_REASONING,
        ctx.session.id,
        (ctx.prompt ?? "").slice(0, 256),
        (ctx.reasoningOutput ?? "").slice(0, 256),
      );
      const cached = cache.get(key);
      if (cached) {
        if (cached.action === "block") ctx.block(cached.reason ?? "Blocked by AEGIS Guard");
        return;
      }

      const result = await detectReasoningHijack(ctx, config);
      cache.set(key, result);

      if (result.action === "block") {
        ctx.block(result.reason ?? "Reasoning hijack detected by AEGIS Guard");
      }
    },
    { priority: 0, timeout: config.timeout },
  );

  // --- heartbeat: periodic anomaly detection ---
  if (config.enabledGuards.heartbeat) {
    api.lifecycle.on<HeartbeatContext>(
      "heartbeat",
      async (ctx) => {
        if (!ctx.sessionMetrics?.length) return;

        const result = await detectSessionAnomaly(ctx, config);
        if (result.action === "block") {
          ctx.pauseAgent();
        }
      },
      { priority: 50, timeout: config.timeout },
    );
  }

  api.log.info("[aegis-guard] reasoning guard registered (onAgentReasoning + heartbeat)");
}

// ---------------------------------------------------------------------------
// Reasoning hijack detection
// ---------------------------------------------------------------------------

async function detectReasoningHijack(
  ctx: ReasoningContext,
  config: AegisGuardConfig,
): Promise<GuardResult> {
  const start = Date.now();
  const aegis = getClient();

  try {
    const res = await aegis.agent.reasoningHijack({
      prompt: ctx.prompt ?? "",
      reasoning_output: ctx.reasoningOutput ?? undefined,
      check_types: [],
    }) as {
      is_hijacked?: boolean;
      risk_score?: number;
      hijack_types?: Array<{ hijack_type: string; confidence: number }>;
      recommendations?: string[];
    };

    const riskScore = res.risk_score ?? 0;

    return {
      action: res.is_hijacked && riskScore >= config.riskThresholds.block
        ? "block"
        : res.is_hijacked && riskScore >= config.riskThresholds.escalate
          ? "escalate"
          : "allow",
      reason: res.is_hijacked
        ? `Reasoning hijack: ${(res.hijack_types ?? []).map(h => h.hijack_type).join(", ")} (risk=${riskScore.toFixed(2)})`
        : undefined,
      riskScore,
      details: {
        source: "v3/agent/reasoning-hijack",
        hijackTypes: res.hijack_types,
        recommendations: res.recommendations,
      },
      latencyMs: Date.now() - start,
    };
  } catch {
    return {
      action: config.guardMode === "strict" ? "block" : "allow",
      reason: "AEGIS reasoning scan unavailable — fallback policy applied",
      riskScore: 0,
      details: { source: "fallback" },
      latencyMs: Date.now() - start,
    };
  }
}

// ---------------------------------------------------------------------------
// Heartbeat anomaly detection
// ---------------------------------------------------------------------------

async function detectSessionAnomaly(
  ctx: HeartbeatContext,
  config: AegisGuardConfig,
): Promise<GuardResult> {
  const start = Date.now();
  const aegis = getClient();

  try {
    const res = await aegis.anomaly.detect({
      metric: "session_risk",
      algorithm: "isolation_forest",
      parameters: {
        values: ctx.sessionMetrics,
        session_id: ctx.session.id,
      },
    });

    const riskScore = res.anomalies_detected > 0 ? 0.8 : 0;

    return {
      action: riskScore >= config.riskThresholds.block ? "block" : "allow",
      reason: res.anomalies_detected > 0
        ? `Session anomaly detected (${res.anomalies_detected} anomalies, algo=${res.algorithm})`
        : undefined,
      riskScore,
      details: { source: "v3/anomaly/detect", anomalies: res.anomalies },
      latencyMs: Date.now() - start,
    };
  } catch {
    return {
      action: "allow",
      riskScore: 0,
      details: { source: "fallback" },
      latencyMs: Date.now() - start,
    };
  }
}
