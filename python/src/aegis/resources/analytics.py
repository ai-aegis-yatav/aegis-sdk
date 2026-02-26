"""Analytics resource — V1 dashboard analytics endpoints."""

from __future__ import annotations

from typing import Any, Dict, Optional

from aegis.models.analytics import AnalyticsOverview, AnalyticsQuery
from aegis.resources._base import AsyncResource, SyncResource


class SyncAnalytics(SyncResource):

    def overview(self, **kwargs: Any) -> AnalyticsOverview:
        q = AnalyticsQuery(**kwargs)
        data = self._get("/v1/analytics/overview", params=q.model_dump(exclude_none=True))
        return AnalyticsOverview.model_validate(data)

    def judgments(self, **kwargs: Any) -> Dict[str, Any]:
        q = AnalyticsQuery(**kwargs)
        return self._get("/v1/analytics/judgments", params=q.model_dump(exclude_none=True))

    def defense_layers(self, **kwargs: Any) -> Dict[str, Any]:
        q = AnalyticsQuery(**kwargs)
        return self._get("/v1/analytics/defense-layers", params=q.model_dump(exclude_none=True))

    def threats(self, **kwargs: Any) -> Dict[str, Any]:
        q = AnalyticsQuery(**kwargs)
        return self._get("/v1/analytics/threats", params=q.model_dump(exclude_none=True))

    def performance(self, **kwargs: Any) -> Dict[str, Any]:
        q = AnalyticsQuery(**kwargs)
        return self._get("/v1/analytics/performance", params=q.model_dump(exclude_none=True))


class AsyncAnalytics(AsyncResource):

    async def overview(self, **kwargs: Any) -> AnalyticsOverview:
        q = AnalyticsQuery(**kwargs)
        data = await self._get("/v1/analytics/overview", params=q.model_dump(exclude_none=True))
        return AnalyticsOverview.model_validate(data)

    async def judgments(self, **kwargs: Any) -> Dict[str, Any]:
        q = AnalyticsQuery(**kwargs)
        return await self._get("/v1/analytics/judgments", params=q.model_dump(exclude_none=True))

    async def defense_layers(self, **kwargs: Any) -> Dict[str, Any]:
        q = AnalyticsQuery(**kwargs)
        return await self._get(
            "/v1/analytics/defense-layers", params=q.model_dump(exclude_none=True)
        )

    async def threats(self, **kwargs: Any) -> Dict[str, Any]:
        q = AnalyticsQuery(**kwargs)
        return await self._get("/v1/analytics/threats", params=q.model_dump(exclude_none=True))

    async def performance(self, **kwargs: Any) -> Dict[str, Any]:
        q = AnalyticsQuery(**kwargs)
        return await self._get(
            "/v1/analytics/performance", params=q.model_dump(exclude_none=True)
        )
