export class AegisError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AegisError";
  }
}

export class ApiError extends AegisError {
  readonly statusCode: number;
  readonly errorCode?: string;
  readonly requestId?: string;
  readonly body?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode: number,
    opts?: {
      errorCode?: string;
      requestId?: string;
      body?: Record<string, unknown>;
    },
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errorCode = opts?.errorCode;
    this.requestId = opts?.requestId;
    this.body = opts?.body;
  }
}

export class AuthenticationError extends ApiError {
  constructor(message = "Invalid or expired API key", opts?: { requestId?: string; body?: Record<string, unknown> }) {
    super(message, 401, opts);
    this.name = "AuthenticationError";
  }
}

export class TierAccessError extends ApiError {
  readonly requiredTier?: string;
  readonly upgradeUrl?: string;

  constructor(
    message: string,
    opts?: {
      requiredTier?: string;
      upgradeUrl?: string;
      requestId?: string;
      body?: Record<string, unknown>;
    },
  ) {
    super(message, 403, opts);
    this.name = "TierAccessError";
    this.requiredTier = opts?.requiredTier;
    this.upgradeUrl = opts?.upgradeUrl;
  }
}

export class QuotaExceededError extends ApiError {
  readonly limit?: number;
  readonly used?: number;
  readonly resetAt?: string;

  constructor(
    message = "Monthly quota exceeded",
    opts?: {
      limit?: number;
      used?: number;
      resetAt?: string;
      requestId?: string;
      body?: Record<string, unknown>;
    },
  ) {
    super(message, 429, opts);
    this.name = "QuotaExceededError";
    this.limit = opts?.limit;
    this.used = opts?.used;
    this.resetAt = opts?.resetAt;
  }
}

export class RateLimitError extends ApiError {
  readonly retryAfter?: number;

  constructor(
    message = "Rate limit exceeded",
    opts?: { retryAfter?: number; requestId?: string; body?: Record<string, unknown> },
  ) {
    super(message, 429, opts);
    this.name = "RateLimitError";
    this.retryAfter = opts?.retryAfter;
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, statusCode = 400, opts?: { requestId?: string; body?: Record<string, unknown> }) {
    super(message, statusCode, opts);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Resource not found", opts?: { requestId?: string; body?: Record<string, unknown> }) {
    super(message, 404, opts);
    this.name = "NotFoundError";
  }
}

export class ServerError extends ApiError {
  constructor(message = "Internal server error", statusCode = 500, opts?: { requestId?: string; body?: Record<string, unknown> }) {
    super(message, statusCode, opts);
    this.name = "ServerError";
  }
}

export class NetworkError extends AegisError {
  readonly cause?: Error;
  constructor(message = "Network error", cause?: Error) {
    super(message);
    this.name = "NetworkError";
    this.cause = cause;
  }
}
