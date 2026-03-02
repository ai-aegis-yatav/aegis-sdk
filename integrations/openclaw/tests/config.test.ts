import { describe, it, expect } from "vitest";
import { loadConfig } from "../src/config.js";

describe("loadConfig", () => {
  const BASE_ENV = {
    AEGIS_API_KEY: "aegis_sk_test_key_123",
  };

  it("loads minimal config with defaults", () => {
    const cfg = loadConfig(BASE_ENV);
    expect(cfg.apiKey).toBe("aegis_sk_test_key_123");
    expect(cfg.baseUrl).toBe("https://api.aegis.ai");
    expect(cfg.guardMode).toBe("balanced");
    expect(cfg.timeout).toBe(5000);
    expect(cfg.maxRetries).toBe(2);
    expect(cfg.riskThresholds.block).toBe(0.6);
    expect(cfg.riskThresholds.escalate).toBe(0.35);
    expect(cfg.cache.enabled).toBe(true);
    expect(cfg.enabledGuards.inbound).toBe(true);
    expect(cfg.enabledGuards.reasoning).toBe(true);
  });

  it("throws when AEGIS_API_KEY is missing", () => {
    expect(() => loadConfig({})).toThrow("AEGIS_API_KEY is required");
  });

  it("applies strict mode thresholds", () => {
    const cfg = loadConfig({ ...BASE_ENV, AEGIS_GUARD_MODE: "strict" });
    expect(cfg.riskThresholds.block).toBe(0.3);
    expect(cfg.riskThresholds.escalate).toBe(0.15);
  });

  it("applies permissive mode thresholds", () => {
    const cfg = loadConfig({ ...BASE_ENV, AEGIS_GUARD_MODE: "permissive" });
    expect(cfg.riskThresholds.block).toBe(0.85);
    expect(cfg.riskThresholds.escalate).toBe(0.55);
  });

  it("throws on invalid guard mode", () => {
    expect(() => loadConfig({ ...BASE_ENV, AEGIS_GUARD_MODE: "yolo" })).toThrow(
      "Invalid AEGIS_GUARD_MODE",
    );
  });

  it("strips trailing slash from base URL", () => {
    const cfg = loadConfig({ ...BASE_ENV, AEGIS_BASE_URL: "https://my.server.com/" });
    expect(cfg.baseUrl).toBe("https://my.server.com");
  });

  it("parses tool allowlist/denylist", () => {
    const cfg = loadConfig({
      ...BASE_ENV,
      AEGIS_ALLOWED_TOOLS: "read_file, search, format",
      AEGIS_DENIED_TOOLS: "execute, delete",
    });
    expect(cfg.allowedTools).toEqual(["read_file", "search", "format"]);
    expect(cfg.deniedTools).toEqual(["execute", "delete"]);
  });

  it("respects guard toggle environment variables", () => {
    const cfg = loadConfig({
      ...BASE_ENV,
      AEGIS_GUARD_MEMORY: "false",
      AEGIS_GUARD_HEARTBEAT: "false",
    });
    expect(cfg.enabledGuards.memory).toBe(false);
    expect(cfg.enabledGuards.heartbeat).toBe(false);
    expect(cfg.enabledGuards.inbound).toBe(true);
  });
});
