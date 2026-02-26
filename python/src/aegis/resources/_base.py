"""Base resource class."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any, Dict, Optional

if TYPE_CHECKING:
    from aegis._transport import AsyncTransport, SyncTransport


class SyncResource:
    """Base class for synchronous API resources."""

    def __init__(self, transport: SyncTransport) -> None:
        self._transport = transport

    def _get(self, path: str, **kwargs: Any) -> Any:
        return self._transport.request("GET", path, **kwargs).data

    def _post(self, path: str, **kwargs: Any) -> Any:
        return self._transport.request("POST", path, **kwargs).data

    def _put(self, path: str, **kwargs: Any) -> Any:
        return self._transport.request("PUT", path, **kwargs).data

    def _delete(self, path: str, **kwargs: Any) -> Any:
        return self._transport.request("DELETE", path, **kwargs).data

    def _list(
        self, path: str, params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        return self._transport.request("GET", path, params=params).data


class AsyncResource:
    """Base class for asynchronous API resources."""

    def __init__(self, transport: AsyncTransport) -> None:
        self._transport = transport

    async def _get(self, path: str, **kwargs: Any) -> Any:
        resp = await self._transport.request("GET", path, **kwargs)
        return resp.data

    async def _post(self, path: str, **kwargs: Any) -> Any:
        resp = await self._transport.request("POST", path, **kwargs)
        return resp.data

    async def _put(self, path: str, **kwargs: Any) -> Any:
        resp = await self._transport.request("PUT", path, **kwargs)
        return resp.data

    async def _delete(self, path: str, **kwargs: Any) -> Any:
        resp = await self._transport.request("DELETE", path, **kwargs)
        return resp.data

    async def _list(
        self, path: str, params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        resp = await self._transport.request("GET", path, params=params)
        return resp.data
