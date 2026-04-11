"""Military resource — V3 defense-domain analysis endpoints.

Server contracts:

- ``POST /v3/military/anti-spoofing/analyze`` — anti-spoofing analysis.
- ``POST /v3/military/classification/analyze`` — classification analysis.
- ``POST /v3/military/command-chain/analyze`` — command-chain analysis.
- ``POST /v3/military/cross-domain/analyze`` — cross-domain analysis.
- ``POST /v3/military/opsec/analyze`` — OPSEC analysis.
- ``POST /v3/military/roe/analyze`` — rules-of-engagement analysis.
- ``POST /v3/military/tactical-autonomy/analyze`` — tactical autonomy analysis.
- ``POST /v3/military/orchestrate`` — orchestrate the full military pipeline.
- ``GET  /v3/military/status`` — module status.
"""

from __future__ import annotations

from typing import Any, Dict

from aegis.resources._base import AsyncResource, SyncResource


class SyncMilitary(SyncResource):

    def anti_spoofing(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return self._post("/v3/military/anti-spoofing/analyze", json=body)

    def classification(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return self._post("/v3/military/classification/analyze", json=body)

    def command_chain(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return self._post("/v3/military/command-chain/analyze", json=body)

    def cross_domain(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return self._post("/v3/military/cross-domain/analyze", json=body)

    def opsec(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return self._post("/v3/military/opsec/analyze", json=body)

    def roe(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return self._post("/v3/military/roe/analyze", json=body)

    def tactical_autonomy(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return self._post("/v3/military/tactical-autonomy/analyze", json=body)

    def orchestrate(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return self._post("/v3/military/orchestrate", json=body)

    def status(self) -> Dict[str, Any]:
        return self._get("/v3/military/status")


class AsyncMilitary(AsyncResource):

    async def anti_spoofing(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return await self._post("/v3/military/anti-spoofing/analyze", json=body)

    async def classification(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return await self._post("/v3/military/classification/analyze", json=body)

    async def command_chain(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return await self._post("/v3/military/command-chain/analyze", json=body)

    async def cross_domain(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return await self._post("/v3/military/cross-domain/analyze", json=body)

    async def opsec(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return await self._post("/v3/military/opsec/analyze", json=body)

    async def roe(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return await self._post("/v3/military/roe/analyze", json=body)

    async def tactical_autonomy(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return await self._post("/v3/military/tactical-autonomy/analyze", json=body)

    async def orchestrate(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return await self._post("/v3/military/orchestrate", json=body)

    async def status(self) -> Dict[str, Any]:
        return await self._get("/v3/military/status")
