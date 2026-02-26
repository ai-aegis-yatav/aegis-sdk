"""Anomaly resource — V3 anomaly detection endpoints."""

from __future__ import annotations

from typing import Any, Dict, List

from aegis._pagination import AsyncPaginator, SyncPaginator
from aegis.models.anomaly import (
    AnomalyAlgorithm,
    AnomalyDetectRequest,
    AnomalyDetectResponse,
    AnomalyEvent,
    AnomalyStats,
)
from aegis.resources._base import AsyncResource, SyncResource


class SyncAnomaly(SyncResource):

    def algorithms(self) -> List[AnomalyAlgorithm]:
        data = self._get("/v3/anomaly/algorithms")
        items = data if isinstance(data, list) else data.get("algorithms", [])
        return [AnomalyAlgorithm.model_validate(a) for a in items]

    def detect(self, metric: str, **kwargs: Any) -> AnomalyDetectResponse:
        req = AnomalyDetectRequest(metric=metric, **kwargs)
        data = self._post("/v3/anomaly/detect", json=req.model_dump(exclude_none=True))
        return AnomalyDetectResponse.model_validate(data)

    def detect_batch(
        self, requests: List[AnomalyDetectRequest]
    ) -> List[AnomalyDetectResponse]:
        data = self._post(
            "/v3/anomaly/detect/batch",
            json={"requests": [r.model_dump(exclude_none=True) for r in requests]},
        )
        items = data if isinstance(data, list) else data.get("results", [])
        return [AnomalyDetectResponse.model_validate(item) for item in items]

    def events(self, *, page: int = 1, limit: int = 20) -> SyncPaginator[AnomalyEvent]:
        return SyncPaginator(
            fetch_page=lambda p: self._list("/v3/anomaly/events", params=p),
            params={"page": page, "limit": limit},
            item_cls=AnomalyEvent,
        )

    def stats(self) -> AnomalyStats:
        return AnomalyStats.model_validate(self._get("/v3/anomaly/stats"))


class AsyncAnomaly(AsyncResource):

    async def algorithms(self) -> List[AnomalyAlgorithm]:
        data = await self._get("/v3/anomaly/algorithms")
        items = data if isinstance(data, list) else data.get("algorithms", [])
        return [AnomalyAlgorithm.model_validate(a) for a in items]

    async def detect(self, metric: str, **kwargs: Any) -> AnomalyDetectResponse:
        req = AnomalyDetectRequest(metric=metric, **kwargs)
        data = await self._post("/v3/anomaly/detect", json=req.model_dump(exclude_none=True))
        return AnomalyDetectResponse.model_validate(data)

    async def detect_batch(
        self, requests: List[AnomalyDetectRequest]
    ) -> List[AnomalyDetectResponse]:
        data = await self._post(
            "/v3/anomaly/detect/batch",
            json={"requests": [r.model_dump(exclude_none=True) for r in requests]},
        )
        items = data if isinstance(data, list) else data.get("results", [])
        return [AnomalyDetectResponse.model_validate(item) for item in items]

    def events(self, *, page: int = 1, limit: int = 20) -> AsyncPaginator[AnomalyEvent]:
        return AsyncPaginator(
            fetch_page=lambda p: self._list("/v3/anomaly/events", params=p),
            params={"page": page, "limit": limit},
            item_cls=AnomalyEvent,
        )

    async def stats(self) -> AnomalyStats:
        return AnomalyStats.model_validate(await self._get("/v3/anomaly/stats"))
