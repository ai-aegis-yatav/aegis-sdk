"""Models for advanced attack detection endpoints (V2)."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class AdvancedDetectRequest(BaseModel):
    content: str
    attack_types: Optional[List[str]] = None
    context: Optional[Dict[str, Any]] = None


class AdvancedDetectResponse(BaseModel):
    detected: bool
    attack_type: Optional[str] = None
    confidence: float = 0.0
    attack_details: List[Dict[str, Any]] = Field(default_factory=list)
    mitigations: List[str] = Field(default_factory=list)
    details: Optional[Dict[str, Any]] = None
