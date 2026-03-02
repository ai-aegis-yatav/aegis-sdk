import { getClient } from "../aegis-client.js";
import { GuardCache, cacheKey } from "../cache.js";
import type {
  AegisGuardConfig,
  GuardResult,
  ToolOutputContext,
  MessageSendContext,
  OpenClawPluginAPI,
} from "../types.js";

const GUARD_POST_TOOL = "output-tool";
const GUARD_PRE_SEND = "output-send";

/**
 * Registers two output-facing guards:
 *
 *  1. `postToolExecution` — scans tool output for Indirect Prompt Injection
 *     (IPI) payloads before they reach the LLM by calling AEGIS
 *     `POST /v3/agent/scan` with the output as `external_data`.
 *
 *  2. `preMessageSend` — runs a final safety check on the agent's outbound
 *     reply via AEGIS `POST /v2/safety/check` to catch PII leaks, harmful
 *     content, or data exfiltration in the generated response.
 */
export function registerOutputGuard(
  api: OpenClawPluginAPI,
  config: AegisGuardConfig,
  cache: GuardCache,
): void {
  // --- postToolExecution: IPI in tool output ---
  api.lifecycle.on<ToolOutputContext>(
    "postToolExecution",
    async (ctx) => {
      if (!ctx.output) return;

      const key = cacheKey(GUARD_POST_TOOL, ctx.session.id, ctx.output.slice(0, 512));
      const cached = cache.get(key);
      if (cached) {
        applyToolOutputAction(ctx, cached);
        return;
      }

      const result = await scanToolOutput(ctx, config);
      cache.set(key, result);
      applyToolOutputAction(ctx, result);
    },
    { priority: 0, timeout: config.timeout },
  );

  // --- preMessageSend: final safety gate ---
  api.lifecycle.on<MessageSendContext>(
    "preMessageSend",
    async (ctx) => {
      const content = ctx.message.content;
      if (!content) return;

      const key = cacheKey(GUARD_PRE_SEND, ctx.session.id, content.slice(0, 512));
      const cached = cache.get(key);
      if (cached) {
        applyMessageSendAction(ctx, cached);
        return;
      }

      const result = await checkSafety(content, config);
      cache.set(key, result);
      applyMessageSendAction(ctx, result);
    },
    { priority: 10, timeout: config.timeout },
  );

  api.log.info("[aegis-guard] output guard registered (postToolExecution + preMessageSend)");
}

// ---------------------------------------------------------------------------
// Tool output IPI scan
// ---------------------------------------------------------------------------

async function scanToolOutput(
  ctx: ToolOutputContext,
  config: AegisGuardConfig,
): Promise<GuardResult> {
  const start = Date.now();
  const aegis = getClient();

  try {
    const res = await aegis.agent.scan({
      prompt: `Tool "${ctx.invocation.tool.name}" returned output`,
      tools: [ctx.output],
      context: { session_id: ctx.session.id, scan_type: "ipi_tool_output" },
    });

    const riskScore = res.confidence;
    return {
      action: res.injection_detected && riskScore >= config.riskThresholds.block
        ? "block"
        : res.injection_detected && riskScore >= config.riskThresholds.escalate
          ? "escalate"
          : "allow",
      reason: res.injection_detected
        ? `IPI in tool output: ${res.injection_type} (confidence=${riskScore.toFixed(2)})`
        : undefined,
      riskScore,
      details: { source: "v3/agent/scan:ipi", toolName: ctx.invocation.tool.name },
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

// ---------------------------------------------------------------------------
// Final outbound safety check
// ---------------------------------------------------------------------------

async function checkSafety(
  content: string,
  config: AegisGuardConfig,
): Promise<GuardResult> {
  const start = Date.now();
  const aegis = getClient();

  try {
    const res = await aegis.safety.check({ content });
    const riskScore = res.overall_score;

    return {
      action: !res.is_safe && riskScore >= config.riskThresholds.block
        ? "block"
        : !res.is_safe && riskScore >= config.riskThresholds.escalate
          ? "modify"
          : "allow",
      reason: !res.is_safe
        ? `Safety issue: ${res.flagged_categories.join(", ")} (score=${riskScore.toFixed(2)})`
        : undefined,
      riskScore,
      details: {
        source: "v2/safety/check",
        flaggedCategories: res.flagged_categories,
        backend: res.backend,
      },
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

// ---------------------------------------------------------------------------
// Action application
// ---------------------------------------------------------------------------

function applyToolOutputAction(ctx: ToolOutputContext, result: GuardResult): void {
  if (result.action === "block") {
    ctx.replaceOutput("[AEGIS Guard] Tool output blocked — potential injection detected.");
  }
}

function applyMessageSendAction(ctx: MessageSendContext, result: GuardResult): void {
  if (result.action === "block") {
    ctx.block(result.reason ?? "Blocked by AEGIS Guard");
  } else if (result.action === "modify") {
    ctx.replaceContent("[Content redacted by AEGIS Guard for safety reasons]");
  }
}
