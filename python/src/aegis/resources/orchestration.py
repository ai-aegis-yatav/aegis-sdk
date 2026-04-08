"""Orchestration resource — /v1/orchestration API group.

All `runs/*` endpoints always include v1/judge. v2/v3 detectors are layered
on top via in-process adapters (GuardNet / JBShield / CCFC / MULI / DPI / PII).
"""

from __future__ import annotations

from typing import Any, Dict, List, Literal, Optional

from aegis.resources._base import AsyncResource, SyncResource

Scenario = Literal[
    "basic", "standard", "full", "advanced", "agent", "anomaly", "pii"
]
Mode = Literal["balanced", "recall", "precision", "strict", "bayes", "auto"]
EnsembleAlgorithm = Literal[
    "max",
    "arith_mean",
    "weighted_mean",
    "noisy_or",
    "majority_vote",
    "log_odds_sum",
    "strict_consensus",
    "two_stage_veto",
    "hierarchical_cascade",
]
AnomalyAlgorithm = Literal["zscore", "moving_average", "iqr", "isolation_forest"]


def _run_body(
    content: str,
    mode: Optional[Mode] = None,
    algorithm: Optional[EnsembleAlgorithm] = None,
    weights: Optional[Dict[str, float]] = None,
    threshold: Optional[float] = None,
    scenario: Optional[Scenario] = None,
) -> Dict[str, Any]:
    body: Dict[str, Any] = {"content": content}
    if mode is not None:
        body["mode"] = mode
    if algorithm is not None:
        body["algorithm"] = algorithm
    if weights is not None:
        body["weights"] = weights
    if threshold is not None:
        body["threshold"] = threshold
    if scenario is not None:
        body["scenario"] = scenario
    return body


