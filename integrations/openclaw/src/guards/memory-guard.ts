import { getClient } from "../aegis-client.js";
import { GuardCache, cacheKey } from "../cache.js";
import type {
  AegisGuardConfig,
  GuardResult,
  MemoryStoreContext,
  OpenClawPluginAPI,
} from "../types.js";

const GUARD_NAME = "memory";

/**
 * Registers the memory integrity guard on the `preMemoryStore` phase.
 *
 * Before new entries are persisted to the agent's long-term memory
 * this hook calls AEGIS `POST /v3/agent/memory-poisoning` to detect:
 *  - MINJA (Memory INJection Attack)
 *  - InjecMEM (direct memory manipulation)
 *  - MemoryGraft (false-history injection)
 *  - Trigger injection (conditional behaviour planting)
 */
export function registerMemoryGuard(
  api: OpenClawPluginAPI,
  config: AegisGuardConfig,
  cache: GuardCache,
): void {
  api.lifecycle.on<MemoryStoreContext>(
    "preMemoryStore",
    async (ctx) => {
      if (!ctx.newEntries.length) return;

      const key = cacheKey(GUARD_NAME, ctx.session.id, ...ctx.newEntries);
      const cached = cache.get(key);
      if (cached) {
        if (cached.action === "block") ctx.reject(cached.reason ?? "Blocked by AEGIS Guard");
        return;
      }

      const result = await analyzeMemory(ctx, config);
      cache.set(key, result);

      if (result.action === "block") {
        ctx.reject(result.reason ?? "Memory poisoning detected by AEGIS Guard");
      }
    },
    { priority: 0, timeout: config.timeout },
  );

  api.log.info("[aegis-guard] memory guard registered (preMemoryStore)");
}

async function analyzeMemory(
  ctx: MemoryStoreContext,
  config: AegisGuardConfig,
): Promise<GuardResult> {
  const start = Date.now();
  const aegis = getClient();

  try {
    const res = await aegis.agent.memoryPoisoning({
      messages: ctx.recentMessages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      memory_entries: ctx.newEntries,
      session_id: ctx.session.id,
    }) as {
      is_poisoned?: boolean;
      risk_score?: number;
      attack_types?: string[];
      recommendations?: string[];
    };

    const riskScore = res.risk_score ?? 0;

    return {
      action: res.is_poisoned && riskScore >= config.riskThresholds.block
        ? "block"
        : res.is_poisoned && riskScore >= config.riskThresholds.escalate
          ? "escalate"
          : "allow",
      reason: res.is_poisoned
        ? `Memory poisoning detected: ${(res.attack_types ?? []).join(", ")} (risk=${riskScore.toFixed(2)})`
        : undefined,
      riskScore,
      details: {
        source: "v3/agent/memory-poisoning",
        attackTypes: res.attack_types,
        recommendations: res.recommendations,
      },
      latencyMs: Date.now() - start,
    };
  } catch {
    return {
      action: config.guardMode === "strict" ? "block" : "allow",
      reason: "AEGIS memory scan unavailable — fallback policy applied",
      riskScore: 0,
      details: { source: "fallback" },
      latencyMs: Date.now() - start,
    };
  }
}
