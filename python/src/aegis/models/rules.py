"""Models for rules endpoints (V1)."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class RuleCreateRequest(BaseModel):
    name: str
    pattern: str
    pattern_type: str = "regex"
    action: str
    severity: str = "medium"
    category: str = "General"
    description: Optional[str] = None
    priority: int = 100
    enabled: bool = True


class RuleUpdateRequest(BaseModel):
    name: Optional[str] = None
    pattern: Optional[str] = None
    pattern_type: Optional[str] = None
    action: Optional[str] = None
    severity: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[int] = None
    enabled: Optional[bool] = None


class Rule(BaseModel):
    id: str
    name: str
    pattern: str
    pattern_type: str = "regex"
    action: str
    severity: str = "medium"
    category: str = "General"
    description: Optional[str] = None
    priority: int = 100
    enabled: bool = True
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class RuleTestRequest(BaseModel):
    content: str
    rule_ids: Optional[List[str]] = None


class RuleTestResponse(BaseModel):
    matched: bool
    matched_rules: List[Dict[str, Any]] = Field(default_factory=list)
    details: Optional[Dict[str, Any]] = None
