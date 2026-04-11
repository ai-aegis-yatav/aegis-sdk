"""AI Act resource — V1 AI Act compliance endpoints.

The watermark / verify endpoints expect rich structured payloads (binary
content as ``u8[]``, ``ai_model``, ``service_provider``, ``risk_level``,
``watermark_config`` …). The smoke-test friendly methods below build minimal
defaults; pass extra fields via kwargs to override.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from aegis.resources._base import AsyncResource, SyncResource


def _bytes_of(content: str) -> List[int]:
    """Server expects ``content: u8[]`` for watermark/verify."""
    return list(content.encode("utf-8"))


def _ai_model_default() -> Dict[str, Any]:
    from datetime import datetime, timezone
    return {
        "model_id": "aegis-smoke-model",
        "model_name": "smoke-test",
        "model_version": "1.0",
        "provider": "aegis",
        "generation_timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    }


def _service_provider_default() -> Dict[str, Any]:
    return {
        "provider_id": "aegis-smoke",
        "organization_name": "AEGIS Smoke Test",
        "business_registration_number": "000-00-00000",
        "contact_email": "smoke@aegis.test",
    }


def _watermark_body(content: str, **overrides: Any) -> Dict[str, Any]:
    body: Dict[str, Any] = {
        "content_type": "text",
        "content": _bytes_of(content),
        "ai_model": _ai_model_default(),
        "service_provider": _service_provider_default(),
        "risk_level": "limited",
        "watermark_config": {
            "visible_watermark": False,
            "invisible_watermark": True,
            "strength": 0.5,
            "multi_layer": False,
        },
    }
    body.update(overrides)
    return body


def _high_impact_body(content: str, **overrides: Any) -> Dict[str, Any]:
    body: Dict[str, Any] = {
        "domain": "medical",
        "content_type": "text",
        "content": _bytes_of(content),
        "ai_model": _ai_model_default(),
        "risk_assessment": {
            "impact_score": 0.6,
            "potential_harm": ["misinformation"],
            "mitigation_measures": ["human_review"],
            "human_oversight_required": True,
        },
        "watermark_config": {
            "enforce_multi_layer": True,
            "minimum_strength": 0.7,
            "preserve_low_entropy": True,
            "semantic_preservation": True,
        },
    }
    body.update(overrides)
    return body


def _verify_body(content: str, **overrides: Any) -> Dict[str, Any]:
    body: Dict[str, Any] = {
        "content_type": "text",
        "content": _bytes_of(content),
        "check_tampering": True,
        "include_provenance": False,
    }
    body.update(overrides)
    return body


def _guardrail_body(content: str, **overrides: Any) -> Dict[str, Any]:
    body: Dict[str, Any] = {
        "content": content,
        "content_type": "text",
        "check_prompt_injection": True,
        "check_pii": True,
        "check_toxicity": True,
        "mask_pii": False,
        "use_llm": False,
    }
    body.update(overrides)
    return body


def _pii_body(content: str, **overrides: Any) -> Dict[str, Any]:
    body: Dict[str, Any] = {
        "content": content,
        "mask": False,
        "entity_types": [],
    }
    body.update(overrides)
    return body


def _risk_assess_body(system_description: str, **overrides: Any) -> Dict[str, Any]:
    body: Dict[str, Any] = {
        "system_name": overrides.pop("system_name", "smoke-test-system"),
        "model_type": overrides.pop("model_type", "text-generation"),
        "application_domains": overrides.pop("application_domains", ["education"]),
        "compute_flops": overrides.pop("compute_flops", None),
        "handles_personal_data": overrides.pop("handles_personal_data", False),
    }
    # Keep system_description for forward-compat callers.
    body["system_description"] = system_description
    body.update(overrides)
    return body


class SyncAiAct(SyncResource):

    def watermark(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v1/ai-act/watermark", json=_watermark_body(content, **kwargs))

    def high_impact_watermark(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post(
            "/v1/ai-act/high-impact/watermark", json=_high_impact_body(content, **kwargs)
        )

    def deepfake_label(self, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v1/ai-act/deepfake/label", json=kwargs)

    def verify(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v1/ai-act/verify", json=_verify_body(content, **kwargs))

    def report_violation(self, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v1/ai-act/report-violation", json=kwargs)

    def guidelines(self) -> Dict[str, Any]:
        return self._get("/v1/ai-act/guidelines")

    def guardrail_check(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post(
            "/v1/ai-act/guardrail/check", json=_guardrail_body(content, **kwargs)
        )

    def pii_detect(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v1/ai-act/pii/detect", json=_pii_body(content, **kwargs))

    def risk_assess(self, system_description: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post(
            "/v1/ai-act/risk/assess", json=_risk_assess_body(system_description, **kwargs)
        )

    def audit_logs(self, **params: Any) -> Dict[str, Any]:
        return self._get("/v1/ai-act/audit/logs", params=params)


class AsyncAiAct(AsyncResource):

    async def watermark(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post(
            "/v1/ai-act/watermark", json=_watermark_body(content, **kwargs)
        )

    async def high_impact_watermark(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post(
            "/v1/ai-act/high-impact/watermark", json=_high_impact_body(content, **kwargs)
        )

    async def deepfake_label(self, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v1/ai-act/deepfake/label", json=kwargs)

    async def verify(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v1/ai-act/verify", json=_verify_body(content, **kwargs))

    async def report_violation(self, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v1/ai-act/report-violation", json=kwargs)

    async def guidelines(self) -> Dict[str, Any]:
        return await self._get("/v1/ai-act/guidelines")

    async def guardrail_check(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post(
            "/v1/ai-act/guardrail/check", json=_guardrail_body(content, **kwargs)
        )

    async def pii_detect(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post(
            "/v1/ai-act/pii/detect", json=_pii_body(content, **kwargs)
        )

    async def risk_assess(self, system_description: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post(
            "/v1/ai-act/risk/assess", json=_risk_assess_body(system_description, **kwargs)
        )

    async def audit_logs(self, **params: Any) -> Dict[str, Any]:
        return await self._get("/v1/ai-act/audit/logs", params=params)
