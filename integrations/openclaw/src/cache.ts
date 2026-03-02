import type { GuardResult } from "./types.js";

interface CacheEntry {
  result: GuardResult;
  expiresAt: number;
}

/**
 * Simple in-memory LRU-ish cache for guard results.
 * Prevents duplicate API calls for the same content within the TTL window.
 */
export class GuardCache {
  private store = new Map<string, CacheEntry>();

  constructor(
    private maxEntries: number,
    private ttlMs: number,
  ) {}

  get(key: string): GuardResult | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.result;
  }

  set(key: string, result: GuardResult): void {
    if (this.store.size >= this.maxEntries) {
      const oldest = this.store.keys().next().value;
      if (oldest !== undefined) this.store.delete(oldest);
    }
    this.store.set(key, { result, expiresAt: Date.now() + this.ttlMs });
  }

  clear(): void {
    this.store.clear();
  }

  get size(): number {
    return this.store.size;
  }
}

/**
 * Derive a deterministic cache key from guard name + relevant input.
 * Uses a simple FNV-1a-like hash to keep keys short.
 */
export function cacheKey(guardName: string, ...parts: string[]): string {
  const raw = `${guardName}:${parts.join("|")}`;
  let h = 0x811c9dc5;
  for (let i = 0; i < raw.length; i++) {
    h ^= raw.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}
