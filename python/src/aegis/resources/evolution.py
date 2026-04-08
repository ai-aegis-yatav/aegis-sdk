"""Evolution resource — V3 attack evolution engine endpoints."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from aegis.resources._base import AsyncResource, SyncResource


def _generate_body(
    seed_prompt: str,
    *,
    categories: Optional[List[str]] = None,
    attack_type: Optional[str] = None,
    count: int = 10,
    difficulty: str = "medium",
    include_multi_turn: bool = False,
    mutation_rate: Optional[float] = None,
    **kwargs: Any,
) -> Dict[str, Any]:
    body: Dict[str, Any] = {
        "target_behavior": seed_prompt,
        "categories": categories or ["jailbreak"],
        "count": count,
        "difficulty": difficulty,
        "include_multi_turn": include_multi_turn,
    }
    if attack_type is not None:
        body["attack_type"] = attack_type
    if mutation_rate is not None:
        body["mutation_rate"] = mutation_rate
    body.update(kwargs)
    return body


class SyncEvolution(SyncResource):

    def generate(self, seed_prompt: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post(
            "/v3/evolution/generate", json=_generate_body(seed_prompt, **kwargs)
        )

    def evolve(self, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v3/evolution/evolve", json=kwargs)

    def stats(self) -> Dict[str, Any]:
        return self._get("/v3/evolution/stats")


class AsyncEvolution(AsyncResource):

    async def generate(self, seed_prompt: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post(
            "/v3/evolution/generate", json=_generate_body(seed_prompt, **kwargs)
        )

    async def evolve(self, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v3/evolution/evolve", json=kwargs)

    async def stats(self) -> Dict[str, Any]:
        return await self._get("/v3/evolution/stats")
