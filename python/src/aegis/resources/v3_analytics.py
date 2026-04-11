"""V3 Analytics resource — V3 analytics / explainability endpoints.

Distinct from the V1 ``analytics`` resource; these endpoints live under
``/v3/analytics/*`` and expose PALADIN layer stats, explanation and
attack-cluster APIs.

Server contracts:

- ``GET  /v3/analytics/explain/{judgment_id}`` — explanation for a judgment.
- ``GET  /v3/analytics/layer-stats`` — per-layer aggregate statistics.
- ``POST /v3/analytics/attack-clusters`` — attack-cluster analysis.
- ``GET  /v3/analytics/baseline`` — baseline metrics.
"""

from __future__ import annotations

from typing import Any, Dict

from aegis.resources._base import AsyncResource, SyncResource


class SyncV3Analytics(SyncResource):

    def explain(self, judgment_id: str) -> Dict[str, Any]:
        return self._get(f"/v3/analytics/explain/{judgment_id}")

    def layer_stats(self, **params: Any) -> Dict[str, Any]:
        return self._get("/v3/analytics/layer-stats", params=params or None)

    def attack_clusters(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return self._post("/v3/analytics/attack-clusters", json=body)

    def baseline(self, **params: Any) -> Dict[str, Any]:
        return self._get("/v3/analytics/baseline", params=params or None)


class AsyncV3Analytics(AsyncResource):

    async def explain(self, judgment_id: str) -> Dict[str, Any]:
        return await self._get(f"/v3/analytics/explain/{judgment_id}")

    async def layer_stats(self, **params: Any) -> Dict[str, Any]:
        return await self._get("/v3/analytics/layer-stats", params=params or None)

    async def attack_clusters(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return await self._post("/v3/analytics/attack-clusters", json=body)

    async def baseline(self, **params: Any) -> Dict[str, Any]:
        return await self._get("/v3/analytics/baseline", params=params or None)
