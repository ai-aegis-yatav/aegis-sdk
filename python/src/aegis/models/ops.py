"""Models for DevSecOps endpoints (Ops)."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class CiGateRequest(BaseModel):
    test_suite: str
    thresholds: Optional[Dict[str, float]] = None
    parameters: Optional[Dict[str, Any]] = None


class CiGateResponse(BaseModel):
    passed: bool
    score: float
    results: List[Dict[str, Any]] = Field(default_factory=list)
    failures: List[Dict[str, Any]] = Field(default_factory=list)
    details: Optional[Dict[str, Any]] = None


class BenchmarkResult(BaseModel):
    benchmark_name: str
    score: float
    passed: bool
    metrics: Dict[str, Any] = Field(default_factory=dict)
    details: Optional[Dict[str, Any]] = None


class RedTeamStats(BaseModel):
    total_campaigns: int = 0
    total_attacks: int = 0
    success_rate: float = 0.0
    by_attack_type: Dict[str, int] = Field(default_factory=dict)
    recent_campaigns: List[Dict[str, Any]] = Field(default_factory=list)


class AttackLibraryEntry(BaseModel):
    id: str
    name: str
    category: str
    description: Optional[str] = None
    severity: str = "medium"
    examples: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
