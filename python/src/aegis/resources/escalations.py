"""Escalations resource — V1 escalation workflow endpoints."""

from __future__ import annotations

from typing import Any, Dict

from aegis._pagination import AsyncPaginator, SyncPaginator
from aegis.models.escalations import (
    Escalation,
    EscalationCreateRequest,
    EscalationResolveRequest,
    EscalationStats,
)
from aegis.resources._base import AsyncResource, SyncResource


class SyncEscalations(SyncResource):

    def create(self, judgment_id: str, reason: str, **kwargs: Any) -> Escalation:
        req = EscalationCreateRequest(judgment_id=judgment_id, reason=reason, **kwargs)
        data = self._post("/v1/escalations", json=req.model_dump(exclude_none=True))
        return Escalation.model_validate(data)

    def get(self, escalation_id: str) -> Escalation:
        return Escalation.model_validate(self._get(f"/v1/escalations/{escalation_id}"))

    def list(self, *, page: int = 1, limit: int = 20, **filters: Any) -> SyncPaginator[Escalation]:
        return SyncPaginator(
            fetch_page=lambda p: self._list("/v1/escalations", params=p),
            params={"page": page, "limit": limit, **filters},
            item_cls=Escalation,
        )

    def resolve(self, escalation_id: str, resolution: str, **kwargs: Any) -> Escalation:
        req = EscalationResolveRequest(resolution=resolution, **kwargs)
        data = self._post(
            f"/v1/escalations/{escalation_id}/resolve",
            json=req.model_dump(exclude_none=True),
        )
        return Escalation.model_validate(data)

    def assign(self, escalation_id: str, assignee: str) -> Escalation:
        data = self._post(
            f"/v1/escalations/{escalation_id}/assign", json={"assignee": assignee}
        )
        return Escalation.model_validate(data)

    def claim(self, escalation_id: str) -> Escalation:
        data = self._post(f"/v1/escalations/{escalation_id}/claim")
        return Escalation.model_validate(data)

    def stats(self) -> EscalationStats:
        return EscalationStats.model_validate(self._get("/v1/escalations/stats"))


class AsyncEscalations(AsyncResource):

    async def create(self, judgment_id: str, reason: str, **kwargs: Any) -> Escalation:
        req = EscalationCreateRequest(judgment_id=judgment_id, reason=reason, **kwargs)
        data = await self._post("/v1/escalations", json=req.model_dump(exclude_none=True))
        return Escalation.model_validate(data)

    async def get(self, escalation_id: str) -> Escalation:
        return Escalation.model_validate(await self._get(f"/v1/escalations/{escalation_id}"))

    def list(self, *, page: int = 1, limit: int = 20, **filters: Any) -> AsyncPaginator[Escalation]:
        return AsyncPaginator(
            fetch_page=lambda p: self._list("/v1/escalations", params=p),
            params={"page": page, "limit": limit, **filters},
            item_cls=Escalation,
        )

    async def resolve(self, escalation_id: str, resolution: str, **kwargs: Any) -> Escalation:
        req = EscalationResolveRequest(resolution=resolution, **kwargs)
        data = await self._post(
            f"/v1/escalations/{escalation_id}/resolve",
            json=req.model_dump(exclude_none=True),
        )
        return Escalation.model_validate(data)

    async def assign(self, escalation_id: str, assignee: str) -> Escalation:
        data = await self._post(
            f"/v1/escalations/{escalation_id}/assign", json={"assignee": assignee}
        )
        return Escalation.model_validate(data)

    async def claim(self, escalation_id: str) -> Escalation:
        data = await self._post(f"/v1/escalations/{escalation_id}/claim")
        return Escalation.model_validate(data)

    async def stats(self) -> EscalationStats:
        return EscalationStats.model_validate(await self._get("/v1/escalations/stats"))
