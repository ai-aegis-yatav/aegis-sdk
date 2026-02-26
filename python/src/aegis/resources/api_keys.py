"""API Keys resource — API key management endpoints."""

from __future__ import annotations

from typing import Any

from aegis._pagination import AsyncPaginator, SyncPaginator
from aegis.models.api_keys import ApiKey, ApiKeyCreateRequest, ApiKeyCreateResponse
from aegis.resources._base import AsyncResource, SyncResource


class SyncApiKeys(SyncResource):

    def create(self, name: str, **kwargs: Any) -> ApiKeyCreateResponse:
        req = ApiKeyCreateRequest(name=name, **kwargs)
        data = self._post("/v1/api-keys", json=req.model_dump(exclude_none=True))
        return ApiKeyCreateResponse.model_validate(data)

    def list(self, *, page: int = 1, limit: int = 20) -> SyncPaginator[ApiKey]:
        return SyncPaginator(
            fetch_page=lambda p: self._list("/v1/api-keys", params=p),
            params={"page": page, "limit": limit},
            item_cls=ApiKey,
        )

    def get(self, key_id: str) -> ApiKey:
        return ApiKey.model_validate(self._get(f"/v1/api-keys/{key_id}"))

    def revoke(self, key_id: str) -> None:
        self._post(f"/v1/api-keys/{key_id}/revoke")

    def delete(self, key_id: str) -> None:
        self._delete(f"/v1/api-keys/{key_id}")


class AsyncApiKeys(AsyncResource):

    async def create(self, name: str, **kwargs: Any) -> ApiKeyCreateResponse:
        req = ApiKeyCreateRequest(name=name, **kwargs)
        data = await self._post("/v1/api-keys", json=req.model_dump(exclude_none=True))
        return ApiKeyCreateResponse.model_validate(data)

    def list(self, *, page: int = 1, limit: int = 20) -> AsyncPaginator[ApiKey]:
        return AsyncPaginator(
            fetch_page=lambda p: self._list("/v1/api-keys", params=p),
            params={"page": page, "limit": limit},
            item_cls=ApiKey,
        )

    async def get(self, key_id: str) -> ApiKey:
        return ApiKey.model_validate(await self._get(f"/v1/api-keys/{key_id}"))

    async def revoke(self, key_id: str) -> None:
        await self._post(f"/v1/api-keys/{key_id}/revoke")

    async def delete(self, key_id: str) -> None:
        await self._delete(f"/v1/api-keys/{key_id}")
