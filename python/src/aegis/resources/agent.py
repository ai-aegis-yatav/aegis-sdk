"""Agent resource — V3 agent security endpoints.

Server expects ``prompt`` (or ``agent_input``), ``external_data`` (array of
strings, also accepted as ``tools``), ``session_id``, ``user_id``, optional
``agent_type`` and ``context``.
"""

from __future__ import annotations

import uuid
from typing import Any, Dict, List, Optional

from aegis.resources._base import AsyncResource, SyncResource


def _scan_body(
    prompt: str,
    *,
    external_data: Optional[List[str]] = None,
    session_id: Optional[str] = None,
    user_id: Optional[str] = None,
    agent_type: Optional[str] = None,
    context: Optional[Dict[str, Any]] = None,
    **kwargs: Any,
) -> Dict[str, Any]:
    body: Dict[str, Any] = {
        "prompt": prompt,
        "external_data": external_data or [],
        "session_id": session_id or str(uuid.uuid4()),
        "user_id": user_id or "sdk-smoke",
    }
    if agent_type is not None:
        body["agent_type"] = agent_type
    if context is not None:
        body["context"] = context
    body.update(kwargs)
    return body


class SyncAgent(SyncResource):

    def scan(self, prompt: str, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v3/agent/scan", json=_scan_body(prompt, **kwargs))

    def toolchain(self, tools: List[Dict[str, Any]], **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v3/agent/toolchain", json={"tools": tools, **kwargs})

    def memory_poisoning(self, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v3/agent/memory-poisoning", json=kwargs)

    def reasoning_hijack(self, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v3/agent/reasoning-hijack", json=kwargs)

    def tool_disguise(self, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v3/agent/tool-disguise", json=kwargs)


class AsyncAgent(AsyncResource):

    async def scan(self, prompt: str, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v3/agent/scan", json=_scan_body(prompt, **kwargs))

    async def toolchain(self, tools: List[Dict[str, Any]], **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v3/agent/toolchain", json={"tools": tools, **kwargs})

    async def memory_poisoning(self, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v3/agent/memory-poisoning", json=kwargs)

    async def reasoning_hijack(self, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v3/agent/reasoning-hijack", json=kwargs)

    async def tool_disguise(self, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v3/agent/tool-disguise", json=kwargs)
