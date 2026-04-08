"""Jailbreak resource — V2 jailbreak detection endpoints."""

from __future__ import annotations

from typing import Any, Dict, List

from aegis.resources._base import AsyncResource, SyncResource


def _to_text(item: Any) -> str:
    if isinstance(item, str):
        return item
    if isinstance(item, dict):
        return item.get("text") or item.get("content") or ""
    return getattr(item, "text", None) or getattr(item, "content", None) or ""


class SyncJailbreak(SyncResource):

    def detect(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v2/jailbreak/detect", json={"text": content, **kwargs})

    def detect_batch(self, requests: List[Any]) -> Dict[str, Any]:
        return self._post(
            "/v2/jailbreak/detect/batch",
            json={"texts": [_to_text(r) for r in requests]},
        )

    def types(self) -> List[Dict[str, Any]]:
        data = self._get("/v2/jailbreak/types")
        return data if isinstance(data, list) else data.get("types", [])


class AsyncJailbreak(AsyncResource):

    async def detect(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v2/jailbreak/detect", json={"text": content, **kwargs})

    async def detect_batch(self, requests: List[Any]) -> Dict[str, Any]:
        return await self._post(
            "/v2/jailbreak/detect/batch",
            json={"texts": [_to_text(r) for r in requests]},
        )

    async def types(self) -> List[Dict[str, Any]]:
        data = await self._get("/v2/jailbreak/types")
        return data if isinstance(data, list) else data.get("types", [])
