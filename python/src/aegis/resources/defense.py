"""Defense resource — V2 PALADIN, Trust, RAG, Circuit Breaker, Adaptive endpoints."""

from __future__ import annotations

from typing import Any, Dict, List

from aegis.resources._base import AsyncResource, SyncResource


class SyncDefense(SyncResource):

    def paladin_stats(self) -> Dict[str, Any]:
        return self._get("/v2/defense/paladin/stats")

    def enable_layer(self, layer_name: str) -> Dict[str, Any]:
        return self._post(f"/v2/defense/paladin/layer/{layer_name}/enable")

    def trust_validate(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v2/defense/trust/validate", json={"content": content, **kwargs})

    def trust_profile(self) -> Dict[str, Any]:
        return self._get("/v2/defense/trust/profile")

    def rag_detect(self, query: str, documents: List[str], **kwargs: Any) -> Dict[str, Any]:
        # Server expects {"content": "..."} for poisoning detection on a single string.
        return self._post(
            "/v2/defense/rag/detect",
            json={"content": query, "documents": documents, **kwargs},
        )

    def rag_secure_query(self, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v2/defense/rag/secure-query", json=kwargs)

    def circuit_breaker_evaluate(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post(
            "/v2/defense/circuit-breaker/evaluate",
            json={"content": content, **kwargs},
        )

    def circuit_breaker_status(self) -> Dict[str, Any]:
        return self._get("/v2/defense/circuit-breaker/status")

    def adaptive_evaluate(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post(
            "/v2/defense/adaptive/evaluate",
            json={"content": content, **kwargs},
        )

    def adaptive_learn(self, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v2/defense/adaptive/learn", json=kwargs)


class AsyncDefense(AsyncResource):

    async def paladin_stats(self) -> Dict[str, Any]:
        return await self._get("/v2/defense/paladin/stats")

    async def enable_layer(self, layer_name: str) -> Dict[str, Any]:
        return await self._post(f"/v2/defense/paladin/layer/{layer_name}/enable")

    async def trust_validate(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post(
            "/v2/defense/trust/validate", json={"content": content, **kwargs}
        )

    async def trust_profile(self) -> Dict[str, Any]:
        return await self._get("/v2/defense/trust/profile")

    async def rag_detect(
        self, query: str, documents: List[str], **kwargs: Any
    ) -> Dict[str, Any]:
        return await self._post(
            "/v2/defense/rag/detect",
            json={"content": query, "documents": documents, **kwargs},
        )

    async def rag_secure_query(self, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v2/defense/rag/secure-query", json=kwargs)

    async def circuit_breaker_evaluate(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post(
            "/v2/defense/circuit-breaker/evaluate",
            json={"content": content, **kwargs},
        )

    async def circuit_breaker_status(self) -> Dict[str, Any]:
        return await self._get("/v2/defense/circuit-breaker/status")

    async def adaptive_evaluate(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post(
            "/v2/defense/adaptive/evaluate",
            json={"content": content, **kwargs},
        )

    async def adaptive_learn(self, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v2/defense/adaptive/learn", json=kwargs)
