"""Classify resource — V2 content classification endpoints."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from aegis.models.classify import (
    ClassifyCategory,
    ContentClassifyRequest,
    ContentClassifyResponse,
)
from aegis.resources._base import AsyncResource, SyncResource


class SyncClassify(SyncResource):

    def classify(self, content: str, **kwargs: Any) -> ContentClassifyResponse:
        req = ContentClassifyRequest(content=content, **kwargs)
        data = self._post("/v2/classify", json=req.model_dump(exclude_none=True))
        return ContentClassifyResponse.model_validate(data)

    def batch(self, requests: List[ContentClassifyRequest]) -> List[ContentClassifyResponse]:
        data = self._post(
            "/v2/classify/batch",
            json={"requests": [r.model_dump(exclude_none=True) for r in requests]},
        )
        items = data if isinstance(data, list) else data.get("results", [])
        return [ContentClassifyResponse.model_validate(item) for item in items]

    def categories(self) -> List[ClassifyCategory]:
        data = self._get("/v2/classify/categories")
        items = data if isinstance(data, list) else data.get("categories", [])
        return [ClassifyCategory.model_validate(c) for c in items]


class AsyncClassify(AsyncResource):

    async def classify(self, content: str, **kwargs: Any) -> ContentClassifyResponse:
        req = ContentClassifyRequest(content=content, **kwargs)
        data = await self._post("/v2/classify", json=req.model_dump(exclude_none=True))
        return ContentClassifyResponse.model_validate(data)

    async def batch(
        self, requests: List[ContentClassifyRequest]
    ) -> List[ContentClassifyResponse]:
        data = await self._post(
            "/v2/classify/batch",
            json={"requests": [r.model_dump(exclude_none=True) for r in requests]},
        )
        items = data if isinstance(data, list) else data.get("results", [])
        return [ContentClassifyResponse.model_validate(item) for item in items]

    async def categories(self) -> List[ClassifyCategory]:
        data = await self._get("/v2/classify/categories")
        items = data if isinstance(data, list) else data.get("categories", [])
        return [ClassifyCategory.model_validate(c) for c in items]
