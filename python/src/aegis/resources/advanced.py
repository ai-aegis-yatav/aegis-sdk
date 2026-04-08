"""Advanced resource — V2 advanced attack detection endpoints.

All endpoints accept the same payload shape: ``{"text": "..."}``.
"""

from __future__ import annotations

from typing import Any, Dict

from aegis.resources._base import AsyncResource, SyncResource

_PATHS = {
    "detect": "/v2/advanced/detect",
    "hybrid_web": "/v2/advanced/hybrid-web",
    "vsh": "/v2/advanced/vsh",
    "few_shot": "/v2/advanced/few-shot",
    "cot": "/v2/advanced/cot",
    "acoustic": "/v2/advanced/acoustic",
    "context_confusion": "/v2/advanced/context-confusion",
    "info_extraction": "/v2/advanced/info-extraction",
}


class SyncAdvanced(SyncResource):

    def _call(self, key: str, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post(_PATHS[key], json={"text": content, **kwargs})

    def detect(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._call("detect", content, **kwargs)

    def hybrid_web(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._call("hybrid_web", content, **kwargs)

    def vsh(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._call("vsh", content, **kwargs)

    def few_shot(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._call("few_shot", content, **kwargs)

    def cot(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._call("cot", content, **kwargs)

    def acoustic(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._call("acoustic", content, **kwargs)

    def context_confusion(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._call("context_confusion", content, **kwargs)

    def info_extraction(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._call("info_extraction", content, **kwargs)


class AsyncAdvanced(AsyncResource):

    async def _call(self, key: str, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post(_PATHS[key], json={"text": content, **kwargs})

    async def detect(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._call("detect", content, **kwargs)

    async def hybrid_web(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._call("hybrid_web", content, **kwargs)

    async def vsh(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._call("vsh", content, **kwargs)

    async def few_shot(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._call("few_shot", content, **kwargs)

    async def cot(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._call("cot", content, **kwargs)

    async def acoustic(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._call("acoustic", content, **kwargs)

    async def context_confusion(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._call("context_confusion", content, **kwargs)

    async def info_extraction(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._call("info_extraction", content, **kwargs)
