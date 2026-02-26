"""SSE streaming helpers."""

from __future__ import annotations

import json
from typing import Any, AsyncIterator, Dict, Iterator, Optional


class SSEEvent:
    """A single Server-Sent Event."""

    def __init__(
        self,
        data: str,
        event: Optional[str] = None,
        id: Optional[str] = None,
        retry: Optional[int] = None,
    ) -> None:
        self.data = data
        self.event = event
        self.id = id
        self.retry = retry

    def json(self) -> Dict[str, Any]:
        return json.loads(self.data)

    def __repr__(self) -> str:
        return f"SSEEvent(event={self.event!r}, data={self.data[:80]!r})"


class SyncSSEStream:
    """Synchronous iterator over SSE events from an httpx streaming response."""

    def __init__(self, response: Any) -> None:
        self._response = response
        self._lines = response.iter_lines()

    def __iter__(self) -> Iterator[SSEEvent]:
        event_type: Optional[str] = None
        data_parts: list[str] = []
        event_id: Optional[str] = None

        for line in self._lines:
            if line.startswith("event:"):
                event_type = line[6:].strip()
            elif line.startswith("data:"):
                data_parts.append(line[5:].strip())
            elif line.startswith("id:"):
                event_id = line[3:].strip()
            elif line == "":
                if data_parts:
                    data = "\n".join(data_parts)
                    if data == "[DONE]":
                        break
                    yield SSEEvent(data=data, event=event_type, id=event_id)
                    data_parts = []
                    event_type = None
                    event_id = None

        if data_parts:
            data = "\n".join(data_parts)
            if data != "[DONE]":
                yield SSEEvent(data=data, event=event_type, id=event_id)

    def close(self) -> None:
        self._response.close()


class AsyncSSEStream:
    """Asynchronous iterator over SSE events from an httpx streaming response."""

    def __init__(self, response: Any) -> None:
        self._response = response
        self._lines = response.aiter_lines()

    def __aiter__(self) -> AsyncIterator[SSEEvent]:
        return self._iterate()

    async def _iterate(self) -> AsyncIterator[SSEEvent]:
        event_type: Optional[str] = None
        data_parts: list[str] = []
        event_id: Optional[str] = None

        async for line in self._lines:
            if line.startswith("event:"):
                event_type = line[6:].strip()
            elif line.startswith("data:"):
                data_parts.append(line[5:].strip())
            elif line.startswith("id:"):
                event_id = line[3:].strip()
            elif line == "":
                if data_parts:
                    data = "\n".join(data_parts)
                    if data == "[DONE]":
                        break
                    yield SSEEvent(data=data, event=event_type, id=event_id)
                    data_parts = []
                    event_type = None
                    event_id = None

        if data_parts:
            data = "\n".join(data_parts)
            if data != "[DONE]":
                yield SSEEvent(data=data, event=event_type, id=event_id)

    async def close(self) -> None:
        await self._response.aclose()
