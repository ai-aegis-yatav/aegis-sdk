"""Models for evidence endpoints (V1)."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class Evidence(BaseModel):
    id: str
    judgment_id: str
    evidence_type: str
    content: Any
    hash: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: Optional[str] = None


class EvidenceVerification(BaseModel):
    id: str
    is_valid: bool
    hash_match: bool
    verified_at: str
    details: Optional[Dict[str, Any]] = None
