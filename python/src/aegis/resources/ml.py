"""ML resource — V1 ML inference endpoints."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from aegis.resources._base import AsyncResource, SyncResource


class SyncML(SyncResource):

    def health(self) -> Dict[str, Any]:
        return self._get("/v1/ml/health")

    def embed(self, text: str, model: Optional[str] = None) -> Dict[str, Any]:
        body: Dict[str, Any] = {"text": text}
        if model is not None:
            body["model"] = model
        return self._post("/v1/ml/embed", json=body)

    def embed_batch(
        self, texts: List[str], model: Optional[str] = None
    ) -> Dict[str, Any]:
        body: Dict[str, Any] = {"texts": texts}
        if model is not None:
            body["model"] = model
        return self._post("/v1/ml/embed/batch", json=body)

    def classify(self, text: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v1/ml/classify", json={"text": text, **kwargs})

    def similarity(
        self, query: str, documents: Optional[List[str]] = None, **kwargs: Any
    ) -> Dict[str, Any]:
        body: Dict[str, Any] = {"query": query}
        if documents is not None:
            body["documents"] = documents
        body.update(kwargs)
        return self._post("/v1/ml/similarity", json=body)


class AsyncML(AsyncResource):

    async def health(self) -> Dict[str, Any]:
        return await self._get("/v1/ml/health")

    async def embed(self, text: str, model: Optional[str] = None) -> Dict[str, Any]:
        body: Dict[str, Any] = {"text": text}
        if model is not None:
            body["model"] = model
        return await self._post("/v1/ml/embed", json=body)

    async def embed_batch(
        self, texts: List[str], model: Optional[str] = None
    ) -> Dict[str, Any]:
        body: Dict[str, Any] = {"texts": texts}
        if model is not None:
            body["model"] = model
        return await self._post("/v1/ml/embed/batch", json=body)

    async def classify(self, text: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v1/ml/classify", json={"text": text, **kwargs})

    async def similarity(
        self, query: str, documents: Optional[List[str]] = None, **kwargs: Any
    ) -> Dict[str, Any]:
        body: Dict[str, Any] = {"query": query}
        if documents is not None:
            body["documents"] = documents
        body.update(kwargs)
        return await self._post("/v1/ml/similarity", json=body)
