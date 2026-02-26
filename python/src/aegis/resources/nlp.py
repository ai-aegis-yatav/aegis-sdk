"""NLP resource — V1 natural language processing endpoints."""

from __future__ import annotations

from typing import Any, Dict

from aegis.resources._base import AsyncResource, SyncResource


class SyncNLP(SyncResource):

    def detect_language(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v1/nlp/detect-language", json={"content": content, **kwargs})

    def detect_jailbreak(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v1/nlp/detect-jailbreak", json={"content": content, **kwargs})

    def detect_harmful(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v1/nlp/detect-harmful", json={"content": content, **kwargs})


class AsyncNLP(AsyncResource):

    async def detect_language(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post(
            "/v1/nlp/detect-language", json={"content": content, **kwargs}
        )

    async def detect_jailbreak(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post(
            "/v1/nlp/detect-jailbreak", json={"content": content, **kwargs}
        )

    async def detect_harmful(self, content: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post(
            "/v1/nlp/detect-harmful", json={"content": content, **kwargs}
        )
