"""Judge resource — V1 judgment endpoints."""

from __future__ import annotations

from typing import Any, Dict, Iterator, List, Optional

from aegis._pagination import SyncPaginator, AsyncPaginator
from aegis._streaming import AsyncSSEStream, SyncSSEStream
from aegis.models.judge import (
    JudgeBatchRequest,
    JudgeRequest,
    JudgeResponse,
    JudgeStreamEvent,
)
from aegis.resources._base import AsyncResource, SyncResource


class SyncJudge(SyncResource):
    """Synchronous judge resource."""

    def create(
        self,
        prompt: str,
        context: Optional[Any] = None,
        metadata: Optional[Dict[str, Any]] = None,
        **kwargs: Any,
    ) -> JudgeResponse:
        req = JudgeRequest(prompt=prompt, context=context, metadata=metadata, **kwargs)
        data = self._post("/v1/judge", json=req.model_dump(exclude_none=True))
        return JudgeResponse.model_validate(data)

    def batch(self, requests: List[JudgeRequest]) -> List[JudgeResponse]:
        req = JudgeBatchRequest(requests=requests)
        data = self._post("/v1/judge/batch", json=req.model_dump(exclude_none=True))
        return [JudgeResponse.model_validate(item) for item in data.get("results", data)]

    def stream(
        self,
        prompt: str,
        context: Optional[Any] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Iterator[JudgeStreamEvent]:
        req = JudgeRequest(prompt=prompt, context=context, metadata=metadata)
        with self._transport.stream(
            "POST", "/v1/judge/stream", json=req.model_dump(exclude_none=True)
        ) as response:
            for event in SyncSSEStream(response):
                yield JudgeStreamEvent.model_validate(event.json())

    def list(
        self, *, page: int = 1, limit: int = 20, **filters: Any
    ) -> SyncPaginator[JudgeResponse]:
        params = {"page": page, "limit": limit, **filters}
        return SyncPaginator(
            fetch_page=lambda p: self._list("/v1/judgments", params=p),
            params=params,
            item_cls=JudgeResponse,
        )

    def get(self, judgment_id: str) -> JudgeResponse:
        data = self._get(f"/v1/judgments/{judgment_id}")
        return JudgeResponse.model_validate(data)


class AsyncJudge(AsyncResource):
    """Asynchronous judge resource."""

    async def create(
        self,
        prompt: str,
        context: Optional[Any] = None,
        metadata: Optional[Dict[str, Any]] = None,
        **kwargs: Any,
    ) -> JudgeResponse:
        req = JudgeRequest(prompt=prompt, context=context, metadata=metadata, **kwargs)
        data = await self._post("/v1/judge", json=req.model_dump(exclude_none=True))
        return JudgeResponse.model_validate(data)

    async def batch(self, requests: List[JudgeRequest]) -> List[JudgeResponse]:
        req = JudgeBatchRequest(requests=requests)
        data = await self._post("/v1/judge/batch", json=req.model_dump(exclude_none=True))
        return [JudgeResponse.model_validate(item) for item in data.get("results", data)]

    async def stream(
        self,
        prompt: str,
        context: Optional[Any] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ):
        req = JudgeRequest(prompt=prompt, context=context, metadata=metadata)
        async with self._transport.stream(
            "POST", "/v1/judge/stream", json=req.model_dump(exclude_none=True)
        ) as response:
            async for event in AsyncSSEStream(response):
                yield JudgeStreamEvent.model_validate(event.json())

    def list(
        self, *, page: int = 1, limit: int = 20, **filters: Any
    ) -> AsyncPaginator[JudgeResponse]:
        params = {"page": page, "limit": limit, **filters}
        return AsyncPaginator(
            fetch_page=lambda p: self._list("/v1/judgments", params=p),
            params=params,
            item_cls=JudgeResponse,
        )

    async def get(self, judgment_id: str) -> JudgeResponse:
        data = await self._get(f"/v1/judgments/{judgment_id}")
        return JudgeResponse.model_validate(data)
