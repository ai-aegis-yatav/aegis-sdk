"""DreamDojo resource — V3 embodied-agent validation endpoints.

Server contracts:

- ``POST /v3/dreamdojo/validate-action`` — validate an embodied action payload.
- ``POST /v3/dreamdojo/validate-input`` — validate raw sensor / instruction input.
- ``POST /v3/dreamdojo/validate-pipeline`` — validate a pipeline definition.
- ``POST /v3/dreamdojo/validate-latent`` — validate a latent-space representation.
- ``GET  /v3/dreamdojo/embodiments`` — list supported embodiments.
"""

from __future__ import annotations

from typing import Any, Dict

from aegis.resources._base import AsyncResource, SyncResource


class SyncDreamDojo(SyncResource):

    def validate_action(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return self._post("/v3/dreamdojo/validate-action", json=body)

    def validate_input(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return self._post("/v3/dreamdojo/validate-input", json=body)

    def validate_pipeline(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return self._post("/v3/dreamdojo/validate-pipeline", json=body)

    def validate_latent(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return self._post("/v3/dreamdojo/validate-latent", json=body)

    def embodiments(self) -> Dict[str, Any]:
        return self._get("/v3/dreamdojo/embodiments")


class AsyncDreamDojo(AsyncResource):

    async def validate_action(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return await self._post("/v3/dreamdojo/validate-action", json=body)

    async def validate_input(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return await self._post("/v3/dreamdojo/validate-input", json=body)

    async def validate_pipeline(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return await self._post("/v3/dreamdojo/validate-pipeline", json=body)

    async def validate_latent(self, body: Dict[str, Any]) -> Dict[str, Any]:
        return await self._post("/v3/dreamdojo/validate-latent", json=body)

    async def embodiments(self) -> Dict[str, Any]:
        return await self._get("/v3/dreamdojo/embodiments")
