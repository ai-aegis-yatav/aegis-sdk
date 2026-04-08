"""Anomaly resource — V3 anomaly detection endpoints.

``POST /v3/anomaly/detect`` accepts a flexible set of fields:
``metric``, ``algorithm`` ("zscore" / "moving_average" / "iqr" /
"isolation_forest"), ``data_points`` (array of {timestamp, value}),
``threshold``. The smoke-test friendly signature accepts ``value`` +
``history`` and converts to data_points.

``GET /v3/anomaly/events`` returns ``{events: [...], total: int}``.
"""

from __future__ import annotations

import time
from typing import Any, Dict, List, Optional

from aegis.resources._base import AsyncResource, SyncResource


def _detect_body(
    metric: Optional[str] = None,
    *,
    algorithm: str = "zscore",
    value: Optional[float] = None,
    history: Optional[List[float]] = None,
    data_points: Optional[List[Dict[str, Any]]] = None,
    threshold: Optional[float] = None,
    **kwargs: Any,
) -> Dict[str, Any]:
    body: Dict[str, Any] = {"algorithm": algorithm}
    if metric is not None:
        body["metric"] = metric
    if data_points is not None:
        body["data_points"] = data_points
    elif history is not None:
        now = int(time.time())
        points = [
            {"timestamp": now - (len(history) - i) * 60, "value": float(v)}
            for i, v in enumerate(history)
        ]
        if value is not None:
            points.append({"timestamp": now, "value": float(value)})
        body["data_points"] = points
    if threshold is not None:
        body["threshold"] = threshold
    body.update(kwargs)
    return body


class SyncAnomaly(SyncResource):

    def algorithms(self) -> List[Dict[str, Any]]:
        data = self._get("/v3/anomaly/algorithms")
        return data if isinstance(data, list) else data.get("algorithms", [])

    def detect(self, metric: Optional[str] = None, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v3/anomaly/detect", json=_detect_body(metric, **kwargs))

    def events(self, *, limit: int = 20, **params: Any) -> Dict[str, Any]:
        params.setdefault("limit", limit)
        return self._get("/v3/anomaly/events", params=params)

    def stats(self) -> Dict[str, Any]:
        return self._get("/v3/anomaly/stats")


class AsyncAnomaly(AsyncResource):

    async def algorithms(self) -> List[Dict[str, Any]]:
        data = await self._get("/v3/anomaly/algorithms")
        return data if isinstance(data, list) else data.get("algorithms", [])

    async def detect(self, metric: Optional[str] = None, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v3/anomaly/detect", json=_detect_body(metric, **kwargs))

    async def events(self, *, limit: int = 20, **params: Any) -> Dict[str, Any]:
        params.setdefault("limit", limit)
        return await self._get("/v3/anomaly/events", params=params)

    async def stats(self) -> Dict[str, Any]:
        return await self._get("/v3/anomaly/stats")
