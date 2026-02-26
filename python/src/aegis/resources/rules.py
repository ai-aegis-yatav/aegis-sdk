"""Rules resource — V1 rule management endpoints."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from aegis._pagination import AsyncPaginator, SyncPaginator
from aegis.models.rules import (
    Rule,
    RuleCreateRequest,
    RuleTestRequest,
    RuleTestResponse,
    RuleUpdateRequest,
)
from aegis.resources._base import AsyncResource, SyncResource


class SyncRules(SyncResource):

    def create(self, **kwargs: Any) -> Rule:
        req = RuleCreateRequest(**kwargs)
        data = self._post("/v1/rules", json=req.model_dump(exclude_none=True))
        return Rule.model_validate(data)

    def get(self, rule_id: str) -> Rule:
        return Rule.model_validate(self._get(f"/v1/rules/{rule_id}"))

    def update(self, rule_id: str, **kwargs: Any) -> Rule:
        req = RuleUpdateRequest(**kwargs)
        data = self._put(f"/v1/rules/{rule_id}", json=req.model_dump(exclude_none=True))
        return Rule.model_validate(data)

    def delete(self, rule_id: str) -> None:
        self._delete(f"/v1/rules/{rule_id}")

    def list(self, *, page: int = 1, limit: int = 20) -> SyncPaginator[Rule]:
        return SyncPaginator(
            fetch_page=lambda p: self._list("/v1/rules", params=p),
            params={"page": page, "limit": limit},
            item_cls=Rule,
        )

    def test(self, content: str, rule_ids: Optional[List[str]] = None) -> RuleTestResponse:
        req = RuleTestRequest(content=content, rule_ids=rule_ids)
        data = self._post("/v1/rules/test", json=req.model_dump(exclude_none=True))
        return RuleTestResponse.model_validate(data)

    def reload(self) -> Dict[str, Any]:
        return self._post("/v1/rules/reload")

    def templates(self) -> List[Dict[str, Any]]:
        return self._get("/v1/rules/templates")

    def templates_by_industry(self, industry: str) -> List[Dict[str, Any]]:
        return self._get(f"/v1/rules/templates/{industry}")

    def seed(self, industry: str) -> Dict[str, Any]:
        return self._post(f"/v1/rules/seed/{industry}")


class AsyncRules(AsyncResource):

    async def create(self, **kwargs: Any) -> Rule:
        req = RuleCreateRequest(**kwargs)
        data = await self._post("/v1/rules", json=req.model_dump(exclude_none=True))
        return Rule.model_validate(data)

    async def get(self, rule_id: str) -> Rule:
        return Rule.model_validate(await self._get(f"/v1/rules/{rule_id}"))

    async def update(self, rule_id: str, **kwargs: Any) -> Rule:
        req = RuleUpdateRequest(**kwargs)
        data = await self._put(f"/v1/rules/{rule_id}", json=req.model_dump(exclude_none=True))
        return Rule.model_validate(data)

    async def delete(self, rule_id: str) -> None:
        await self._delete(f"/v1/rules/{rule_id}")

    def list(self, *, page: int = 1, limit: int = 20) -> AsyncPaginator[Rule]:
        return AsyncPaginator(
            fetch_page=lambda p: self._list("/v1/rules", params=p),
            params={"page": page, "limit": limit},
            item_cls=Rule,
        )

    async def test(self, content: str, rule_ids: Optional[List[str]] = None) -> RuleTestResponse:
        req = RuleTestRequest(content=content, rule_ids=rule_ids)
        data = await self._post("/v1/rules/test", json=req.model_dump(exclude_none=True))
        return RuleTestResponse.model_validate(data)

    async def reload(self) -> Dict[str, Any]:
        return await self._post("/v1/rules/reload")

    async def templates(self) -> List[Dict[str, Any]]:
        return await self._get("/v1/rules/templates")

    async def templates_by_industry(self, industry: str) -> List[Dict[str, Any]]:
        return await self._get(f"/v1/rules/templates/{industry}")

    async def seed(self, industry: str) -> Dict[str, Any]:
        return await self._post(f"/v1/rules/seed/{industry}")
