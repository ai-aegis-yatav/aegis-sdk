"""SABER resource — V3 Bayesian risk estimation endpoints.

Server contracts:

- ``POST /v3/saber/estimate`` expects ``queries`` (array of objects with
  ``query_id``, ``total_trials``, ``success_count``, optional ``category``)
  plus optional ``min_trials``, ``target_budgets``, ``confidence_level``.
- ``POST /v3/saber/evaluate`` expects ``content`` (alias ``prompt``), ``n``
  (alias ``n_samples``), ``defense_mode`` (alias ``defense_name``).
- ``GET  /v3/saber/budget`` accepts query params ``tau``, ``alpha``, ``beta``.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from aegis.resources._base import AsyncResource, SyncResource


def _normalize_estimate_queries(content: Any) -> List[Dict[str, Any]]:
    """Accept either a list of query dicts or a single string (smoke-test
    convenience). When a string is given, build one synthetic query."""
    if isinstance(content, list):
        return content
    return [
        {
            "query_id": "default",
            "total_trials": 100,
            "success_count": 5,
            "category": "smoke",
        }
    ]


class SyncSaber(SyncResource):

    def estimate(self, content: Any = None, **kwargs: Any) -> Dict[str, Any]:
        body: Dict[str, Any] = {"queries": _normalize_estimate_queries(content)}
        body.update(kwargs)
        return self._post("/v3/saber/estimate", json=body)

    def evaluate(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v3/saber/evaluate", json={"content": content, **kwargs})

    def budget(self, *, tau: float = 0.5, **kwargs: Any) -> Dict[str, Any]:
        params: Dict[str, Any] = {"tau": tau, **kwargs}
        return self._get("/v3/saber/budget", params=params)

    def compare(
        self, content: str, defenses: List[str], **kwargs: Any
    ) -> Dict[str, Any]:
        return self._post(
            "/v3/saber/compare",
            json={"content": content, "defenses": defenses, **kwargs},
        )

    def report(self, report_id: str) -> Dict[str, Any]:
        return self._get(f"/v3/saber/report/{report_id}")

    def update_deterministic(self, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v3/saber/deterministic/update", json=kwargs)


class AsyncSaber(AsyncResource):

    async def estimate(self, content: Any = None, **kwargs: Any) -> Dict[str, Any]:
        body: Dict[str, Any] = {"queries": _normalize_estimate_queries(content)}
        body.update(kwargs)
        return await self._post("/v3/saber/estimate", json=body)

    async def evaluate(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v3/saber/evaluate", json={"content": content, **kwargs})

    async def budget(self, *, tau: float = 0.5, **kwargs: Any) -> Dict[str, Any]:
        return await self._get("/v3/saber/budget", params={"tau": tau, **kwargs})

    async def compare(
        self, content: str, defenses: List[str], **kwargs: Any
    ) -> Dict[str, Any]:
        return await self._post(
            "/v3/saber/compare",
            json={"content": content, "defenses": defenses, **kwargs},
        )

    async def report(self, report_id: str) -> Dict[str, Any]:
        return await self._get(f"/v3/saber/report/{report_id}")

    async def update_deterministic(self, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v3/saber/deterministic/update", json=kwargs)