class SyncOrchestration(SyncResource):
    """Synchronous orchestration resource."""

    # ---- runs ----
    def _run(self, path: str, body: Dict[str, Any]) -> Dict[str, Any]:
        resp = self._post(path, json=body)
        return resp.get("decision", resp)

    def run(self, content: str, scenario: Scenario = "full", **kwargs: Any) -> Dict[str, Any]:
        return self._run(
            "/v1/orchestration/runs",
            _run_body(content, scenario=scenario, **kwargs),
        )

    def basic(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._run("/v1/orchestration/runs/basic", _run_body(content, **kwargs))

    def standard(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._run("/v1/orchestration/runs/standard", _run_body(content, **kwargs))

    def full(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._run("/v1/orchestration/runs/full", _run_body(content, **kwargs))

    def advanced(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._run("/v1/orchestration/runs/advanced", _run_body(content, **kwargs))

    def agent(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._run("/v1/orchestration/runs/agent", _run_body(content, **kwargs))

    def anomaly(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._run("/v1/orchestration/runs/anomaly", _run_body(content, **kwargs))

    def pii(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._run("/v1/orchestration/runs/pii", _run_body(content, **kwargs))

    def anomaly_timeseries(
        self,
        value: float,
        history: List[float],
        algorithm: AnomalyAlgorithm = "zscore",
    ) -> Dict[str, Any]:
        return self._post(
            "/v1/orchestration/runs/anomaly/timeseries",
            json={"value": value, "history": history, "algorithm": algorithm},
        )

    # ---- configs ----
    def get_config(self, tenant_id: str, scenario: Scenario) -> Dict[str, Any]:
        return self._get(f"/v1/orchestration/configs/{tenant_id}/{scenario}")

    def upsert_config(
        self,
        tenant_id: str,
        scenario: Scenario,
        algorithm: EnsembleAlgorithm,
        mode: Mode,
        weights: Optional[Dict[str, float]] = None,
        thresholds: Optional[Dict[str, float]] = None,
    ) -> Dict[str, Any]:
        body: Dict[str, Any] = {"algorithm": algorithm, "mode": mode}
        if weights is not None:
            body["weights"] = weights
        if thresholds is not None:
            body["thresholds"] = thresholds
        return self._put(
            f"/v1/orchestration/configs/{tenant_id}/{scenario}", json=body
        )

    # ---- gridsearch (synchronous smoke-test variant) ----
    def gridsearch(
        self,
        domain: str,
        scenario: Scenario,
        max_samples: Optional[int] = None,
    ) -> Dict[str, Any]:
        body: Dict[str, Any] = {"domain": domain, "scenario": scenario}
        if max_samples is not None:
            body["max_samples"] = max_samples
        return self._post("/v1/orchestration/gridsearch", json=body)

    # ---- gridsearch jobs (async, DB-persisted) ----
    def create_gridsearch_job(
        self,
        domain: str,
        scenario: Scenario,
        max_samples: Optional[int] = None,
    ) -> Dict[str, Any]:
        body: Dict[str, Any] = {"domain": domain, "scenario": scenario}
        if max_samples is not None:
            body["max_samples"] = max_samples
        return self._post("/v1/orchestration/gridsearch/jobs", json=body)

    def get_gridsearch_job(self, job_id: str) -> Dict[str, Any]:
        return self._get(f"/v1/orchestration/gridsearch/jobs/{job_id}")

    def list_gridsearch_results(self, job_id: str) -> List[Dict[str, Any]]:
        return self._get(f"/v1/orchestration/gridsearch/jobs/{job_id}/results")

    def promote_gridsearch_job(
        self, job_id: str, tenant_id: str, scenario: Scenario
    ) -> Dict[str, Any]:
        return self._post(
            f"/v1/orchestration/gridsearch/jobs/{job_id}/promote",
            json={"tenant_id": tenant_id, "scenario": scenario},
        )

    def list_datasets(self) -> List[Dict[str, Any]]:
        return self._get("/v1/orchestration/datasets")

    # ---- V3 Integrated Pipeline ----
    def pipeline_run(
        self,
        prompt: str,
        scenario_id: str = "custom",
        algorithms: Optional[List[str]] = None,
        category: str = "general",
        target_provider_id: Optional[str] = None,
        evolution_generations: int = 5,
        saber_trials: int = 50,
    ) -> Dict[str, Any]:
        body: Dict[str, Any] = {
            "prompt": prompt,
            "scenario_id": scenario_id,
            "category": category,
            "evolution_generations": evolution_generations,
            "saber_trials": saber_trials,
        }
        if algorithms is not None:
            body["algorithms"] = algorithms
        if target_provider_id is not None:
            body["target_provider_id"] = target_provider_id
        return self._post("/v3/pipeline/run", json=body)

    # ---- V3 Military Orchestrator ----
    def military_orchestrate(
        self,
        text: str,
        channel_level: int = 2,
        source_domain: str = "MilitaryNet",
        target_domain: str = "PublicNet",
        session_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        body: Dict[str, Any] = {
            "text": text,
            "channel_level": channel_level,
            "source_domain": source_domain,
            "target_domain": target_domain,
        }
        if session_id is not None:
            body["session_id"] = session_id
        return self._post("/v3/military/orchestrate", json=body)

    def military_status(self) -> Dict[str, Any]:
        return self._get("/v3/military/status")


class AsyncOrchestration(AsyncResource):
    """Asynchronous orchestration resource."""

    async def _run(self, path: str, body: Dict[str, Any]) -> Dict[str, Any]:
        resp = await self._post(path, json=body)
        return resp.get("decision", resp)

    async def run(self, content: str, scenario: Scenario = "full", **kwargs: Any) -> Dict[str, Any]:
        return await self._run(
            "/v1/orchestration/runs",
            _run_body(content, scenario=scenario, **kwargs),
        )

    async def basic(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._run("/v1/orchestration/runs/basic", _run_body(content, **kwargs))

    async def standard(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._run("/v1/orchestration/runs/standard", _run_body(content, **kwargs))

    async def full(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._run("/v1/orchestration/runs/full", _run_body(content, **kwargs))

    async def advanced(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._run("/v1/orchestration/runs/advanced", _run_body(content, **kwargs))

    async def agent(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._run("/v1/orchestration/runs/agent", _run_body(content, **kwargs))

    async def anomaly(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._run("/v1/orchestration/runs/anomaly", _run_body(content, **kwargs))

    async def pii(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._run("/v1/orchestration/runs/pii", _run_body(content, **kwargs))

    async def anomaly_timeseries(
        self,
        value: float,
        history: List[float],
        algorithm: AnomalyAlgorithm = "zscore",
    ) -> Dict[str, Any]:
        return await self._post(
            "/v1/orchestration/runs/anomaly/timeseries",
            json={"value": value, "history": history, "algorithm": algorithm},
        )

    async def get_config(self, tenant_id: str, scenario: Scenario) -> Dict[str, Any]:
        return await self._get(f"/v1/orchestration/configs/{tenant_id}/{scenario}")

    async def upsert_config(
        self,
        tenant_id: str,
        scenario: Scenario,
        algorithm: EnsembleAlgorithm,
        mode: Mode,
        weights: Optional[Dict[str, float]] = None,
        thresholds: Optional[Dict[str, float]] = None,
    ) -> Dict[str, Any]:
        body: Dict[str, Any] = {"algorithm": algorithm, "mode": mode}
        if weights is not None:
            body["weights"] = weights
        if thresholds is not None:
            body["thresholds"] = thresholds
        return await self._put(
            f"/v1/orchestration/configs/{tenant_id}/{scenario}", json=body
        )

    async def gridsearch(
        self,
        domain: str,
        scenario: Scenario,
        max_samples: Optional[int] = None,
    ) -> Dict[str, Any]:
        body: Dict[str, Any] = {"domain": domain, "scenario": scenario}
        if max_samples is not None:
            body["max_samples"] = max_samples
        return await self._post("/v1/orchestration/gridsearch", json=body)

    async def create_gridsearch_job(
        self,
        domain: str,
        scenario: Scenario,
        max_samples: Optional[int] = None,
    ) -> Dict[str, Any]:
        body: Dict[str, Any] = {"domain": domain, "scenario": scenario}
        if max_samples is not None:
            body["max_samples"] = max_samples
        return await self._post("/v1/orchestration/gridsearch/jobs", json=body)

    async def get_gridsearch_job(self, job_id: str) -> Dict[str, Any]:
        return await self._get(f"/v1/orchestration/gridsearch/jobs/{job_id}")

    async def list_gridsearch_results(self, job_id: str) -> List[Dict[str, Any]]:
        return await self._get(f"/v1/orchestration/gridsearch/jobs/{job_id}/results")

    async def promote_gridsearch_job(
        self, job_id: str, tenant_id: str, scenario: Scenario
    ) -> Dict[str, Any]:
        return await self._post(
            f"/v1/orchestration/gridsearch/jobs/{job_id}/promote",
            json={"tenant_id": tenant_id, "scenario": scenario},
        )

    async def list_datasets(self) -> List[Dict[str, Any]]:
        return await self._get("/v1/orchestration/datasets")

    async def pipeline_run(
        self,
        prompt: str,
        scenario_id: str = "custom",
        algorithms: Optional[List[str]] = None,
        category: str = "general",
        target_provider_id: Optional[str] = None,
        evolution_generations: int = 5,
        saber_trials: int = 50,
    ) -> Dict[str, Any]:
        body: Dict[str, Any] = {
            "prompt": prompt,
            "scenario_id": scenario_id,
            "category": category,
            "evolution_generations": evolution_generations,
            "saber_trials": saber_trials,
        }
        if algorithms is not None:
            body["algorithms"] = algorithms
        if target_provider_id is not None:
            body["target_provider_id"] = target_provider_id
        return await self._post("/v3/pipeline/run", json=body)

    async def military_orchestrate(
        self,
        text: str,
        channel_level: int = 2,
        source_domain: str = "MilitaryNet",
        target_domain: str = "PublicNet",
        session_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        body: Dict[str, Any] = {
            "text": text,
            "channel_level": channel_level,
            "source_domain": source_domain,
            "target_domain": target_domain,
        }
        if session_id is not None:
            body["session_id"] = session_id
        return await self._post("/v3/military/orchestrate", json=body)

    async def military_status(self) -> Dict[str, Any]:
        return await self._get("/v3/military/status")
