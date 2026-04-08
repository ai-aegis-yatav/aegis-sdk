"""GuardNet and V3 defense resources — V3 advanced defense endpoints."""

from __future__ import annotations

from typing import Any, Dict

from aegis.resources._base import AsyncResource, SyncResource


class SyncGuardNet(SyncResource):

    def analyze(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v3/defense/guardnet", json={"text": content, **kwargs})

    def jbshield(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v3/defense/jbshield", json={"text": content, **kwargs})

    def ccfc(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v3/defense/ccfc", json={"text": content, **kwargs})

    def muli(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v3/defense/muli", json={"text": content, **kwargs})

    def unified(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v3/defense/unified", json={"text": content, **kwargs})


class AsyncGuardNet(AsyncResource):

    async def analyze(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v3/defense/guardnet", json={"text": content, **kwargs})

    async def jbshield(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v3/defense/jbshield", json={"text": content, **kwargs})

    async def ccfc(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v3/defense/ccfc", json={"text": content, **kwargs})

    async def muli(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v3/defense/muli", json={"text": content, **kwargs})

    async def unified(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v3/defense/unified", json={"text": content, **kwargs})
