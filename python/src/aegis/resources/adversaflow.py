"""AdversaFlow resource — V2 attack campaign tracking endpoints."""

from __future__ import annotations

from typing import Any, Dict, List

from aegis._pagination import AsyncPaginator, SyncPaginator
from aegis.models.adversaflow import AttackCampaign, AttackRecord, AttackTrace
from aegis.resources._base import AsyncResource, SyncResource


class SyncAdversaFlow(SyncResource):

    def campaigns(self, *, page: int = 1, limit: int = 20) -> SyncPaginator[AttackCampaign]:
        return SyncPaginator(
            fetch_page=lambda p: self._list("/v2/adversaflow/campaigns", params=p),
            params={"page": page, "limit": limit},
            item_cls=AttackCampaign,
        )

    def tree(self, campaign_id: str) -> Dict[str, Any]:
        return self._get(f"/v2/adversaflow/tree/{campaign_id}")

    def trace(self, campaign_id: str) -> AttackTrace:
        data = self._get(f"/v2/adversaflow/trace/{campaign_id}")
        return AttackTrace.model_validate(data)

    def stats(self, campaign_id: str) -> Dict[str, Any]:
        return self._get(f"/v2/adversaflow/stats/{campaign_id}")

    def metrics(self, campaign_id: str) -> Dict[str, Any]:
        return self._get(f"/v2/adversaflow/metrics/{campaign_id}")

    def record(self, **kwargs: Any) -> Dict[str, Any]:
        rec = AttackRecord(**kwargs)
        return self._post("/v2/adversaflow/record", json=rec.model_dump(exclude_none=True))


class AsyncAdversaFlow(AsyncResource):

    def campaigns(self, *, page: int = 1, limit: int = 20) -> AsyncPaginator[AttackCampaign]:
        return AsyncPaginator(
            fetch_page=lambda p: self._list("/v2/adversaflow/campaigns", params=p),
            params={"page": page, "limit": limit},
            item_cls=AttackCampaign,
        )

    async def tree(self, campaign_id: str) -> Dict[str, Any]:
        return await self._get(f"/v2/adversaflow/tree/{campaign_id}")

    async def trace(self, campaign_id: str) -> AttackTrace:
        data = await self._get(f"/v2/adversaflow/trace/{campaign_id}")
        return AttackTrace.model_validate(data)

    async def stats(self, campaign_id: str) -> Dict[str, Any]:
        return await self._get(f"/v2/adversaflow/stats/{campaign_id}")

    async def metrics(self, campaign_id: str) -> Dict[str, Any]:
        return await self._get(f"/v2/adversaflow/metrics/{campaign_id}")

    async def record(self, **kwargs: Any) -> Dict[str, Any]:
        rec = AttackRecord(**kwargs)
        return await self._post(
            "/v2/adversaflow/record", json=rec.model_dump(exclude_none=True)
        )
