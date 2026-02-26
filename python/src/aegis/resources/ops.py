"""Ops resource — DevSecOps EvalOps and RedTeam endpoints."""

from __future__ import annotations

from typing import Any, Dict, List

from aegis.models.ops import (
    AttackLibraryEntry,
    BenchmarkResult,
    CiGateRequest,
    CiGateResponse,
    RedTeamStats,
)
from aegis.resources._base import AsyncResource, SyncResource


class SyncOps(SyncResource):

    def ci_gate(self, test_suite: str, **kwargs: Any) -> CiGateResponse:
        req = CiGateRequest(test_suite=test_suite, **kwargs)
        data = self._post("/ops/evalops/ci-gate", json=req.model_dump(exclude_none=True))
        return CiGateResponse.model_validate(data)

    def benchmark(self, benchmark_name: str, **kwargs: Any) -> BenchmarkResult:
        data = self._post(f"/ops/evalops/benchmark/{benchmark_name}", json=kwargs)
        return BenchmarkResult.model_validate(data)

    def get_thresholds(self) -> Dict[str, Any]:
        return self._get("/ops/evalops/thresholds")

    def set_thresholds(self, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/ops/evalops/thresholds", json=kwargs)

    def github_action_check(self, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/ops/evalops/github-action-check", json=kwargs)

    def redteam_regression(self, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/ops/redteam/rr-regression", json=kwargs)

    def redteam_evolution_cycle(self, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/ops/redteam/evolution-cycle", json=kwargs)

    def redteam_stats(self) -> RedTeamStats:
        return RedTeamStats.model_validate(self._get("/ops/redteam/stats"))

    def redteam_continuous_evolution(self, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/ops/redteam/continuous-evolution", json=kwargs)

    def attack_library(self) -> List[AttackLibraryEntry]:
        data = self._get("/ops/redteam/attack-library")
        items = data if isinstance(data, list) else data.get("attacks", [])
        return [AttackLibraryEntry.model_validate(a) for a in items]

    def attack_library_by_category(self, category: str) -> List[AttackLibraryEntry]:
        data = self._get(f"/ops/redteam/attack-library/{category}")
        items = data if isinstance(data, list) else data.get("attacks", [])
        return [AttackLibraryEntry.model_validate(a) for a in items]


class AsyncOps(AsyncResource):

    async def ci_gate(self, test_suite: str, **kwargs: Any) -> CiGateResponse:
        req = CiGateRequest(test_suite=test_suite, **kwargs)
        data = await self._post(
            "/ops/evalops/ci-gate", json=req.model_dump(exclude_none=True)
        )
        return CiGateResponse.model_validate(data)

    async def benchmark(self, benchmark_name: str, **kwargs: Any) -> BenchmarkResult:
        data = await self._post(f"/ops/evalops/benchmark/{benchmark_name}", json=kwargs)
        return BenchmarkResult.model_validate(data)

    async def get_thresholds(self) -> Dict[str, Any]:
        return await self._get("/ops/evalops/thresholds")

    async def set_thresholds(self, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/ops/evalops/thresholds", json=kwargs)

    async def github_action_check(self, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/ops/evalops/github-action-check", json=kwargs)

    async def redteam_regression(self, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/ops/redteam/rr-regression", json=kwargs)

    async def redteam_evolution_cycle(self, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/ops/redteam/evolution-cycle", json=kwargs)

    async def redteam_stats(self) -> RedTeamStats:
        return RedTeamStats.model_validate(await self._get("/ops/redteam/stats"))

    async def redteam_continuous_evolution(self, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/ops/redteam/continuous-evolution", json=kwargs)

    async def attack_library(self) -> List[AttackLibraryEntry]:
        data = await self._get("/ops/redteam/attack-library")
        items = data if isinstance(data, list) else data.get("attacks", [])
        return [AttackLibraryEntry.model_validate(a) for a in items]

    async def attack_library_by_category(self, category: str) -> List[AttackLibraryEntry]:
        data = await self._get(f"/ops/redteam/attack-library/{category}")
        items = data if isinstance(data, list) else data.get("attacks", [])
        return [AttackLibraryEntry.model_validate(a) for a in items]
