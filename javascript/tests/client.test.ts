import { describe, it, expect } from "vitest";
import { AegisClient } from "../src/client";
import {
  AegisError,
  AuthenticationError,
  TierAccessError,
  QuotaExceededError,
  RateLimitError,
  ValidationError,
  NotFoundError,
  ServerError,
  NetworkError,
} from "../src/errors";

describe("AegisClient", () => {
  it("should construct with required apiKey", () => {
    const client = new AegisClient({ apiKey: "aegis_sk_test" });
    expect(client).toBeDefined();
    expect(client.judge).toBeDefined();
    expect(client.rules).toBeDefined();
    expect(client.escalations).toBeDefined();
    expect(client.analytics).toBeDefined();
    expect(client.evidence).toBeDefined();
    expect(client.ml).toBeDefined();
    expect(client.nlp).toBeDefined();
    expect(client.aiAct).toBeDefined();
    expect(client.classify).toBeDefined();
    expect(client.jailbreak).toBeDefined();
    expect(client.safety).toBeDefined();
    expect(client.defense).toBeDefined();
    expect(client.advanced).toBeDefined();
    expect(client.adversaflow).toBeDefined();
    expect(client.guardnet).toBeDefined();
    expect(client.agent).toBeDefined();
    expect(client.anomaly).toBeDefined();
    expect(client.multimodal).toBeDefined();
    expect(client.evolution).toBeDefined();
    expect(client.saber).toBeDefined();
    expect(client.ops).toBeDefined();
    expect(client.apiKeys).toBeDefined();
  });

  it("should throw on empty apiKey", () => {
    expect(() => new AegisClient({ apiKey: "" })).toThrow("apiKey is required");
  });

  it("should have initial quota as empty", () => {
    const client = new AegisClient({ apiKey: "test" });
    expect(client.quota.limit).toBeUndefined();
    expect(client.quota.used).toBeUndefined();
    expect(client.quota.remaining).toBeUndefined();
  });
});

describe("Error hierarchy", () => {
  it("AuthenticationError extends ApiError extends AegisError", () => {
    const err = new AuthenticationError();
    expect(err).toBeInstanceOf(AuthenticationError);
    expect(err).toBeInstanceOf(AegisError);
    expect(err.statusCode).toBe(401);
  });

  it("TierAccessError has required_tier and upgrade_url", () => {
    const err = new TierAccessError("Upgrade", {
      requiredTier: "pro",
      upgradeUrl: "https://aiaegis.io/upgrade",
    });
    expect(err.statusCode).toBe(403);
    expect(err.requiredTier).toBe("pro");
    expect(err.upgradeUrl).toBe("https://aiaegis.io/upgrade");
  });

  it("QuotaExceededError has limit/used/resetAt", () => {
    const err = new QuotaExceededError("Exceeded", {
      limit: 1000,
      used: 1001,
      resetAt: "2026-03-01",
    });
    expect(err.statusCode).toBe(429);
    expect(err.limit).toBe(1000);
    expect(err.used).toBe(1001);
  });

  it("RateLimitError has retryAfter", () => {
    const err = new RateLimitError("Slow down", { retryAfter: 60 });
    expect(err.retryAfter).toBe(60);
  });

  it("ValidationError with custom status", () => {
    const err = new ValidationError("Bad input", 422);
    expect(err.statusCode).toBe(422);
  });

  it("NotFoundError defaults to 404", () => {
    const err = new NotFoundError();
    expect(err.statusCode).toBe(404);
  });

  it("ServerError defaults to 500", () => {
    const err = new ServerError();
    expect(err.statusCode).toBe(500);
  });

  it("NetworkError wraps cause", () => {
    const cause = new Error("ECONNREFUSED");
    const err = new NetworkError("Connection failed", cause);
    expect(err.cause).toBe(cause);
  });
});
