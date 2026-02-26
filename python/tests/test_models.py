"""Tests for model serialization/deserialization."""

from aegis.models.judge import JudgeRequest, JudgeResponse, Risk, DefenseLayer
from aegis.models.rules import Rule, RuleCreateRequest
from aegis.models.escalations import Escalation
from aegis.models.safety import SafetyCheckRequest, SafetyCheckResponse
from aegis.models.jailbreak import JailbreakDetectResponse
from aegis.models.agent import AgentScanResponse
from aegis.models.api_keys import ApiKey, ApiKeyCreateResponse


class TestJudgeModels:
    def test_judge_request_minimal(self):
        req = JudgeRequest(prompt="test content")
        data = req.model_dump(exclude_none=True)
        assert data == {"prompt": "test content"}

    def test_judge_request_full(self):
        req = JudgeRequest(
            prompt="test",
            context={"key": "value"},
            metadata={"source": "sdk-test"},
        )
        data = req.model_dump(exclude_none=True)
        assert data["context"] == {"key": "value"}

    def test_judge_response_parse(self):
        raw = {
            "id": "j-123",
            "decision": "block",
            "confidence": 0.95,
            "risks": [{"label": "harmful", "severity": "high"}],
            "layers": [{"name": "keyword", "passed": False, "latency_ms": 1.2}],
            "latency_ms": 15.3,
        }
        resp = JudgeResponse.model_validate(raw)
        assert resp.id == "j-123"
        assert resp.decision == "block"
        assert resp.confidence == 0.95
        assert len(resp.risks) == 1
        assert resp.risks[0].label == "harmful"
        assert len(resp.layers) == 1
        assert resp.layers[0].passed is False

    def test_judge_response_defaults(self):
        raw = {"id": "j-1", "decision": "allow", "confidence": 0.99}
        resp = JudgeResponse.model_validate(raw)
        assert resp.risks == []
        assert resp.layers == []
        assert resp.latency_ms is None


class TestRuleModels:
    def test_rule_create_request(self):
        req = RuleCreateRequest(name="test", pattern=".*hack.*", action="block")
        data = req.model_dump(exclude_none=True)
        assert data["name"] == "test"
        assert data["pattern_type"] == "regex"
        assert data["severity"] == "medium"

    def test_rule_parse(self):
        raw = {
            "id": "r-1",
            "name": "test",
            "pattern": ".*",
            "pattern_type": "regex",
            "action": "block",
            "severity": "high",
            "category": "Security",
            "priority": 50,
            "enabled": True,
        }
        rule = Rule.model_validate(raw)
        assert rule.id == "r-1"
        assert rule.priority == 50


class TestSafetyModels:
    def test_safety_response(self):
        raw = {
            "is_safe": False,
            "overall_score": 0.85,
            "categories": [{"name": "violence", "score": 0.9}],
            "flagged_categories": ["violence"],
            "backend": "default",
        }
        resp = SafetyCheckResponse.model_validate(raw)
        assert resp.is_safe is False
        assert resp.flagged_categories == ["violence"]


class TestJailbreakModels:
    def test_jailbreak_response(self):
        raw = {
            "is_jailbreak": True,
            "confidence": 0.92,
            "jailbreak_type": "prompt_injection",
            "matched_patterns": ["ignore_previous"],
        }
        resp = JailbreakDetectResponse.model_validate(raw)
        assert resp.is_jailbreak is True
        assert resp.jailbreak_type == "prompt_injection"


class TestAgentModels:
    def test_agent_scan_response(self):
        raw = {
            "injection_detected": True,
            "injection_type": "dpi",
            "confidence": 0.88,
            "recommendations": ["sanitize input"],
        }
        resp = AgentScanResponse.model_validate(raw)
        assert resp.injection_detected is True


class TestApiKeyModels:
    def test_api_key(self):
        raw = {
            "id": "k-1",
            "name": "Test Key",
            "key_prefix": "aegis_sk_ab",
            "key_preview": "aegis_sk_ab...",
            "scopes": ["read", "write"],
            "permissions": ["read", "write"],
            "is_active": True,
        }
        key = ApiKey.model_validate(raw)
        assert key.is_active is True
        assert "read" in key.scopes
