"""Classify resource — V2 content classification endpoints."""

from __future__ import annotations

from typing import Any, Dict, List

from aegis.resources._base import AsyncResource, SyncResource


def _to_text(item: Any) -> str:
    if isinstance(item, str):
        return item
    if isinstance(item, dict):
        return item.get("text") or item.get("content") or ""
    return getattr(item, "text", None) or getattr(item, "content", None) or ""


class SyncClassify(SyncResource):

    def classify(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v2/classify", json={"text": content, **kwargs})

    def batch(self, requests: List[Any]) -> Dict[str, Any]:
        return self._post(
            "/v2/classify/batch",
            json={"texts": [_to_text(r) for r in requests]},
        )

    def categories(self) -> List[Dict[str, Any]]:
        data = self._get("/v2/classify/categories")
        return data if isinstance(data, list) else data.get("categories", [])


class AsyncClassify(AsyncResource):

    async def classify(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v2/classify", json={"text": content, **kwargs})

    async def batch(self, requests: List[Any]) -> Dict[str, Any]:
        return await self._post(
            "/v2/classify/batch",
            json={"texts": [_to_text(r) for r in requests]},
        )

    async def categories(self) -> List[Dict[str, Any]]:
        data = await self._get("/v2/classify/categories")
        return data if isinstance(data, list) else data.get("categories", [])
