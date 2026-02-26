"""Exception hierarchy for the AEGIS SDK."""

from __future__ import annotations

from typing import Any, Dict, Optional


class AegisError(Exception):
    """Base exception for all AEGIS SDK errors."""

    def __init__(self, message: str, **kwargs: Any) -> None:
        self.message = message
        super().__init__(message)


class ApiError(AegisError):
    """HTTP API error with status code and response body."""

    def __init__(
        self,
        message: str,
        status_code: int,
        error_code: Optional[str] = None,
        request_id: Optional[str] = None,
        body: Optional[Dict[str, Any]] = None,
    ) -> None:
        self.status_code = status_code
        self.error_code = error_code
        self.request_id = request_id
        self.body = body or {}
        super().__init__(message)

    def __str__(self) -> str:
        parts = [f"[{self.status_code}]"]
        if self.error_code:
            parts.append(f"({self.error_code})")
        parts.append(self.message)
        if self.request_id:
            parts.append(f"[request_id={self.request_id}]")
        return " ".join(parts)


class AuthenticationError(ApiError):
    """Raised when the API key is invalid or expired (HTTP 401)."""

    def __init__(self, message: str = "Invalid or expired API key", **kwargs: Any) -> None:
        super().__init__(message, status_code=401, **kwargs)


class TierAccessError(ApiError):
    """Raised when the user's tier is insufficient for the requested endpoint (HTTP 403)."""

    def __init__(
        self,
        message: str,
        required_tier: Optional[str] = None,
        upgrade_url: Optional[str] = None,
        **kwargs: Any,
    ) -> None:
        self.required_tier = required_tier
        self.upgrade_url = upgrade_url
        super().__init__(message, status_code=403, **kwargs)


class QuotaExceededError(ApiError):
    """Raised when the monthly API quota has been exceeded (HTTP 429 quota)."""

    def __init__(
        self,
        message: str = "Monthly quota exceeded",
        limit: Optional[int] = None,
        used: Optional[int] = None,
        reset_at: Optional[str] = None,
        **kwargs: Any,
    ) -> None:
        self.limit = limit
        self.used = used
        self.reset_at = reset_at
        super().__init__(message, status_code=429, **kwargs)


class RateLimitError(ApiError):
    """Raised when the rate limit has been exceeded (HTTP 429 rate)."""

    def __init__(
        self,
        message: str = "Rate limit exceeded",
        retry_after: Optional[float] = None,
        **kwargs: Any,
    ) -> None:
        self.retry_after = retry_after
        super().__init__(message, status_code=429, **kwargs)


class ValidationError(ApiError):
    """Raised for invalid request parameters (HTTP 400/422)."""

    def __init__(self, message: str, **kwargs: Any) -> None:
        status = kwargs.pop("status_code", 400)
        super().__init__(message, status_code=status, **kwargs)


class NotFoundError(ApiError):
    """Raised when the requested resource is not found (HTTP 404)."""

    def __init__(self, message: str = "Resource not found", **kwargs: Any) -> None:
        super().__init__(message, status_code=404, **kwargs)


class ServerError(ApiError):
    """Raised on server-side errors (HTTP 5xx)."""

    def __init__(self, message: str = "Internal server error", **kwargs: Any) -> None:
        status = kwargs.pop("status_code", 500)
        super().__init__(message, status_code=status, **kwargs)


class NetworkError(AegisError):
    """Raised on network connectivity or timeout errors."""

    def __init__(self, message: str = "Network error", cause: Optional[Exception] = None) -> None:
        self.cause = cause
        super().__init__(message)
