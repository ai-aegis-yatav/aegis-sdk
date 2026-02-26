"""Models for API key management endpoints."""

from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class ApiKeyCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None
    scopes: List[str] = Field(default_factory=lambda: ["read"])
    expires_in_days: Optional[int] = None


class ApiKey(BaseModel):
    id: str
    name: str
    key_prefix: str
    key_preview: str
    scopes: List[str] = Field(default_factory=list)
    permissions: List[str] = Field(default_factory=list)
    created_at: Optional[str] = None
    last_used_at: Optional[str] = None
    expires_at: Optional[str] = None
    is_active: bool = True


class ApiKeyCreateResponse(ApiKey):
    """Extends ApiKey with the full key (only available at creation time)."""

    api_key: str
    key: str
