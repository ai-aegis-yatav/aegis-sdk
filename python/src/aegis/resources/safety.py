"""Safety resource — V2 content safety check endpoints."""

from __future__ import annotations

from typing import Any, Dict, List

from aegis.models.safety import SafetyCategory, SafetyCheckRequest, SafetyCheckResponse
from aegis.resources._base import AsyncResource, SyncResource


class SyncSafety(SyncResource):

    def check(self, content: str, **kwargs: Any) -> SafetyCheckResponse:
        req = SafetyCheckRequest(content=content, **kwargs)
        data = self._post("/v2/safety/check", json=req.model_dump(exclude_none=True))
        return SafetyCheckResponse.model_validate(data)

    def check_batch(self, requests: List[SafetyCheckRequest]) -> List[SafetyCheckResponse]:
        data = self._post(
            "/v2/safety/check/batch",
            json={"requests": [r.model_dump(exclude_none=True) for r in requests]},
        )
        items = data if isinstance(data, list) else data.get("results", [])
        return [SafetyCheckResponse.model_validate(item) for item in items]

    def categories(self) -> List[SafetyCategory]:
        data = self._get("/v2/safety/categories")
        items = data if isinstance(data, list) else data.get("categories", [])
        return [SafetyCategory.model_validate(c) for c in items]

    def backends(self) -> List[Dict[str, Any]]:
        return self._get("/v2/safety/backends")


class AsyncSafety(AsyncResource):

    async def check(self, content: str, **kwargs: Any) -> SafetyCheckResponse:
        req = SafetyCheckRequest(content=content, **kwargs)
        data = await self._post("/v2/safety/check", json=req.model_dump(exclude_none=True))
        return SafetyCheckResponse.model_validate(data)

    async def check_batch(
        self, requests: List[SafetyCheckRequest]
    ) -> List[SafetyCheckResponse]:
        data = await self._post(
            "/v2/safety/check/batch",
            json={"requests": [r.model_dump(exclude_none=True) for r in requests]},
        )
        items = data if isinstance(data, list) else data.get("results", [])
        return [SafetyCheckResponse.model_validate(item) for item in items]

    async def categories(self) -> List[SafetyCategory]:
        data = await self._get("/v2/safety/categories")
        items = data if isinstance(data, list) else data.get("categories", [])
        return [SafetyCategory.model_validate(c) for c in items]

    async def backends(self) -> List[Dict[str, Any]]:
        return await self._get("/v2/safety/backends")
