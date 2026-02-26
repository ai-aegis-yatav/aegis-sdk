"""HTTP transport layer with retry, error handling, and quota tracking."""

from __future__ import annotations

import time
from dataclasses import dataclass, field
from typing import Any, Dict, Optional

import httpx

from aegis.config import ClientConfig
from aegis.errors import (
    AuthenticationError,
    NetworkError,
    NotFoundError,
    QuotaExceededError,
    RateLimitError,
    ServerError,
    TierAccessError,
    ValidationError,
)


@dataclass
class QuotaInfo:
    """Tracks API quota usage from response headers."""

    limit: Optional[int] = None
    used: Optional[int] = None
    remaining: Optional[int] = None

    @property
    def is_available(self) -> bool:
        return self.limit is not None


@dataclass
class ApiResponse:
    """Wraps an HTTP response with parsed metadata."""

    status_code: int
    data: Any
    headers: Dict[str, str] = field(default_factory=dict)
    request_id: Optional[str] = None
    quota: Optional[QuotaInfo] = None


def _parse_quota(headers: httpx.Headers) -> QuotaInfo:
    info = QuotaInfo()
    if "x-quota-limit" in headers:
        try:
            info.limit = int(headers["x-quota-limit"])
        except ValueError:
            pass
    if "x-quota-used" in headers:
        try:
            info.used = int(headers["x-quota-used"])
        except ValueError:
            pass
    if "x-quota-remaining" in headers:
        try:
            info.remaining = int(headers["x-quota-remaining"])
        except ValueError:
            pass
    return info


def _raise_for_status(response: httpx.Response, request_id: Optional[str]) -> None:
    if response.status_code < 400:
        return

    try:
        body = response.json()
    except Exception:
        body = {"error": response.text}

    message = body.get("error", body.get("message", f"HTTP {response.status_code}"))
    error_code = body.get("code")
    kwargs: Dict[str, Any] = {
        "error_code": error_code,
        "request_id": request_id,
        "body": body,
    }

    status = response.status_code

    if status == 401:
        raise AuthenticationError(message, **kwargs)

    if status == 403:
        raise TierAccessError(
            message,
            required_tier=body.get("required_tier"),
            upgrade_url=body.get("upgrade_url"),
            **kwargs,
        )

    if status == 404:
        raise NotFoundError(message, **kwargs)

    if status == 429:
        retry_after = response.headers.get("retry-after")
        if body.get("code") == "QUOTA_EXCEEDED" or "quota" in message.lower():
            raise QuotaExceededError(
                message,
                limit=body.get("limit"),
                used=body.get("used"),
                reset_at=body.get("reset_at"),
                **kwargs,
            )
        raise RateLimitError(
            message,
            retry_after=float(retry_after) if retry_after else None,
            **kwargs,
        )

    if status in (400, 422):
        raise ValidationError(message, status_code=status, **kwargs)

    if status >= 500:
        raise ServerError(message, status_code=status, **kwargs)


