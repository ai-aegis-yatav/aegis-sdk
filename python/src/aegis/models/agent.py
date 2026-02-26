"""Models for agent security endpoints (V3)."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class AgentScanRequest(BaseModel):
    prompt: str
    tools: Optional[List[str]] = None
    context: Optional[Dict[str, Any]] = None
    scan_type: str = "full"


class AgentScanResponse(BaseModel):
    injection_detected: bool
    injection_type: Optional[str] = None
    confidence: float = 0.0
    dpi_results: Optional[Dict[str, Any]] = None
    ipi_results: Optional[Dict[str, Any]] = None
    recommendations: List[str] = Field(default_factory=list)
    details: Optional[Dict[str, Any]] = None


class ToolchainRequest(BaseModel):
    tools: List[Dict[str, Any]]
    execution_plan: Optional[List[str]] = None
    context: Optional[Dict[str, Any]] = None


class ToolchainResponse(BaseModel):
    is_safe: bool
    risk_level: str = "low"
    tool_risks: List[Dict[str, Any]] = Field(default_factory=list)
    chain_risks: List[Dict[str, Any]] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
