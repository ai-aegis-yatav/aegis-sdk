"""Models for classification endpoints (V2)."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class ContentClassifyRequest(BaseModel):
    content: str
    categories: Optional[List[str]] = None
    threshold: float = 0.5
    model: Optional[str] = None


class ClassifyCategory(BaseModel):
    name: str
    description: Optional[str] = None
    parent: Optional[str] = None


class ContentClassifyResponse(BaseModel):
    category: str
    confidence: float
    sub_categories: List[Dict[str, Any]] = Field(default_factory=list)
    scores: Dict[str, float] = Field(default_factory=dict)
    model: str = ""
