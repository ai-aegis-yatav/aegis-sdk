"""Evolution resource — V3 attack evolution engine endpoints."""

from __future__ import annotations

from typing import Any, Dict

from aegis.models.evolution import (
    EvolutionGenerateRequest,
    EvolutionGenerateResponse,
    EvolutionStats,
)
from aegis.resources._base import AsyncResource, SyncResource


class SyncEvolution(SyncResource):

    def generate(self, seed_prompt: str, **kwargs: Any) -> EvolutionGenerateResponse:
        req = EvolutionGenerateRequest(seed_prompt=seed_prompt, **kwargs)
        data = self._post("/v3/evolution/generate", json=req.model_dump(exclude_none=True))
        return EvolutionGenerateResponse.model_validate(data)

    def evolve(self, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v3/evolution/evolve", json=kwargs)

    def stats(self) -> EvolutionStats:
        return EvolutionStats.model_validate(self._get("/v3/evolution/stats"))


class AsyncEvolution(AsyncResource):

    async def generate(self, seed_prompt: str, **kwargs: Any) -> EvolutionGenerateResponse:
        req = EvolutionGenerateRequest(seed_prompt=seed_prompt, **kwargs)
        data = await self._post(
            "/v3/evolution/generate", json=req.model_dump(exclude_none=True)
        )
        return EvolutionGenerateResponse.model_validate(data)

    async def evolve(self, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v3/evolution/evolve", json=kwargs)

    async def stats(self) -> EvolutionStats:
        return EvolutionStats.model_validate(await self._get("/v3/evolution/stats"))
