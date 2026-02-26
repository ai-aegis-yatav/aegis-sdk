"""Advanced resource — V2 advanced attack detection endpoints."""

from __future__ import annotations

from typing import Any, Dict

from aegis.models.advanced import AdvancedDetectRequest, AdvancedDetectResponse
from aegis.resources._base import AsyncResource, SyncResource


class SyncAdvanced(SyncResource):

    def detect(self, content: str, **kwargs: Any) -> AdvancedDetectResponse:
        req = AdvancedDetectRequest(content=content, **kwargs)
        data = self._post("/v2/advanced/detect", json=req.model_dump(exclude_none=True))
        return AdvancedDetectResponse.model_validate(data)

    def hybrid_web(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v2/advanced/hybrid-web", json={"content": content, **kwargs})

    def vsh(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v2/advanced/vsh", json={"content": content, **kwargs})

    def few_shot(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v2/advanced/few-shot", json={"content": content, **kwargs})

    def cot(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v2/advanced/cot", json={"content": content, **kwargs})

    def acoustic(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v2/advanced/acoustic", json={"content": content, **kwargs})

    def context_confusion(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v2/advanced/context-confusion", json={"content": content, **kwargs})

    def info_extraction(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v2/advanced/info-extraction", json={"content": content, **kwargs})


class AsyncAdvanced(AsyncResource):

    async def detect(self, content: str, **kwargs: Any) -> AdvancedDetectResponse:
        req = AdvancedDetectRequest(content=content, **kwargs)
        data = await self._post("/v2/advanced/detect", json=req.model_dump(exclude_none=True))
        return AdvancedDetectResponse.model_validate(data)

    async def hybrid_web(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v2/advanced/hybrid-web", json={"content": content, **kwargs})

    async def vsh(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v2/advanced/vsh", json={"content": content, **kwargs})

    async def few_shot(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v2/advanced/few-shot", json={"content": content, **kwargs})

    async def cot(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v2/advanced/cot", json={"content": content, **kwargs})

    async def acoustic(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v2/advanced/acoustic", json={"content": content, **kwargs})

    async def context_confusion(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post(
            "/v2/advanced/context-confusion", json={"content": content, **kwargs}
        )

    async def info_extraction(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post(
            "/v2/advanced/info-extraction", json={"content": content, **kwargs}
        )
