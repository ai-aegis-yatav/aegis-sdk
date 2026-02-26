"""Tests for transport layer: quota parsing and error mapping."""

import httpx
import pytest

from aegis._transport import QuotaInfo, _parse_quota, _raise_for_status
from aegis.errors import (
    AuthenticationError,
    NotFoundError,
    QuotaExceededError,
    RateLimitError,
    ServerError,
    TierAccessError,
    ValidationError,
)


class TestQuotaParsing:
    def test_parse_all_headers(self):
        headers = httpx.Headers({
            "x-quota-limit": "10000",
            "x-quota-used": "5000",
            "x-quota-remaining": "5000",
        })
        quota = _parse_quota(headers)
        assert quota.limit == 10000
        assert quota.used == 5000
        assert quota.remaining == 5000
        assert quota.is_available is True

    def test_parse_no_headers(self):
        headers = httpx.Headers({})
        quota = _parse_quota(headers)
        assert quota.limit is None
        assert quota.is_available is False

    def test_parse_invalid_values(self):
        headers = httpx.Headers({"x-quota-limit": "invalid"})
        quota = _parse_quota(headers)
        assert quota.limit is None


class TestErrorMapping:
    def _make_response(self, status_code: int, json_body: dict, headers: dict | None = None) -> httpx.Response:
        return httpx.Response(
            status_code=status_code,
            json=json_body,
            headers=headers or {},
            request=httpx.Request("GET", "http://test/"),
        )

    def test_401_raises_auth_error(self):
        resp = self._make_response(401, {"error": "Invalid API key"})
        with pytest.raises(AuthenticationError) as exc_info:
            _raise_for_status(resp, "req-1")
        assert exc_info.value.status_code == 401

    def test_403_raises_tier_error(self):
        resp = self._make_response(403, {
            "error": "Upgrade required",
            "required_tier": "pro",
            "upgrade_url": "https://aiaegis.io/upgrade",
        })
        with pytest.raises(TierAccessError) as exc_info:
            _raise_for_status(resp, None)
        assert exc_info.value.required_tier == "pro"

    def test_404_raises_not_found(self):
        resp = self._make_response(404, {"error": "Not found"})
        with pytest.raises(NotFoundError):
            _raise_for_status(resp, None)

    def test_429_quota_raises_quota_error(self):
        resp = self._make_response(429, {
            "error": "Quota exceeded",
            "code": "QUOTA_EXCEEDED",
            "limit": 1000,
            "used": 1001,
        })
        with pytest.raises(QuotaExceededError) as exc_info:
            _raise_for_status(resp, None)
        assert exc_info.value.limit == 1000

    def test_429_rate_raises_rate_limit_error(self):
        resp = self._make_response(
            429,
            {"error": "Too many requests"},
            headers={"retry-after": "60"},
        )
        with pytest.raises(RateLimitError) as exc_info:
            _raise_for_status(resp, None)
        assert exc_info.value.retry_after == 60.0

    def test_400_raises_validation_error(self):
        resp = self._make_response(400, {"error": "Invalid prompt"})
        with pytest.raises(ValidationError):
            _raise_for_status(resp, None)

    def test_422_raises_validation_error(self):
        resp = self._make_response(422, {"error": "Missing field"})
        with pytest.raises(ValidationError) as exc_info:
            _raise_for_status(resp, None)
        assert exc_info.value.status_code == 422

    def test_500_raises_server_error(self):
        resp = self._make_response(500, {"error": "Internal error"})
        with pytest.raises(ServerError):
            _raise_for_status(resp, None)

    def test_200_no_error(self):
        resp = self._make_response(200, {"ok": True})
        _raise_for_status(resp, None)  # should not raise
