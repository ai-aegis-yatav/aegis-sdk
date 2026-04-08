"""Auto-pagination helpers for list endpoints."""

from __future__ import annotations

from typing import Any, AsyncIterator, Dict, Generic, Iterator, List, Optional, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class Page(BaseModel, Generic[T]):
    """A single page of results."""

    items: List[Any]
    total: int
    page: int
    limit: int
    has_more: bool = False


class SyncPaginator(Generic[T]):
    """Synchronous auto-paginating iterator."""

    def __init__(
        self,
        fetch_page: Any,
        params: Dict[str, Any],
        item_cls: type,
        items_key: Optional[str] = None,
    ) -> None:
        self._fetch_page = fetch_page
        self._params = params
        self._item_cls = item_cls
        self._items_key = items_key
        self._current_page = params.get("page", 1)
        self._buffer: List[Any] = []
        self._exhausted = False
        self._total: Optional[int] = None

    @property
    def total(self) -> Optional[int]:
        return self._total

    def __iter__(self) -> Iterator[T]:
        return self

    def __next__(self) -> T:
        if not self._buffer:
            if self._exhausted:
                raise StopIteration
            self._load_next_page()
            if not self._buffer:
                raise StopIteration
        return self._buffer.pop(0)

    def _extract_items(self, data: Any) -> List[Any]:
        if isinstance(data, list):
            return data
        if not isinstance(data, dict):
            return []
        if self._items_key and self._items_key in data:
            return data[self._items_key] or []
        for key in ("items", "results", "data", "events", "campaigns",
                    "rules", "judgments", "escalations", "evidence",
                    "api_keys", "templates"):
            v = data.get(key)
            if isinstance(v, list):
                return v
        return []

    def _load_next_page(self) -> None:
        params = {**self._params, "page": self._current_page}
        data = self._fetch_page(params)
        if isinstance(data, dict):
            self._total = data.get("total")
        items = self._extract_items(data)
        self._buffer = items
        has_more = (
            isinstance(data, dict)
            and data.get("has_more", len(items) >= params.get("limit", 20))
        )
        if not items or not has_more:
            self._exhausted = True
        self._current_page += 1

    def to_list(self) -> List[T]:
        return list(self)


class AsyncPaginator(Generic[T]):
    """Asynchronous auto-paginating iterator."""

    def __init__(
        self,
        fetch_page: Any,
        params: Dict[str, Any],
        item_cls: type,
        items_key: Optional[str] = None,
    ) -> None:
        self._fetch_page = fetch_page
        self._params = params
        self._item_cls = item_cls
        self._items_key = items_key
        self._current_page = params.get("page", 1)
        self._buffer: List[Any] = []
        self._exhausted = False
        self._total: Optional[int] = None

    @property
    def total(self) -> Optional[int]:
        return self._total

    def __aiter__(self) -> AsyncIterator[T]:
        return self

    async def __anext__(self) -> T:
        if not self._buffer:
            if self._exhausted:
                raise StopAsyncIteration
            await self._load_next_page()
            if not self._buffer:
                raise StopAsyncIteration
        return self._buffer.pop(0)

    def _extract_items(self, data: Any) -> List[Any]:
        if isinstance(data, list):
            return data
        if not isinstance(data, dict):
            return []
        if self._items_key and self._items_key in data:
            return data[self._items_key] or []
        for key in ("items", "results", "data", "events", "campaigns",
                    "rules", "judgments", "escalations", "evidence",
                    "api_keys", "templates"):
            v = data.get(key)
            if isinstance(v, list):
                return v
        return []

    async def _load_next_page(self) -> None:
        params = {**self._params, "page": self._current_page}
        data = await self._fetch_page(params)
        if isinstance(data, dict):
            self._total = data.get("total")
        items = self._extract_items(data)
        self._buffer = items
        has_more = (
            isinstance(data, dict)
            and data.get("has_more", len(items) >= params.get("limit", 20))
        )
        if not items or not has_more:
            self._exhausted = True
        self._current_page += 1

    async def to_list(self) -> List[T]:
        results: List[T] = []
        async for item in self:
            results.append(item)
        return results
