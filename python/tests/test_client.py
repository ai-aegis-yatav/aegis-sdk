"""Tests for the AegisClient and AsyncAegisClient."""

import pytest

from aegis import AegisClient, AsyncAegisClient
from aegis.config import ClientConfig
from aegis.errors import AegisError


class TestClientConfig:
    def test_valid_config(self):
        config = ClientConfig(api_key="aegis_sk_test")
        assert config.api_key == "aegis_sk_test"
        assert config.base_url == "https://api.aiaegis.io"
        assert config.timeout == 30.0
        assert config.max_retries == 3

    def test_strips_trailing_slash(self):
        config = ClientConfig(api_key="aegis_sk_test", base_url="http://localhost:8000/")
        assert config.base_url == "http://localhost:8000"

    def test_empty_api_key_raises(self):
        with pytest.raises(ValueError, match="api_key is required"):
            ClientConfig(api_key="")

    def test_custom_headers(self):
        config = ClientConfig(api_key="test", custom_headers={"X-Custom": "val"})
        assert config.custom_headers == {"X-Custom": "val"}


class TestAegisClient:
    def test_constructor(self):
        client = AegisClient(api_key="aegis_sk_test", base_url="http://localhost:8000")
        assert client.judge is not None
        assert client.rules is not None
        assert client.escalations is not None
        assert client.analytics is not None
        assert client.evidence is not None
        assert client.ml is not None
        assert client.nlp is not None
        assert client.ai_act is not None
        assert client.classify is not None
        assert client.jailbreak is not None
        assert client.safety is not None
        assert client.defense is not None
        assert client.advanced is not None
        assert client.adversaflow is not None
        assert client.guardnet is not None
        assert client.agent is not None
        assert client.anomaly is not None
        assert client.multimodal is not None
        assert client.evolution is not None
        assert client.saber is not None
        assert client.ops is not None
        assert client.api_keys is not None
        client.close()

    def test_context_manager(self):
        with AegisClient(api_key="aegis_sk_test") as client:
            assert client.quota.limit is None

    def test_quota_initial(self):
        client = AegisClient(api_key="aegis_sk_test")
        assert client.quota.is_available is False
        client.close()


class TestAsyncAegisClient:
    @pytest.mark.asyncio
    async def test_constructor(self):
        async with AsyncAegisClient(api_key="aegis_sk_test") as client:
            assert client.judge is not None
            assert client.quota.limit is None
