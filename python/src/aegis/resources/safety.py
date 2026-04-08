"""Safety resource — V2 content safety check endpoints."""

from __future__ import annotations

from typing import Any, Dict, List

from aegis.resources._base import AsyncResource, SyncResource


def _to_text(item: Any) -> str:
    if isinstance(item, str):
        return item
    if isinstance(item, dict):
        return item.get("text") or item.get("content") or ""
    return getattr(item, "text", None) or getattr(item, "content", None) or ""


class SyncSafety(SyncResource):

    def check(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v2/safety/check", json={"text": content, **kwargs})

    def check_batch(self, requests: List[Any]) -> Dict[str, Any]:
        return self._post(
            "/v2/safety/check/batch",
            json={"texts": [_to_text(r) for r in requests]},
        )

    def categories(self) -> List[Dict[str, Any]]:
        data = self._get("/v2/safety/categories")
        return data if isinstance(data, list) else data.get("categories", [])

    def backends(self) -> List[Dict[str, Any]]:
        data = self._get("/v2/safety/backends")
        return data if isinstance(data, list) else data.get("backends", [])


class AsyncSafety(AsyncResource):

    async def check(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v2/safety/check", json={"text": content, **kwargs})

    async def check_batch(self, requests: List[Any]) -> Dict[str, Any]:
        return await self._post(
            "/v2/safety/check/batch",
            json={"texts": [_to_text(r) for r in requests]},
        )

    async def categories(self) -> List[Dict[str, Any]]:
        data = await self._get("/v2/safety/categories")
        return data if isinstance(data, list) else data.get("categories", [])

    async def backends(self) -> List[Dict[str, Any]]:
        data = await self._get("/v2/safety/backends")
        return data if isinstance(data, list) else data.get("backends", [])
