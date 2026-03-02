import { describe, it, expect, vi, beforeEach } from "vitest";
import activate from "../src/index.js";
import type { OpenClawPluginAPI } from "../src/types.js";

function createMockAPI(): OpenClawPluginAPI & { hooks: Map<string, Function> } {
  const hooks = new Map<string, Function>();
  return {
    hooks,
    lifecycle: {
      on: vi.fn((phase: string, handler: Function, _opts?: unknown) => {
        hooks.set(phase, handler);
      }),
    },
    log: {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
    },
  };
}

describe("activate", () => {
  beforeEach(() => {
    vi.stubEnv("AEGIS_API_KEY", "aegis_sk_test_123");
    vi.stubEnv("AEGIS_BASE_URL", "https://test.aegis.local");
  });

  it("registers all guards when defaults are used", () => {
    const api = createMockAPI();
    activate(api);

    expect(api.lifecycle.on).toHaveBeenCalledWith(
      "preMessageProcess",
      expect.any(Function),
      expect.any(Object),
    );
    expect(api.lifecycle.on).toHaveBeenCalledWith(
      "preToolExecution",
      expect.any(Function),
      expect.any(Object),
    );
    expect(api.lifecycle.on).toHaveBeenCalledWith(
      "preMemoryStore",
      expect.any(Function),
      expect.any(Object),
    );
    expect(api.lifecycle.on).toHaveBeenCalledWith(
      "postToolExecution",
      expect.any(Function),
      expect.any(Object),
    );
    expect(api.lifecycle.on).toHaveBeenCalledWith(
      "preMessageSend",
      expect.any(Function),
      expect.any(Object),
    );
    expect(api.lifecycle.on).toHaveBeenCalledWith(
      "onAgentReasoning",
      expect.any(Function),
      expect.any(Object),
    );

    expect(api.hooks.has("preMessageProcess")).toBe(true);
    expect(api.hooks.has("preToolExecution")).toBe(true);
    expect(api.hooks.has("preMemoryStore")).toBe(true);
  });

  it("skips disabled guards", () => {
    vi.stubEnv("AEGIS_GUARD_MEMORY", "false");
    vi.stubEnv("AEGIS_GUARD_REASONING", "false");

    const api = createMockAPI();
    activate(api);

    expect(api.hooks.has("preMemoryStore")).toBe(false);
    expect(api.hooks.has("onAgentReasoning")).toBe(false);
    expect(api.hooks.has("preMessageProcess")).toBe(true);
  });

  it("throws when AEGIS_API_KEY is missing", () => {
    vi.stubEnv("AEGIS_API_KEY", "");
    const api = createMockAPI();
    expect(() => activate(api)).toThrow("AEGIS_API_KEY is required");
  });

  it("logs activation message", () => {
    const api = createMockAPI();
    activate(api);
    expect(api.log.info).toHaveBeenCalledWith(
      expect.stringContaining("[aegis-guard] activating"),
    );
    expect(api.log.info).toHaveBeenCalledWith(
      "[aegis-guard] all guards registered successfully",
    );
  });
});
