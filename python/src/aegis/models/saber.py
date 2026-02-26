"""Models for SABER endpoints (V3)."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class SaberEstimateRequest(BaseModel):
    content: str
    prior_alpha: float = 1.0
    prior_beta: float = 1.0
    context: Optional[Dict[str, Any]] = None


class SaberEstimateResponse(BaseModel):
    risk_estimate: float
    confidence_interval: List[float] = Field(default_factory=list)
    alpha: float
    beta: float
    details: Optional[Dict[str, Any]] = None


class SaberEvaluateRequest(BaseModel):
    content: str
    n_samples: int = 10
    defense: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = None


class SaberEvaluateResponse(BaseModel):
    safety_rate: float
    n_safe: int = 0
    n_total: int = 0
    confidence: float = 0.0
    samples: List[Dict[str, Any]] = Field(default_factory=list)
    details: Optional[Dict[str, Any]] = None


class SaberBudget(BaseModel):
    tau: float
    budget: int
    estimated_cost: Optional[float] = None
    details: Optional[Dict[str, Any]] = None


class SaberCompareRequest(BaseModel):
    content: str
    defenses: List[str]
    n_samples: int = 10
    parameters: Optional[Dict[str, Any]] = None


class SaberCompareResponse(BaseModel):
    rankings: List[Dict[str, Any]] = Field(default_factory=list)
    best_defense: str = ""
    details: Optional[Dict[str, Any]] = None
