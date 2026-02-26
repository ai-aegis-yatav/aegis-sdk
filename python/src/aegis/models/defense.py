"""Models for defense endpoints (V2)."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class PaladinStats(BaseModel):
    total_evaluations: int = 0
    layers: List[Dict[str, Any]] = Field(default_factory=list)
    avg_latency_ms: Optional[float] = None
    pass_rate: Optional[float] = None


class TrustValidateRequest(BaseModel):
    content: str
    context: Optional[Dict[str, Any]] = None
    source: Optional[str] = None


class TrustValidateResponse(BaseModel):
    trust_score: float
    is_trusted: bool
    factors: List[Dict[str, Any]] = Field(default_factory=list)
    details: Optional[Dict[str, Any]] = None


class TrustProfile(BaseModel):
    overall_score: float
    history: List[Dict[str, Any]] = Field(default_factory=list)
    factors: Dict[str, float] = Field(default_factory=dict)


class RagDetectRequest(BaseModel):
    query: str
    documents: List[str]
    context: Optional[Dict[str, Any]] = None


class RagDetectResponse(BaseModel):
    is_poisoned: bool
    poisoned_documents: List[int] = Field(default_factory=list)
    confidence: float = 0.0
    details: Optional[Dict[str, Any]] = None


class CircuitBreakerEvalRequest(BaseModel):
    content: str
    context: Optional[Dict[str, Any]] = None


class CircuitBreakerResponse(BaseModel):
    tripped: bool
    reason: Optional[str] = None
    severity: str = "low"
    details: Optional[Dict[str, Any]] = None


class CircuitBreakerStatus(BaseModel):
    state: str = "closed"
    failure_count: int = 0
    last_failure_at: Optional[str] = None
    cooldown_remaining_ms: Optional[int] = None


class AdaptiveEvalRequest(BaseModel):
    content: str
    history: Optional[List[Dict[str, Any]]] = None
    context: Optional[Dict[str, Any]] = None


class AdaptiveEvalResponse(BaseModel):
    threat_level: str = "low"
    adapted_defenses: List[str] = Field(default_factory=list)
    confidence: float = 0.0
    recommendations: List[str] = Field(default_factory=list)
    details: Optional[Dict[str, Any]] = None
