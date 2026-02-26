"""Multimodal resource — V3 multimodal security endpoints."""

from __future__ import annotations

from typing import Any, Dict

from aegis.models.multimodal import MultimodalScanRequest, MultimodalScanResponse
from aegis.resources._base import AsyncResource, SyncResource


class SyncMultimodal(SyncResource):

    def scan(self, content: str, **kwargs: Any) -> MultimodalScanResponse:
        req = MultimodalScanRequest(content=content, **kwargs)
        data = self._post("/v3/multimodal/scan", json=req.model_dump(exclude_none=True))
        return MultimodalScanResponse.model_validate(data)

    def image_attack(self, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v3/multimodal/image-attack", json=kwargs)

    def viscra(self, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v3/multimodal/viscra", json=kwargs)

    def mml(self, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v3/multimodal/mml", json=kwargs)


class AsyncMultimodal(AsyncResource):

    async def scan(self, content: str, **kwargs: Any) -> MultimodalScanResponse:
        req = MultimodalScanRequest(content=content, **kwargs)
        data = await self._post("/v3/multimodal/scan", json=req.model_dump(exclude_none=True))
        return MultimodalScanResponse.model_validate(data)

    async def image_attack(self, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v3/multimodal/image-attack", json=kwargs)

    async def viscra(self, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v3/multimodal/viscra", json=kwargs)

    async def mml(self, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v3/multimodal/mml", json=kwargs)
