import { AegisClient } from "@aegis-ai/sdk";
import type { AegisGuardConfig } from "./types.js";

let _client: AegisClient | null = null;

export function initClient(config: AegisGuardConfig): AegisClient {
  _client = new AegisClient({
    apiKey: config.apiKey,
    baseUrl: config.baseUrl,
  });
  return _client;
}

export function getClient(): AegisClient {
  if (!_client) throw new Error("[aegis-guard] AEGIS client not initialised — call initClient first");
  return _client;
}

/**
 * Typed wrappers around AEGIS security API endpoints.
 * The base SDK only has `.request()` — these add the security-specific calls.
 */
export const aegisApi = {
  async agentScan(body: Record<string, unknown>) {
    return getClient().request("/v3/agent/scan", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async judge(body: Record<string, unknown>) {
    return getClient().request("/v1/judge", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async safetyCheck(body: Record<string, unknown>) {
    return getClient().request("/v2/safety/check", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async toolDisguise(body: Record<string, unknown>) {
    return getClient().request("/v3/agent/tool-disguise", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async toolchain(body: Record<string, unknown>) {
    return getClient().request("/v3/agent/toolchain", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async memoryPoisoning(body: Record<string, unknown>) {
    return getClient().request("/v3/agent/memory-poisoning", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async reasoningHijack(body: Record<string, unknown>) {
    return getClient().request("/v3/agent/reasoning-hijack", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async anomalyDetect(body: Record<string, unknown>) {
    return getClient().request("/v3/anomaly/detect", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
};
