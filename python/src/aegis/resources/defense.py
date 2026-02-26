"""Defense resource — V2 PALADIN, Trust, RAG, Circuit Breaker, Adaptive endpoints."""

from __future__ import annotations

from typing import Any, Dict, Optional

from aegis.models.defense import (
    AdaptiveEvalRequest,
    AdaptiveEvalResponse,
    CircuitBreakerEvalRequest,
    CircuitBreakerResponse,
    CircuitBreakerStatus,
    PaladinStats,
    RagDetectRequest,
    RagDetectResponse,
    TrustProfile,
    TrustValidateRequest,
    TrustValidateResponse,
)
from aegis.resources._base import AsyncResource, SyncResource


class SyncDefense(SyncResource):

    def paladin_stats(self) -> PaladinStats:
        return PaladinStats.model_validate(self._get("/v2/defense/paladin/stats"))

    def enable_layer(self, layer_name: str) -> Dict[str, Any]:
        return self._post(f"/v2/defense/paladin/layer/{layer_name}/enable")

    def trust_validate(self, content: str, **kwargs: Any) -> TrustValidateResponse:
        req = TrustValidateRequest(content=content, **kwargs)
        data = self._post("/v2/defense/trust/validate", json=req.model_dump(exclude_none=True))
        return TrustValidateResponse.model_validate(data)

    def trust_profile(self) -> TrustProfile:
        return TrustProfile.model_validate(self._get("/v2/defense/trust/profile"))

    def rag_detect(self, query: str, documents: list[str], **kwargs: Any) -> RagDetectResponse:
        req = RagDetectRequest(query=query, documents=documents, **kwargs)
        data = self._post("/v2/defense/rag/detect", json=req.model_dump(exclude_none=True))
        return RagDetectResponse.model_validate(data)

    def rag_secure_query(self, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v2/defense/rag/secure-query", json=kwargs)

    def circuit_breaker_evaluate(self, content: str, **kwargs: Any) -> CircuitBreakerResponse:
        req = CircuitBreakerEvalRequest(content=content, **kwargs)
        data = self._post(
            "/v2/defense/circuit-breaker/evaluate", json=req.model_dump(exclude_none=True)
        )
        return CircuitBreakerResponse.model_validate(data)

    def circuit_breaker_status(self) -> CircuitBreakerStatus:
        return CircuitBreakerStatus.model_validate(
            self._get("/v2/defense/circuit-breaker/status")
        )

    def adaptive_evaluate(self, content: str, **kwargs: Any) -> AdaptiveEvalResponse:
        req = AdaptiveEvalRequest(content=content, **kwargs)
        data = self._post(
            "/v2/defense/adaptive/evaluate", json=req.model_dump(exclude_none=True)
        )
        return AdaptiveEvalResponse.model_validate(data)

    def adaptive_learn(self, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v2/defense/adaptive/learn", json=kwargs)


class AsyncDefense(AsyncResource):

    async def paladin_stats(self) -> PaladinStats:
        return PaladinStats.model_validate(await self._get("/v2/defense/paladin/stats"))

    async def enable_layer(self, layer_name: str) -> Dict[str, Any]:
        return await self._post(f"/v2/defense/paladin/layer/{layer_name}/enable")

    async def trust_validate(self, content: str, **kwargs: Any) -> TrustValidateResponse:
        req = TrustValidateRequest(content=content, **kwargs)
        data = await self._post(
            "/v2/defense/trust/validate", json=req.model_dump(exclude_none=True)
        )
        return TrustValidateResponse.model_validate(data)

    async def trust_profile(self) -> TrustProfile:
        return TrustProfile.model_validate(await self._get("/v2/defense/trust/profile"))

    async def rag_detect(
        self, query: str, documents: list[str], **kwargs: Any
    ) -> RagDetectResponse:
        req = RagDetectRequest(query=query, documents=documents, **kwargs)
        data = await self._post(
            "/v2/defense/rag/detect", json=req.model_dump(exclude_none=True)
        )
        return RagDetectResponse.model_validate(data)

    async def rag_secure_query(self, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v2/defense/rag/secure-query", json=kwargs)

    async def circuit_breaker_evaluate(
        self, content: str, **kwargs: Any
    ) -> CircuitBreakerResponse:
        req = CircuitBreakerEvalRequest(content=content, **kwargs)
        data = await self._post(
            "/v2/defense/circuit-breaker/evaluate", json=req.model_dump(exclude_none=True)
        )
        return CircuitBreakerResponse.model_validate(data)

    async def circuit_breaker_status(self) -> CircuitBreakerStatus:
        return CircuitBreakerStatus.model_validate(
            await self._get("/v2/defense/circuit-breaker/status")
        )

    async def adaptive_evaluate(self, content: str, **kwargs: Any) -> AdaptiveEvalResponse:
        req = AdaptiveEvalRequest(content=content, **kwargs)
        data = await self._post(
            "/v2/defense/adaptive/evaluate", json=req.model_dump(exclude_none=True)
        )
        return AdaptiveEvalResponse.model_validate(data)

    async def adaptive_learn(self, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v2/defense/adaptive/learn", json=kwargs)
