"""Tests for error types."""

from aegis.errors import (
    AegisError,
    ApiError,
    AuthenticationError,
    NetworkError,
    NotFoundError,
    QuotaExceededError,
    RateLimitError,
    ServerError,
    TierAccessError,
    ValidationError,
)


class TestErrorHierarchy:
    def test_base_error(self):
        err = AegisError("test")
        assert str(err) == "test"
        assert err.message == "test"

    def test_api_error(self):
        err = ApiError("bad request", status_code=400, error_code="INVALID", request_id="req-1")
        assert err.status_code == 400
        assert err.error_code == "INVALID"
        assert err.request_id == "req-1"
        assert "[400]" in str(err)
        assert "(INVALID)" in str(err)
        assert "req-1" in str(err)

    def test_authentication_error(self):
        err = AuthenticationError()
        assert err.status_code == 401
        assert isinstance(err, ApiError)
        assert isinstance(err, AegisError)

    def test_tier_access_error(self):
        err = TierAccessError(
            "Upgrade required",
            required_tier="pro",
            upgrade_url="https://aiaegis.io/upgrade",
        )
        assert err.status_code == 403
        assert err.required_tier == "pro"
        assert err.upgrade_url == "https://aiaegis.io/upgrade"

    def test_quota_exceeded_error(self):
        err = QuotaExceededError(limit=1000, used=1001, reset_at="2026-03-01T00:00:00Z")
        assert err.status_code == 429
        assert err.limit == 1000
        assert err.used == 1001
        assert err.reset_at == "2026-03-01T00:00:00Z"

    def test_rate_limit_error(self):
        err = RateLimitError(retry_after=60.0)
        assert err.status_code == 429
        assert err.retry_after == 60.0

    def test_validation_error(self):
        err = ValidationError("Invalid prompt", status_code=422)
        assert err.status_code == 422

    def test_not_found_error(self):
        err = NotFoundError()
        assert err.status_code == 404

    def test_server_error(self):
        err = ServerError(status_code=503)
        assert err.status_code == 503

    def test_network_error(self):
        cause = ConnectionError("refused")
        err = NetworkError("Connection failed", cause=cause)
        assert err.cause is cause
        assert isinstance(err, AegisError)
