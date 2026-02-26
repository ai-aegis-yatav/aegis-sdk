"""Models for ML inference endpoints (V1)."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class EmbedRequest(BaseModel):
    text: str
    model: Optional[str] = None


class EmbedBatchRequest(BaseModel):
    texts: List[str]
    model: Optional[str] = None


class EmbedResponse(BaseModel):
    embedding: List[float]
    model: str
    dimensions: int


class ClassifyRequest(BaseModel):
    text: str
    labels: Optional[List[str]] = None
    model: Optional[str] = None


class ClassifyResponse(BaseModel):
    label: str
    confidence: float
    scores: Dict[str, float] = Field(default_factory=dict)


class SimilarityRequest(BaseModel):
    query: str
    documents: List[str]
    top_k: int = 5
    model: Optional[str] = None


class SimilarityResponse(BaseModel):
    results: List[Dict[str, Any]] = Field(default_factory=list)
    model: str = ""
