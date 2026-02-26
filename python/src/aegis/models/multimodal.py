"""Models for multimodal security endpoints (V3)."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class MultimodalScanRequest(BaseModel):
    content: str
    content_type: str = "text"
    image_url: Optional[str] = None
    image_base64: Optional[str] = None
    scan_types: Optional[List[str]] = None
    context: Optional[Dict[str, Any]] = None


class MultimodalScanResponse(BaseModel):
    is_safe: bool
    threats: List[Dict[str, Any]] = Field(default_factory=list)
    modality_results: Dict[str, Any] = Field(default_factory=dict)
    overall_risk: float = 0.0
    details: Optional[Dict[str, Any]] = None
