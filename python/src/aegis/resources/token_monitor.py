"""TokenMonitor resource — V3 token usage / quotas / alerts endpoints.

Server contracts:

- ``GET   /v3/token-monitor/usage`` — token usage data (query params).
- ``GET   /v3/token-monitor/quotas`` — list configured quotas.
- ``POST  /v3/token-monitor/quotas`` — create a quota.
- ``PATCH /v3/token-monitor/quotas/{id}`` — update a quota.
- ``GET   /v3/token-monitor/alerts`` — list alerts (query params).
- ``PATCH /v3/token-monitor/alerts/{id}`` — update an alert.
- ``GET   /v3/token-monitor/overview`` — usage overview.
"""

from __future__ import annotations

from typing import Any, Dict

from aegis.resources._base import AsyncResource, SyncResource


class SyncTokenMonitor(SyncResource):

    def usage(self, **params: Any) -> Dict[str, Any]:
        return self._get("/v3/token-monitor/usage", params=params or None)

    def list_quotas(self) -> Dict[str, Any]:
        return self._get("/v3/token-monitor/quotas")

    def create_quota(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return self._post("/v3/token-monitor/quotas", json=body)

    def update_quota(self, id: str, body: Dict[str, Any]) -> Dict[str, Any]:
        return self._transport.request(
            "PATCH", f"/v3/token-monitor/quotas/{id}", json=body
        ).data

    def list_alerts(self, **params: Any) -> Dict[str, Any]:
        return self._get("/v3/token-monitor/alerts", params=params or None)

    def update_alert(self, id: str, body: Dict[str, Any]) -> Dict[str, Any]:
        return self._transport.request(
            "PATCH", f"/v3/token-monitor/alerts/{id}", json=body
        ).data

    def overview(self) -> Dict[str, Any]:
        return self._get("/v3/token-monitor/overview")


class AsyncTokenMonitor(AsyncResource):

    async def usage(self, **params: Any) -> Dict[str, Any]:
        return await self._get("/v3/token-monitor/usage", params=params or None)

    async def list_quotas(self) -> Dict[str, Any]:
        return await self._get("/v3/token-monitor/quotas")

    async def create_quota(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return await self._post("/v3/token-monitor/quotas", json=body)

    async def update_quota(self, id: str, body: Dict[str, Any]) -> Dict[str, Any]:
        resp = await self._transport.request(
            "PATCH", f"/v3/token-monitor/quotas/{id}", json=body
        )
        return resp.data

    async def list_alerts(self, **params: Any) -> Dict[str, Any]:
        return await self._get("/v3/token-monitor/alerts", params=params or None)

    async def update_alert(self, id: str, body: Dict[str, Any]) -> Dict[str, Any]:
        resp = await self._transport.request(
            "PATCH", f"/v3/token-monitor/alerts/{id}", json=body
        )
        return resp.data

    async def overview(self) -> Dict[str, Any]:
        return await self._get("/v3/token-monitor/overview")
