"""Jailbreak resource — V2 jailbreak detection endpoints."""

from __future__ import annotations

from typing import Any, List, Optional

from aegis.models.jailbreak import (
    JailbreakDetectRequest,
    JailbreakDetectResponse,
    JailbreakType,
)
from aegis.resources._base import AsyncResource, SyncResource


class SyncJailbreak(SyncResource):

    def detect(self, content: str, **kwargs: Any) -> JailbreakDetectResponse:
        req = JailbreakDetectRequest(content=content, **kwargs)
        data = self._post("/v2/jailbreak/detect", json=req.model_dump(exclude_none=True))
        return JailbreakDetectResponse.model_validate(data)

    def detect_batch(
        self, requests: List[JailbreakDetectRequest]
    ) -> List[JailbreakDetectResponse]:
        data = self._post(
            "/v2/jailbreak/detect/batch",
            json={"requests": [r.model_dump(exclude_none=True) for r in requests]},
        )
        items = data if isinstance(data, list) else data.get("results", [])
        return [JailbreakDetectResponse.model_validate(item) for item in items]

    def types(self) -> List[JailbreakType]:
        data = self._get("/v2/jailbreak/types")
        items = data if isinstance(data, list) else data.get("types", [])
        return [JailbreakType.model_validate(t) for t in items]


class AsyncJailbreak(AsyncResource):

    async def detect(self, content: str, **kwargs: Any) -> JailbreakDetectResponse:
        req = JailbreakDetectRequest(content=content, **kwargs)
        data = await self._post("/v2/jailbreak/detect", json=req.model_dump(exclude_none=True))
        return JailbreakDetectResponse.model_validate(data)

    async def detect_batch(
        self, requests: List[JailbreakDetectRequest]
    ) -> List[JailbreakDetectResponse]:
        data = await self._post(
            "/v2/jailbreak/detect/batch",
            json={"requests": [r.model_dump(exclude_none=True) for r in requests]},
        )
        items = data if isinstance(data, list) else data.get("results", [])
        return [JailbreakDetectResponse.model_validate(item) for item in items]

    async def types(self) -> List[JailbreakType]:
        data = await self._get("/v2/jailbreak/types")
        items = data if isinstance(data, list) else data.get("types", [])
        return [JailbreakType.model_validate(t) for t in items]
