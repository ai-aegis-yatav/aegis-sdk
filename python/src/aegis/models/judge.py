"""Models for judgment endpoints (V1)."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class JudgeOptions(BaseModel):
    enable_streaming: bool = False
    fast_mode: bool = False
    skip_layers: List[str] = Field(default_factory=list)


class JudgeRequest(BaseModel):
    prompt: str
    context: Optional[Any] = None
    metadata: Optional[Dict[str, Any]] = None
    options: Optional[JudgeOptions] = None


class JudgeBatchRequest(BaseModel):
    requests: List[JudgeRequest]


class Risk(BaseModel):
    label: str
    severity: str
    description: Optional[str] = None
    score: Optional[float] = None
    categories: Optional[List[str]] = None


class DefenseLayer(BaseModel):
    name: str
    passed: bool
    latency_ms: Optional[float] = None
    details: Optional[Dict[str, Any]] = None


class JudgeResponse(BaseModel):
    id: str
    decision: str
    confidence: float
    risks: List[Risk] = Field(default_factory=list)
    layers: List[DefenseLayer] = Field(default_factory=list)
    latency_ms: Optional[float] = None


class JudgeStreamEvent(BaseModel):
    event_type: Optional[str] = None
    partial_decision: Optional[str] = None
    layer: Optional[DefenseLayer] = None
    risk: Optional[Risk] = None
    final_response: Optional[JudgeResponse] = None
    done: bool = False