class SyncTransport:
    """Synchronous HTTP transport with retry and exponential backoff."""

    def __init__(self, config: ClientConfig) -> None:
        self._config = config
        self.quota = QuotaInfo()
        self._client = httpx.Client(
            base_url=config.base_url,
            timeout=config.timeout,
            verify=config.verify_ssl,
            headers=self._build_headers(),
        )

    def _build_headers(self) -> Dict[str, str]:
        headers: Dict[str, str] = {
            "X-API-Key": self._config.api_key,
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "aegis-python-sdk/0.1.0",
        }
        headers.update(self._config.custom_headers)
        return headers

    def request(
        self,
        method: str,
        path: str,
        *,
        json: Optional[Any] = None,
        params: Optional[Dict[str, Any]] = None,
        headers: Optional[Dict[str, str]] = None,
    ) -> ApiResponse:
        last_exc: Optional[Exception] = None

        for attempt in range(self._config.max_retries + 1):
            try:
                response = self._client.request(
                    method,
                    path,
                    json=json,
                    params=params,
                    headers=headers,
                )
                request_id = response.headers.get("x-request-id")
                self.quota = _parse_quota(response.headers)

                if response.status_code == 429 and attempt < self._config.max_retries:
                    retry_after = response.headers.get("retry-after")
                    wait = float(retry_after) if retry_after else self._backoff(attempt)
                    time.sleep(wait)
                    continue

                if response.status_code >= 500 and attempt < self._config.max_retries:
                    time.sleep(self._backoff(attempt))
                    continue

                _raise_for_status(response, request_id)

                data = response.json() if response.content else None
                return ApiResponse(
                    status_code=response.status_code,
                    data=data,
                    headers=dict(response.headers),
                    request_id=request_id,
                    quota=self.quota,
                )

            except (httpx.ConnectError, httpx.TimeoutException) as exc:
                last_exc = exc
                if attempt < self._config.max_retries:
                    time.sleep(self._backoff(attempt))
                    continue
                raise NetworkError(str(exc), cause=exc) from exc

        raise NetworkError("Max retries exceeded", cause=last_exc)

    def stream(
        self,
        method: str,
        path: str,
        *,
        json: Optional[Any] = None,
        params: Optional[Dict[str, Any]] = None,
    ) -> httpx.Response:
        headers = {"Accept": "text/event-stream"}
        return self._client.stream(
            method,
            path,
            json=json,
            params=params,
            headers=headers,
        )

    def _backoff(self, attempt: int) -> float:
        return self._config.retry_backoff_factor * (2**attempt)

    def close(self) -> None:
        self._client.close()


class AsyncTransport:
    """Asynchronous HTTP transport with retry and exponential backoff."""

    def __init__(self, config: ClientConfig) -> None:
        self._config = config
        self.quota = QuotaInfo()
        self._client = httpx.AsyncClient(
            base_url=config.base_url,
            timeout=config.timeout,
            verify=config.verify_ssl,
            headers=self._build_headers(),
        )

    def _build_headers(self) -> Dict[str, str]:
        headers: Dict[str, str] = {
            "X-API-Key": self._config.api_key,
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "aegis-python-sdk/0.1.0",
        }
        headers.update(self._config.custom_headers)
        return headers

    async def request(
        self,
        method: str,
        path: str,
        *,
        json: Optional[Any] = None,
        params: Optional[Dict[str, Any]] = None,
        headers: Optional[Dict[str, str]] = None,
    ) -> ApiResponse:
        import asyncio

        last_exc: Optional[Exception] = None

        for attempt in range(self._config.max_retries + 1):
            try:
                response = await self._client.request(
                    method,
                    path,
                    json=json,
                    params=params,
                    headers=headers,
                )
                request_id = response.headers.get("x-request-id")
                self.quota = _parse_quota(response.headers)

                if response.status_code == 429 and attempt < self._config.max_retries:
                    retry_after = response.headers.get("retry-after")
                    wait = float(retry_after) if retry_after else self._backoff(attempt)
                    await asyncio.sleep(wait)
                    continue

                if response.status_code >= 500 and attempt < self._config.max_retries:
                    await asyncio.sleep(self._backoff(attempt))
                    continue

                _raise_for_status(response, request_id)

                data = response.json() if response.content else None
                return ApiResponse(
                    status_code=response.status_code,
                    data=data,
                    headers=dict(response.headers),
                    request_id=request_id,
                    quota=self.quota,
                )

            except (httpx.ConnectError, httpx.TimeoutException) as exc:
                last_exc = exc
                if attempt < self._config.max_retries:
                    await asyncio.sleep(self._backoff(attempt))
                    continue
                raise NetworkError(str(exc), cause=exc) from exc

        raise NetworkError("Max retries exceeded", cause=last_exc)

    async def stream(
        self,
        method: str,
        path: str,
        *,
        json: Optional[Any] = None,
        params: Optional[Dict[str, Any]] = None,
    ) -> Any:
        headers = {"Accept": "text/event-stream"}
        return self._client.stream(
            method,
            path,
            json=json,
            params=params,
            headers=headers,
        )

    def _backoff(self, attempt: int) -> float:
        return self._config.retry_backoff_factor * (2**attempt)

    async def close(self) -> None:
        await self._client.aclose()
