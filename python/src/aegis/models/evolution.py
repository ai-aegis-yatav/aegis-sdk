"""Models for evolution engine endpoints (V3)."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class EvolutionGenerateRequest(BaseModel):
    seed_prompt: str
    attack_type: Optional[str] = None
    generations: int = 5
    population_size: int = 10
    mutation_rate: float = 0.3
    parameters: Optional[Dict[str, Any]] = None


class EvolutionGenerateResponse(BaseModel):
    id: str
    generated_attacks: List[Dict[str, Any]] = Field(default_factory=list)
    best_attack: Optional[Dict[str, Any]] = None
    fitness_scores: List[float] = Field(default_factory=list)
    generation: int = 0
    details: Optional[Dict[str, Any]] = None


class EvolutionStats(BaseModel):
    total_runs: int = 0
    total_generated: int = 0
    avg_fitness: Optional[float] = None
    best_fitness: Optional[float] = None
    by_attack_type: Dict[str, int] = Field(default_factory=dict)
