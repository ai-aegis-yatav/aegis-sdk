"""Models for AI Act compliance endpoints (V1)."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class WatermarkRequest(BaseModel):
    content: str
    watermark_type: str = "c2pa"
    metadata: Optional[Dict[str, Any]] = None


class WatermarkResponse(BaseModel):
    watermarked_content: str
    watermark_id: str
    verification_url: Optional[str] = None
    details: Optional[Dict[str, Any]] = None


class ComplianceVerifyRequest(BaseModel):
    content: str
    compliance_type: Optional[str] = None


class ComplianceVerifyResponse(BaseModel):
    is_compliant: bool
    violations: List[Dict[str, Any]] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    details: Optional[Dict[str, Any]] = None


class PiiDetectRequest(BaseModel):
    content: str
    locale: str = "ko"
    categories: Optional[List[str]] = None


class PiiDetectResponse(BaseModel):
    pii_found: bool
    entities: List[Dict[str, Any]] = Field(default_factory=list)
    redacted_content: Optional[str] = None
    details: Optional[Dict[str, Any]] = None


class RiskAssessRequest(BaseModel):
    system_description: str
    domain: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = None


class RiskAssessResponse(BaseModel):
    risk_level: str
    risk_score: float
    category: str
    requirements: List[str] = Field(default_factory=list)
    details: Optional[Dict[str, Any]] = None


class GuardrailCheckRequest(BaseModel):
    content: str
    guardrail_type: Optional[str] = None
    context: Optional[Dict[str, Any]] = None


class GuardrailCheckResponse(BaseModel):
    passed: bool
    violations: List[Dict[str, Any]] = Field(default_factory=list)
    risk_level: str = "low"
    details: Optional[Dict[str, Any]] = None
