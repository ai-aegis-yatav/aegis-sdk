import { AegisClient } from "@aegis-ai/sdk";
import type { AegisGuardConfig } from "./types.js";

let _client: AegisClient | null = null;

export function initClient(config: AegisGuardConfig): AegisClient {
  _client = new AegisClient({
    apiKey: config.apiKey,
    baseUrl: config.baseUrl,
    timeout: config.timeout,
    maxRetries: config.maxRetries,
  });
  return _client;
}

export function getClient(): AegisClient {
  if (!_client) throw new Error("[aegis-guard] AEGIS client not initialised — call initClient first");
  return _client;
}
