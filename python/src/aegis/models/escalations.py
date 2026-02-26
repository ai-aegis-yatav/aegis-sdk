"""Models for escalation endpoints (V1)."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class EscalationCreateRequest(BaseModel):
    judgment_id: str
    reason: str
    priority: Optional[int] = None


class EscalationResolveRequest(BaseModel):
    resolution: str
    notes: Optional[str] = None


class Escalation(BaseModel):
    id: str
    judgment_id: str
    reason: str
    status: str = "pending"
    priority: int = 0
    assigned_to: Optional[str] = None
    resolved_by: Optional[str] = None
    resolution: Optional[str] = None
    notes: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class EscalationStats(BaseModel):
    total: int = 0
    pending: int = 0
    in_review: int = 0
    resolved: int = 0
    average_resolution_time_ms: Optional[float] = None
    by_priority: Dict[str, int] = Field(default_factory=dict)
