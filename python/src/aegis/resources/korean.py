"""Korean resource — V3 Korean-language analysis endpoint.

Server contracts:

- ``POST /v3/korean/analyze`` — Korean-specific safety / intent analysis.
"""

from __future__ import annotations

from typing import Any, Dict

from aegis.resources._base import AsyncResource, SyncResource


class SyncKorean(SyncResource):

    def analyze(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return self._post("/v3/korean/analyze", json=body)


class AsyncKorean(AsyncResource):

    async def analyze(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return await self._post("/v3/korean/analyze", json=body)
