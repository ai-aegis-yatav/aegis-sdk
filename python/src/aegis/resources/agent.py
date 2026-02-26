"""Agent resource — V3 agent security endpoints."""

from __future__ import annotations

from typing import Any, Dict

from aegis.models.agent import (
    AgentScanRequest,
    AgentScanResponse,
    ToolchainRequest,
    ToolchainResponse,
)
from aegis.resources._base import AsyncResource, SyncResource


class SyncAgent(SyncResource):

    def scan(self, prompt: str, **kwargs: Any) -> AgentScanResponse:
        req = AgentScanRequest(prompt=prompt, **kwargs)
        data = self._post("/v3/agent/scan", json=req.model_dump(exclude_none=True))
        return AgentScanResponse.model_validate(data)

    def toolchain(self, tools: list[Dict[str, Any]], **kwargs: Any) -> ToolchainResponse:
        req = ToolchainRequest(tools=tools, **kwargs)
        data = self._post("/v3/agent/toolchain", json=req.model_dump(exclude_none=True))
        return ToolchainResponse.model_validate(data)

    def memory_poisoning(self, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v3/agent/memory-poisoning", json=kwargs)

    def reasoning_hijack(self, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v3/agent/reasoning-hijack", json=kwargs)

    def tool_disguise(self, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v3/agent/tool-disguise", json=kwargs)


class AsyncAgent(AsyncResource):

    async def scan(self, prompt: str, **kwargs: Any) -> AgentScanResponse:
        req = AgentScanRequest(prompt=prompt, **kwargs)
        data = await self._post("/v3/agent/scan", json=req.model_dump(exclude_none=True))
        return AgentScanResponse.model_validate(data)

    async def toolchain(
        self, tools: list[Dict[str, Any]], **kwargs: Any
    ) -> ToolchainResponse:
        req = ToolchainRequest(tools=tools, **kwargs)
        data = await self._post("/v3/agent/toolchain", json=req.model_dump(exclude_none=True))
        return ToolchainResponse.model_validate(data)

    async def memory_poisoning(self, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v3/agent/memory-poisoning", json=kwargs)

    async def reasoning_hijack(self, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v3/agent/reasoning-hijack", json=kwargs)

    async def tool_disguise(self, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v3/agent/tool-disguise", json=kwargs)
