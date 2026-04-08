"""Multimodal resource — V3 multimodal security endpoints."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from aegis.resources._base import AsyncResource, SyncResource


class SyncMultimodal(SyncResource):

    def scan(
        self,
        content: Optional[str] = None,
        *,
        image: Optional[Dict[str, Any]] = None,
        audio_transcription: Optional[str] = None,
        check_types: Optional[List[str]] = None,
        **kwargs: Any,
    ) -> Dict[str, Any]:
        body: Dict[str, Any] = {}
        if content is not None:
            body["text"] = content
        if image is not None:
            body["image"] = image
        if audio_transcription is not None:
            body["audio_transcription"] = audio_transcription
        if check_types is not None:
            body["check_types"] = check_types
        body.update(kwargs)
        return self._post("/v3/multimodal/scan", json=body)

    def image_attack(self, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v3/multimodal/image", json=kwargs)

    def viscra(self, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v3/multimodal/viscra", json=kwargs)

    def mml(self, **kwargs: Any) -> Dict[str, Any]:
        return self._post("/v3/multimodal/mml", json=kwargs)


class AsyncMultimodal(AsyncResource):

    async def scan(
        self,
        content: Optional[str] = None,
        *,
        image: Optional[Dict[str, Any]] = None,
        audio_transcription: Optional[str] = None,
        check_types: Optional[List[str]] = None,
        **kwargs: Any,
    ) -> Dict[str, Any]:
        body: Dict[str, Any] = {}
        if content is not None:
            body["text"] = content
        if image is not None:
            body["image"] = image
        if audio_transcription is not None:
            body["audio_transcription"] = audio_transcription
        if check_types is not None:
            body["check_types"] = check_types
        body.update(kwargs)
        return await self._post("/v3/multimodal/scan", json=body)

    async def image_attack(self, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v3/multimodal/image", json=kwargs)

    async def viscra(self, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v3/multimodal/viscra", json=kwargs)

    async def mml(self, **kwargs: Any) -> Dict[str, Any]:
        return await self._post("/v3/multimodal/mml", json=kwargs)
