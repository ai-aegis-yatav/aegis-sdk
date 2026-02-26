"""Models for AdversaFlow endpoints (V2)."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class AttackCampaign(BaseModel):
    id: str
    name: Optional[str] = None
    attack_type: str
    status: str = "active"
    total_attempts: int = 0
    successful_attempts: int = 0
    created_at: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class AttackRecord(BaseModel):
    campaign_id: str
    content: str
    result: str
    attack_type: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class AttackTrace(BaseModel):
    campaign_id: str
    steps: List[Dict[str, Any]] = Field(default_factory=list)
    timeline: List[Dict[str, Any]] = Field(default_factory=list)
    metrics: Dict[str, Any] = Field(default_factory=dict)
