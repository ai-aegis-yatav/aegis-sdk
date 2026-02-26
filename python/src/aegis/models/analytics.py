"""Models for analytics endpoints (V1)."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class AnalyticsQuery(BaseModel):
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    granularity: str = "day"
    interval: Optional[str] = None


class AnalyticsOverview(BaseModel):
    total_judgments: int = 0
    total_blocked: int = 0
    total_allowed: int = 0
    avg_latency_ms: Optional[float] = None
    risk_distribution: Dict[str, int] = Field(default_factory=dict)
    time_series: List[Dict[str, Any]] = Field(default_factory=list)
    defense_layers: List[Dict[str, Any]] = Field(default_factory=list)
    top_threats: List[Dict[str, Any]] = Field(default_factory=list)
