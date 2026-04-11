"""GuardModel resource — V3 guard-model training and telemetry endpoints.

Server contracts:

- ``GET  /v3/guard-model/stats`` — current model statistics.
- ``GET  /v3/guard-model/performance`` — performance metrics.
- ``POST /v3/guard-model/train`` — start a training run.
- ``GET  /v3/guard-model/train/status`` — current training run status.
- ``POST /v3/guard-model/train/cancel`` — cancel the current training run.
"""

from __future__ import annotations

from typing import Any, Dict

from aegis.resources._base import AsyncResource, SyncResource


class SyncGuardModel(SyncResource):

    def stats(self) -> Dict[str, Any]:
        return self._get("/v3/guard-model/stats")

    def performance(self) -> Dict[str, Any]:
        return self._get("/v3/guard-model/performance")

    def train(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return self._post("/v3/guard-model/train", json=body)

    def train_status(self) -> Dict[str, Any]:
        return self._get("/v3/guard-model/train/status")

    def train_cancel(self) -> Dict[str, Any]:
        return self._post("/v3/guard-model/train/cancel")


class AsyncGuardModel(AsyncResource):

    async def stats(self) -> Dict[str, Any]:
        return await self._get("/v3/guard-model/stats")

    async def performance(self) -> Dict[str, Any]:
        return await self._get("/v3/guard-model/performance")

    async def train(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return await self._post("/v3/guard-model/train", json=body)

    async def train_status(self) -> Dict[str, Any]:
        return await self._get("/v3/guard-model/train/status")

    async def train_cancel(self) -> Dict[str, Any]:
        return await self._post("/v3/guard-model/train/cancel")
