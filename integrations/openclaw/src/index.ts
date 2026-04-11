/**
 * @aegis-ai/guard-openclaw
 *
 * AEGIS PALADIN defense plugin for OpenClaw AI agents.
 *
 * Hooks into the OpenClaw plugin lifecycle to provide multi-layer
 * AI agent security: prompt injection detection, tool chain analysis,
 * memory poisoning prevention, reasoning hijack detection, and
 * outbound safety checks — all powered by the AEGIS API.
 */

export { loadConfig } from "./config.js";
export { GuardCache, cacheKey } from "./cache.js";
export { initClient, getClient, aegisApi } from "./aegis-client.js";
export type * from "./types.js";

import { loadConfig } from "./config.js";
import { initClient } from "./aegis-client.js";
import { GuardCache } from "./cache.js";
import { registerInboundGuard } from "./guards/inbound-guard.js";
import { registerToolGuard } from "./guards/tool-guard.js";
import { registerMemoryGuard } from "./guards/memory-guard.js";
import { registerOutputGuard } from "./guards/output-guard.js";
import { registerReasoningGuard } from "./guards/reasoning-guard.js";
import type { OpenClawPluginAPI } from "./types.js";

/**
 * Internal activation logic. Reads configuration from environment
 * variables, initialises the AEGIS SDK client, and registers all
 * enabled lifecycle guards.
 */
function activate(api: OpenClawPluginAPI): void {
  const config = loadConfig();
  initClient(config);

  const cache = new GuardCache(config.cache.maxEntries, config.cache.ttlMs);

  api.logger.info(
    `[aegis-guard] activating — mode=${config.guardMode}, base=${config.baseUrl}`,
  );

  if (config.enabledGuards.inbound) {
    registerInboundGuard(api, config, cache);
  }
  if (config.enabledGuards.tool) {
    registerToolGuard(api, config, cache);
  }
  if (config.enabledGuards.memory) {
    registerMemoryGuard(api, config, cache);
  }
  if (config.enabledGuards.output) {
    registerOutputGuard(api, config, cache);
  }
  if (config.enabledGuards.reasoning) {
    registerReasoningGuard(api, config, cache);
  }

  api.logger.info("[aegis-guard] all guards registered successfully");
}

/**
 * OpenClaw plugin manifest.
 *
 * Conforms to the OpenClaw plugin SDK format:
 * `{ id, name, description, register(api) }`
 */
const aegisGuardPlugin = {
  id: "aegis-guard",
  name: "AEGIS Guard — AI Agent Defense",
  description:
    "Enterprise-grade 6-layer defense: prompt injection, tool chain attacks, memory poisoning, reasoning hijack detection, and outbound safety — powered by AEGIS PALADIN.",
  register(api: any) {
    activate(api);
  },
};

export default aegisGuardPlugin;
