"""AI Act resource — V1 AI Act compliance endpoints."""

from __future__ import annotations

from typing import Any, Dict, List

from aegis.models.ai_act import (
    ComplianceVerifyRequest,
    ComplianceVerifyResponse,
    GuardrailCheckRequest,
    GuardrailCheckResponse,
    PiiDetectRequest,
    PiiDetectResponse,
    RiskAssessRequest,
    RiskAssessResponse,
    WatermarkRequest,
    WatermarkResponse,
)
from aegis.resources._base import AsyncResource, SyncResource


class SyncAiAct(SyncResource):

    def watermark(self, content: str, **kwargs: Any) -> WatermarkResponse:
        req = WatermarkRequest(content=content, **kwargs)
        data = self._post("/v1/ai-act/watermark", json=req.model_dump(exclude_none=True))
        return WatermarkResponse.model_validate(data)

    def high_impact_watermark(self, content: str, **kwargs: Any) -> WatermarkResponse:
        req = WatermarkRequest(content=content, **kwargs)
        data = self._post(
            "/v1/ai-act/high-impact/watermark", json=req.model_dump(exclude_none=True)
        )
        return WatermarkResponse.model_validate(data)

    def deepfake_label(self, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v1/ai-act/deepfake/label", json=kwargs)

    def verify(self, content: str, **kwargs: Any) -> ComplianceVerifyResponse:
        req = ComplianceVerifyRequest(content=content, **kwargs)
        data = self._post("/v1/ai-act/verify", json=req.model_dump(exclude_none=True))
        return ComplianceVerifyResponse.model_validate(data)

    def report_violation(self, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v1/ai-act/report-violation", json=kwargs)

    def guidelines(self) -> Dict[str, Any]:
        return self._get("/v1/ai-act/guidelines")

    def guardrail_check(self, content: str, **kwargs: Any) -> GuardrailCheckResponse:
        req = GuardrailCheckRequest(content=content, **kwargs)
        data = self._post("/v1/ai-act/guardrail/check", json=req.model_dump(exclude_none=True))
        return GuardrailCheckResponse.model_validate(data)

    def pii_detect(self, content: str, **kwargs: Any) -> PiiDetectResponse:
        req = PiiDetectRequest(content=content, **kwargs)
        data = self._post("/v1/ai-act/pii/detect", json=req.model_dump(exclude_none=True))
        return PiiDetectResponse.model_validate(data)

    def risk_assess(self, system_description: str, **kwargs: Any) -> RiskAssessResponse:
        req = RiskAssessRequest(system_description=system_description, **kwargs)
        data = self._post("/v1/ai-act/risk/assess", json=req.model_dump(exclude_none=True))
        return RiskAssessResponse.model_validate(data)

    def audit_logs(self, **params: Any) -> Dict[str, Any]:
        return self._get("/v1/ai-act/audit/logs", params=params)


class AsyncAiAct(AsyncResource):

    async def watermark(self, content: str, **kwargs: Any) -> WatermarkResponse:
        req = WatermarkRequest(content=content, **kwargs)
        data = await self._post(
            "/v1/ai-act/watermark", json=req.model_dump(exclude_none=True)
        )
        return WatermarkResponse.model_validate(data)

    async def high_impact_watermark(self, content: str, **kwargs: Any) -> WatermarkResponse:
        req = WatermarkRequest(content=content, **kwargs)
        data = await self._post(
            "/v1/ai-act/high-impact/watermark", json=req.model_dump(exclude_none=True)
        )
        return WatermarkResponse.model_validate(data)

    async def deepfake_label(self, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v1/ai-act/deepfake/label", json=kwargs)

    async def verify(self, content: str, **kwargs: Any) -> ComplianceVerifyResponse:
        req = ComplianceVerifyRequest(content=content, **kwargs)
        data = await self._post(
            "/v1/ai-act/verify", json=req.model_dump(exclude_none=True)
        )
        return ComplianceVerifyResponse.model_validate(data)

    async def report_violation(self, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v1/ai-act/report-violation", json=kwargs)

    async def guidelines(self) -> Dict[str, Any]:
        return await self._get("/v1/ai-act/guidelines")

    async def guardrail_check(self, content: str, **kwargs: Any) -> GuardrailCheckResponse:
        req = GuardrailCheckRequest(content=content, **kwargs)
        data = await self._post(
            "/v1/ai-act/guardrail/check", json=req.model_dump(exclude_none=True)
        )
        return GuardrailCheckResponse.model_validate(data)

    async def pii_detect(self, content: str, **kwargs: Any) -> PiiDetectResponse:
        req = PiiDetectRequest(content=content, **kwargs)
        data = await self._post(
            "/v1/ai-act/pii/detect", json=req.model_dump(exclude_none=True)
        )
        return PiiDetectResponse.model_validate(data)

    async def risk_assess(self, system_description: str, **kwargs: Any) -> RiskAssessResponse:
        req = RiskAssessRequest(system_description=system_description, **kwargs)
        data = await self._post(
            "/v1/ai-act/risk/assess", json=req.model_dump(exclude_none=True)
        )
        return RiskAssessResponse.model_validate(data)

    async def audit_logs(self, **params: Any) -> Dict[str, Any]:
        return await self._get("/v1/ai-act/audit/logs", params=params)
