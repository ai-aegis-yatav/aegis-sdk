"""SABER resource — V3 Bayesian risk estimation endpoints."""

from __future__ import annotations

from typing import Any, Dict, List

from aegis.models.saber import (
    SaberBudget,
    SaberCompareRequest,
    SaberCompareResponse,
    SaberEstimateRequest,
    SaberEstimateResponse,
    SaberEvaluateRequest,
    SaberEvaluateResponse,
)
from aegis.resources._base import AsyncResource, SyncResource


class SyncSaber(SyncResource):

    def estimate(self, content: str, **kwargs: Any) -> SaberEstimateResponse:
        req = SaberEstimateRequest(content=content, **kwargs)
        data = self._post("/v3/saber/estimate", json=req.model_dump(exclude_none=True))
        return SaberEstimateResponse.model_validate(data)

    def evaluate(self, content: str, **kwargs: Any) -> SaberEvaluateResponse:
        req = SaberEvaluateRequest(content=content, **kwargs)
        data = self._post("/v3/saber/evaluate", json=req.model_dump(exclude_none=True))
        return SaberEvaluateResponse.model_validate(data)

    def budget(self) -> SaberBudget:
        return SaberBudget.model_validate(self._get("/v3/saber/budget"))

    def compare(self, content: str, defenses: List[str], **kwargs: Any) -> SaberCompareResponse:
        req = SaberCompareRequest(content=content, defenses=defenses, **kwargs)
        data = self._post("/v3/saber/compare", json=req.model_dump(exclude_none=True))
        return SaberCompareResponse.model_validate(data)

    def report(self, report_id: str) -> Dict[str, Any]:
        return self._get(f"/v3/saber/report/{report_id}")

    def update_deterministic(self, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v3/saber/deterministic/update", json=kwargs)


class AsyncSaber(AsyncResource):

    async def estimate(self, content: str, **kwargs: Any) -> SaberEstimateResponse:
        req = SaberEstimateRequest(content=content, **kwargs)
        data = await self._post("/v3/saber/estimate", json=req.model_dump(exclude_none=True))
        return SaberEstimateResponse.model_validate(data)

    async def evaluate(self, content: str, **kwargs: Any) -> SaberEvaluateResponse:
        req = SaberEvaluateRequest(content=content, **kwargs)
        data = await self._post("/v3/saber/evaluate", json=req.model_dump(exclude_none=True))
        return SaberEvaluateResponse.model_validate(data)

    async def budget(self) -> SaberBudget:
        return SaberBudget.model_validate(await self._get("/v3/saber/budget"))

    async def compare(
        self, content: str, defenses: List[str], **kwargs: Any
    ) -> SaberCompareResponse:
        req = SaberCompareRequest(content=content, defenses=defenses, **kwargs)
        data = await self._post("/v3/saber/compare", json=req.model_dump(exclude_none=True))
        return SaberCompareResponse.model_validate(data)

    async def report(self, report_id: str) -> Dict[str, Any]:
        return await self._get(f"/v3/saber/report/{report_id}")

    async def update_deterministic(self, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v3/saber/deterministic/update", json=kwargs)
