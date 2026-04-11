import type { AegisGuardConfig, GuardMode } from "./types.js";

const MODE_THRESHOLDS: Record<GuardMode, { block: number; escalate: number }> = {
  strict:     { block: 0.3, escalate: 0.15 },
  balanced:   { block: 0.6, escalate: 0.35 },
  permissive: { block: 0.85, escalate: 0.55 },
};

export function loadConfig(env: Record<string, string | undefined> = process.env): AegisGuardConfig {
  const apiKey = env.AEGIS_API_KEY ?? "";
  if (!apiKey) {
    throw new Error("[aegis-guard] AEGIS_API_KEY is required");
  }

  const guardMode = (env.AEGIS_GUARD_MODE ?? "balanced") as GuardMode;
  if (!MODE_THRESHOLDS[guardMode]) {
    throw new Error(`[aegis-guard] Invalid AEGIS_GUARD_MODE: ${guardMode}`);
  }

  return {
    apiKey,
    baseUrl: (env.AEGIS_BASE_URL ?? "https://api.aiaegis.io").replace(/\/$/, ""),
    guardMode,
    timeout: parseInt(env.AEGIS_TIMEOUT ?? "5000", 10),
    maxRetries: parseInt(env.AEGIS_MAX_RETRIES ?? "2", 10),

    allowedTools: env.AEGIS_ALLOWED_TOOLS?.split(",").map(s => s.trim()).filter(Boolean) ?? [],
    deniedTools: env.AEGIS_DENIED_TOOLS?.split(",").map(s => s.trim()).filter(Boolean) ?? [],
    defaultPrivilegeLevel: parseInt(env.AEGIS_DEFAULT_PRIVILEGE ?? "2", 10),

    riskThresholds: MODE_THRESHOLDS[guardMode],

    cache: {
      enabled: env.AEGIS_CACHE_ENABLED !== "false",
      ttlMs: parseInt(env.AEGIS_CACHE_TTL_MS ?? "30000", 10),
      maxEntries: parseInt(env.AEGIS_CACHE_MAX_ENTRIES ?? "500", 10),
    },

    enabledGuards: {
      inbound: env.AEGIS_GUARD_INBOUND !== "false",
      tool: env.AEGIS_GUARD_TOOL !== "false",
      output: env.AEGIS_GUARD_OUTPUT !== "false",
      memory: env.AEGIS_GUARD_MEMORY !== "false",
      reasoning: env.AEGIS_GUARD_REASONING !== "false",
      heartbeat: env.AEGIS_GUARD_HEARTBEAT !== "false",
    },
  };
}
