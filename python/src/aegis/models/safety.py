"""Models for safety check endpoints (V2)."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class SafetyCheckRequest(BaseModel):
    content: str
    categories: Optional[List[str]] = None
    backend: Optional[str] = None
    threshold: float = 0.5


class SafetyCategory(BaseModel):
    name: str
    description: Optional[str] = None
    severity: str = "medium"


class SafetyCheckResponse(BaseModel):
    is_safe: bool
    overall_score: float
    categories: List[Dict[str, Any]] = Field(default_factory=list)
    flagged_categories: List[str] = Field(default_factory=list)
    backend: str = ""
    details: Optional[Dict[str, Any]] = None
