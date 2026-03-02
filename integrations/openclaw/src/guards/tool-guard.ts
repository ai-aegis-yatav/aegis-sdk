import { getClient } from "../aegis-client.js";
import { GuardCache, cacheKey } from "../cache.js";
import type {
  AegisGuardConfig,
  GuardResult,
  ToolExecutionContext,
  OpenClawPluginAPI,
} from "../types.js";

const GUARD_NAME = "tool";

/**
 * Registers the tool execution guard on the `preToolExecution` phase.
 *
 * Before every tool call this hook:
 *  1. Runs AEGIS `POST /v3/agent/toolchain` to detect STAC (Sequential Tool
 *     Abuse Chain) attacks across the full chain.
 *  2. Runs AEGIS `POST /v3/agent/tool-disguise` on the current invocation to
 *     detect iMIST progressive-escalation and tool-impersonation attacks.
 *  3. Merges both risk scores and applies the configured thresholds.
 */
export function registerToolGuard(
  api: OpenClawPluginAPI,
  config: AegisGuardConfig,
  cache: GuardCache,
): void {
  api.lifecycle.on<ToolExecutionContext>(
    "preToolExecution",
    async (ctx) => {
      const toolName = ctx.invocation.tool.name;
      const chainNames = ctx.toolChain.map(t => t.name);
      const key = cacheKey(GUARD_NAME, ctx.session.id, ...chainNames, toolName);

      const cached = cache.get(key);
      if (cached) {
        if (cached.action === "block") ctx.block(cached.reason ?? "Blocked by AEGIS Guard");
        return;
      }

      const result = await analyzeToolExecution(ctx, config);
      cache.set(key, result);

      if (result.action === "block") {
        ctx.block(result.reason ?? "Blocked by AEGIS Guard");
      }
    },
    { priority: 0, timeout: config.timeout },
  );

  api.log.info("[aegis-guard] tool guard registered (preToolExecution)");
}

async function analyzeToolExecution(
  ctx: ToolExecutionContext,
  config: AegisGuardConfig,
): Promise<GuardResult> {
  const start = Date.now();
  const aegis = getClient();

  const [chainResult, disguiseResult] = await Promise.allSettled([
    analyzeChain(aegis, ctx, config),
    analyzeDisguise(aegis, ctx),
  ]);

  const chainRisk = chainResult.status === "fulfilled" ? chainResult.value : 0;
  const disguiseRisk = disguiseResult.status === "fulfilled" ? disguiseResult.value : 0;
  const combinedRisk = Math.min(1, Math.max(chainRisk, disguiseRisk));

  const reasons: string[] = [];
  if (chainResult.status === "fulfilled" && chainRisk >= config.riskThresholds.escalate) {
    reasons.push(`tool-chain risk=${chainRisk.toFixed(2)}`);
  }
  if (disguiseResult.status === "fulfilled" && disguiseRisk >= config.riskThresholds.escalate) {
    reasons.push(`tool-disguise risk=${disguiseRisk.toFixed(2)}`);
  }

  return {
    action: combinedRisk >= config.riskThresholds.block
      ? "block"
      : combinedRisk >= config.riskThresholds.escalate
        ? "escalate"
        : "allow",
    reason: reasons.length ? reasons.join("; ") : undefined,
    riskScore: combinedRisk,
    details: { chainRisk, disguiseRisk },
    latencyMs: Date.now() - start,
  };
}

async function analyzeChain(
  aegis: ReturnType<typeof getClient>,
  ctx: ToolExecutionContext,
  config: AegisGuardConfig,
): Promise<number> {
  const tools = ctx.toolChain.map(t => ({
    name: t.name,
    description: t.description ?? "",
  }));

  const res = await aegis.agent.toolchain({
    tools,
    execution_plan: ctx.toolChain.map(t => t.name),
    context: {
      privilege_level: ctx.agent.privilegeLevel ?? config.defaultPrivilegeLevel,
      allowed_tools: config.allowedTools,
      denied_tools: config.deniedTools,
    },
  });

  if (!res.is_safe) {
    const level = (res.risk_level ?? "").toLowerCase();
    if (level === "critical") return 0.95;
    if (level === "high") return 0.75;
    if (level === "medium") return 0.5;
    return 0.35;
  }
  return 0;
}

async function analyzeDisguise(
  aegis: ReturnType<typeof getClient>,
  ctx: ToolExecutionContext,
): Promise<number> {
  const res = await aegis.agent.toolDisguise({
    tool_name: ctx.invocation.tool.name,
    tool_description: ctx.invocation.tool.description ?? "",
    tool_input: JSON.stringify(ctx.invocation.arguments),
    previous_invocations: ctx.previousInvocations.map(inv => ({
      tool_name: inv.tool.name,
      arguments: inv.arguments,
    })),
    tool_catalog: ctx.toolChain.map(t => t.name),
  });

  return (res as Record<string, unknown>).risk_score as number ?? 0;
}
