"""Models for jailbreak detection endpoints (V2)."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class JailbreakDetectRequest(BaseModel):
    content: str
    detection_methods: Optional[List[str]] = None
    threshold: float = 0.5


class JailbreakType(BaseModel):
    name: str
    description: Optional[str] = None
    severity: str = "high"
    examples: List[str] = Field(default_factory=list)


class JailbreakDetectResponse(BaseModel):
    is_jailbreak: bool
    confidence: float
    jailbreak_type: Optional[str] = None
    matched_patterns: List[str] = Field(default_factory=list)
    details: Optional[Dict[str, Any]] = None
