import { describe, it, expect, beforeEach } from "vitest";
import { GuardCache, cacheKey } from "../src/cache.js";

describe("GuardCache", () => {
  let cache: GuardCache;

  beforeEach(() => {
    cache = new GuardCache(3, 1000);
  });

  it("returns undefined for missing keys", () => {
    expect(cache.get("nonexistent")).toBeUndefined();
  });

  it("stores and retrieves results", () => {
    const result = { action: "allow" as const, riskScore: 0, latencyMs: 5 };
    cache.set("k1", result);
    expect(cache.get("k1")).toEqual(result);
  });

  it("evicts oldest entry when maxEntries is reached", () => {
    const r = { action: "allow" as const, riskScore: 0, latencyMs: 1 };
    cache.set("a", r);
    cache.set("b", r);
    cache.set("c", r);
    expect(cache.size).toBe(3);

    cache.set("d", r);
    expect(cache.size).toBe(3);
    expect(cache.get("a")).toBeUndefined();
    expect(cache.get("d")).toEqual(r);
  });

  it("expires entries after TTL", async () => {
    const shortCache = new GuardCache(10, 50);
    const r = { action: "block" as const, riskScore: 0.9, reason: "test", latencyMs: 1 };
    shortCache.set("k", r);
    expect(shortCache.get("k")).toEqual(r);

    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(shortCache.get("k")).toBeUndefined();
  });

  it("clears all entries", () => {
    const r = { action: "allow" as const, riskScore: 0, latencyMs: 1 };
    cache.set("a", r);
    cache.set("b", r);
    cache.clear();
    expect(cache.size).toBe(0);
  });
});

describe("cacheKey", () => {
  it("produces consistent keys for same input", () => {
    const k1 = cacheKey("guard", "session1", "hello");
    const k2 = cacheKey("guard", "session1", "hello");
    expect(k1).toBe(k2);
  });

  it("produces different keys for different input", () => {
    const k1 = cacheKey("guard", "session1", "hello");
    const k2 = cacheKey("guard", "session2", "hello");
    expect(k1).not.toBe(k2);
  });

  it("produces different keys for different guard names", () => {
    const k1 = cacheKey("inbound", "s", "hello");
    const k2 = cacheKey("tool", "s", "hello");
    expect(k1).not.toBe(k2);
  });
});
