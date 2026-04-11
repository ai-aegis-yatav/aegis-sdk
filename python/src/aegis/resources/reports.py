"""Reports resource — V3 report generation endpoint.

Server contracts:

- ``POST /v3/reports/generate`` — generate a report for the configured period.
"""

from __future__ import annotations

from typing import Any, Dict

from aegis.resources._base import AsyncResource, SyncResource


class SyncReports(SyncResource):

    def generate(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return self._post("/v3/reports/generate", json=body)


class AsyncReports(AsyncResource):

    async def generate(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return await self._post("/v3/reports/generate", json=body)
