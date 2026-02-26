import {
  AuthenticationError,
  NetworkError,
  NotFoundError,
  QuotaExceededError,
  RateLimitError,
  ServerError,
  TierAccessError,
  ValidationError,
} from "./errors";
import type { QuotaInfo } from "./models/common";

export interface RequestOptions {
  method: string;
  path: string;
  body?: unknown;
  params?: Record<string, string | number | undefined>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export interface TransportConfig {
  apiKey: string;
  baseUrl: string;
  timeout: number;
  maxRetries: number;
  customHeaders: Record<string, string>;
}

export class Transport {
  private config: TransportConfig;
  quota: QuotaInfo = {};

  constructor(config: TransportConfig) {
    this.config = config;
  }

  async request<T>(opts: RequestOptions): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        const url = this.buildUrl(opts.path, opts.params);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const headers: Record<string, string> = {
          "X-API-Key": this.config.apiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "aegis-js-sdk/0.1.0",
          ...this.config.customHeaders,
          ...opts.headers,
        };

        const response = await fetch(url, {
          method: opts.method,
          headers,
          body: opts.body ? JSON.stringify(opts.body) : undefined,
          signal: opts.signal ?? controller.signal,
        });
        clearTimeout(timeoutId);

        const requestId = response.headers.get("x-request-id") ?? undefined;
        this.updateQuota(response.headers);

        if (response.status === 429 && attempt < this.config.maxRetries) {
          const retryAfter = response.headers.get("retry-after");
          const wait = retryAfter ? parseFloat(retryAfter) * 1000 : this.backoff(attempt);
          await sleep(wait);
          continue;
        }

        if (response.status >= 500 && attempt < this.config.maxRetries) {
          await sleep(this.backoff(attempt));
          continue;
        }

        if (!response.ok) {
          const body = await response.json().catch(() => ({ error: response.statusText }));
          this.throwForStatus(response.status, body, requestId);
        }

        if (response.status === 204) return undefined as T;
        return (await response.json()) as T;
      } catch (err) {
        if (err instanceof AuthenticationError || err instanceof TierAccessError ||
            err instanceof ValidationError || err instanceof NotFoundError ||
            err instanceof QuotaExceededError) {
          throw err;
        }
        lastError = err as Error;
        if (attempt < this.config.maxRetries) {
          await sleep(this.backoff(attempt));
          continue;
        }
      }
    }
    throw new NetworkError("Max retries exceeded", lastError);
  }

  async *stream(opts: RequestOptions): AsyncGenerator<string> {
    const url = this.buildUrl(opts.path, opts.params);
    const headers: Record<string, string> = {
      "X-API-Key": this.config.apiKey,
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      "User-Agent": "aegis-js-sdk/0.1.0",
      ...this.config.customHeaders,
    };

    const response = await fetch(url, {
      method: opts.method,
      headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({ error: response.statusText }));
      const requestId = response.headers.get("x-request-id") ?? undefined;
      this.throwForStatus(response.status, body, requestId);
    }

    if (!response.body) return;
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data:")) {
            const data = line.slice(5).trim();
            if (data === "[DONE]") return;
            yield data;
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  private buildUrl(path: string, params?: Record<string, string | number | undefined>): string {
    const url = new URL(path, this.config.baseUrl);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) url.searchParams.set(key, String(value));
      }
    }
    return url.toString();
  }

  private updateQuota(headers: Headers): void {
    const limit = headers.get("x-quota-limit");
    const used = headers.get("x-quota-used");
    const remaining = headers.get("x-quota-remaining");
    if (limit) this.quota.limit = parseInt(limit, 10);
    if (used) this.quota.used = parseInt(used, 10);
    if (remaining) this.quota.remaining = parseInt(remaining, 10);
  }

  private throwForStatus(
    status: number,
    body: Record<string, unknown>,
    requestId?: string,
  ): never {
    const message = (body.error ?? body.message ?? `HTTP ${status}`) as string;
    const opts = { requestId, body };

    if (status === 401) throw new AuthenticationError(message, opts);
    if (status === 403) throw new TierAccessError(message, { ...opts, requiredTier: body.required_tier as string, upgradeUrl: body.upgrade_url as string });
    if (status === 404) throw new NotFoundError(message, opts);
    if (status === 429) {
      if (body.code === "QUOTA_EXCEEDED" || (message.toLowerCase().includes("quota"))) {
        throw new QuotaExceededError(message, { ...opts, limit: body.limit as number, used: body.used as number, resetAt: body.reset_at as string });
      }
      throw new RateLimitError(message, opts);
    }
    if (status === 400 || status === 422) throw new ValidationError(message, status, opts);
    if (status >= 500) throw new ServerError(message, status, opts);
    throw new ServerError(message, status, opts);
  }

  private backoff(attempt: number): number {
    return 500 * Math.pow(2, attempt);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
