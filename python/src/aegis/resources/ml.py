"""ML resource — V1 ML inference endpoints."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from aegis.models.ml import (
    ClassifyRequest,
    ClassifyResponse,
    EmbedBatchRequest,
    EmbedRequest,
    EmbedResponse,
    SimilarityRequest,
    SimilarityResponse,
)
from aegis.resources._base import AsyncResource, SyncResource


class SyncML(SyncResource):

    def health(self) -> Dict[str, Any]:
        return self._get("/v1/ml/health")

    def embed(self, text: str, model: Optional[str] = None) -> EmbedResponse:
        req = EmbedRequest(text=text, model=model)
        data = self._post("/v1/ml/embed", json=req.model_dump(exclude_none=True))
        return EmbedResponse.model_validate(data)

    def embed_batch(self, texts: List[str], model: Optional[str] = None) -> List[EmbedResponse]:
        req = EmbedBatchRequest(texts=texts, model=model)
        data = self._post("/v1/ml/embed/batch", json=req.model_dump(exclude_none=True))
        items = data if isinstance(data, list) else data.get("embeddings", [])
        return [EmbedResponse.model_validate(e) for e in items]

    def classify(self, text: str, **kwargs: Any) -> ClassifyResponse:
        req = ClassifyRequest(text=text, **kwargs)
        data = self._post("/v1/ml/classify", json=req.model_dump(exclude_none=True))
        return ClassifyResponse.model_validate(data)

    def similarity(self, query: str, documents: List[str], **kwargs: Any) -> SimilarityResponse:
        req = SimilarityRequest(query=query, documents=documents, **kwargs)
        data = self._post("/v1/ml/similarity", json=req.model_dump(exclude_none=True))
        return SimilarityResponse.model_validate(data)


class AsyncML(AsyncResource):

    async def health(self) -> Dict[str, Any]:
        return await self._get("/v1/ml/health")

    async def embed(self, text: str, model: Optional[str] = None) -> EmbedResponse:
        req = EmbedRequest(text=text, model=model)
        data = await self._post("/v1/ml/embed", json=req.model_dump(exclude_none=True))
        return EmbedResponse.model_validate(data)

    async def embed_batch(
        self, texts: List[str], model: Optional[str] = None
    ) -> List[EmbedResponse]:
        req = EmbedBatchRequest(texts=texts, model=model)
        data = await self._post("/v1/ml/embed/batch", json=req.model_dump(exclude_none=True))
        items = data if isinstance(data, list) else data.get("embeddings", [])
        return [EmbedResponse.model_validate(e) for e in items]

    async def classify(self, text: str, **kwargs: Any) -> ClassifyResponse:
        req = ClassifyRequest(text=text, **kwargs)
        data = await self._post("/v1/ml/classify", json=req.model_dump(exclude_none=True))
        return ClassifyResponse.model_validate(data)

    async def similarity(
        self, query: str, documents: List[str], **kwargs: Any
    ) -> SimilarityResponse:
        req = SimilarityRequest(query=query, documents=documents, **kwargs)
        data = await self._post("/v1/ml/similarity", json=req.model_dump(exclude_none=True))
        return SimilarityResponse.model_validate(data)
