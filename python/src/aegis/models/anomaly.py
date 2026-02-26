"""Models for anomaly detection endpoints (V3)."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class AnomalyAlgorithm(BaseModel):
    name: str
    description: Optional[str] = None
    parameters: Dict[str, Any] = Field(default_factory=dict)


class AnomalyDetectRequest(BaseModel):
    metric: str
    algorithm: str = "zscore"
    data_range: Optional[Dict[str, Any]] = None
    parameters: Optional[Dict[str, Any]] = None


class AnomalyDetectResponse(BaseModel):
    anomalies_detected: int
    anomalies: List[Dict[str, Any]] = Field(default_factory=list)
    algorithm: str
    threshold: float = 0.0
    details: Optional[Dict[str, Any]] = None


class AnomalyEvent(BaseModel):
    id: str
    metric: str
    value: float
    expected_value: float
    deviation: float
    severity: str = "medium"
    detected_at: str
    details: Optional[Dict[str, Any]] = None


class AnomalyStats(BaseModel):
    total_events: int = 0
    by_severity: Dict[str, int] = Field(default_factory=dict)
    by_metric: Dict[str, int] = Field(default_factory=dict)
    avg_deviation: Optional[float] = None
