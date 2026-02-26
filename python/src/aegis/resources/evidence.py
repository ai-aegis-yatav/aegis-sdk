"""Evidence resource — V1 audit evidence endpoints."""

from __future__ import annotations

from typing import Any

from aegis._pagination import AsyncPaginator, SyncPaginator
from aegis.models.evidence import Evidence, EvidenceVerification
from aegis.resources._base import AsyncResource, SyncResource


class SyncEvidence(SyncResource):

    def get(self, evidence_id: str) -> Evidence:
        return Evidence.model_validate(self._get(f"/v1/evidence/{evidence_id}"))

    def list(self, *, page: int = 1, limit: int = 20) -> SyncPaginator[Evidence]:
        return SyncPaginator(
            fetch_page=lambda p: self._list("/v1/evidence", params=p),
            params={"page": page, "limit": limit},
            item_cls=Evidence,
        )

    def verify(self, evidence_id: str) -> EvidenceVerification:
        data = self._get(f"/v1/evidence/{evidence_id}/verify")
        return EvidenceVerification.model_validate(data)

    def for_judgment(self, judgment_id: str) -> list[Evidence]:
        data = self._get(f"/v1/evidence/judgment/{judgment_id}")
        items = data if isinstance(data, list) else data.get("items", [])
        return [Evidence.model_validate(e) for e in items]


class AsyncEvidence(AsyncResource):

    async def get(self, evidence_id: str) -> Evidence:
        return Evidence.model_validate(await self._get(f"/v1/evidence/{evidence_id}"))

    def list(self, *, page: int = 1, limit: int = 20) -> AsyncPaginator[Evidence]:
        return AsyncPaginator(
            fetch_page=lambda p: self._list("/v1/evidence", params=p),
            params={"page": page, "limit": limit},
            item_cls=Evidence,
        )

    async def verify(self, evidence_id: str) -> EvidenceVerification:
        data = await self._get(f"/v1/evidence/{evidence_id}/verify")
        return EvidenceVerification.model_validate(data)

    async def for_judgment(self, judgment_id: str) -> list[Evidence]:
        data = await self._get(f"/v1/evidence/judgment/{judgment_id}")
        items = data if isinstance(data, list) else data.get("items", [])
        return [Evidence.model_validate(e) for e in items]
