"""Pipeline resource — V3 defense-pipeline execution endpoint.

Server contracts:

- ``POST /v3/pipeline/run`` — run a composed defense pipeline.
"""

from __future__ import annotations

from typing import Any, Dict

from aegis.resources._base import AsyncResource, SyncResource


class SyncPipeline(SyncResource):

    def run(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return self._post("/v3/pipeline/run", json=body)


class AsyncPipeline(AsyncResource):

    async def run(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return await self._post("/v3/pipeline/run", json=body)
