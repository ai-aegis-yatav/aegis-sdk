"""Client configuration."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, Optional


@dataclass
class ClientConfig:
    api_key: str
    base_url: str = "https://api.aiaegis.io"
    timeout: float = 30.0
    max_retries: int = 3
    retry_backoff_factor: float = 0.5
    custom_headers: Dict[str, str] = field(default_factory=dict)
    verify_ssl: bool = True
    api_version: Optional[str] = None

    def __post_init__(self) -> None:
        self.base_url = self.base_url.rstrip("/")
        if not self.api_key:
            raise ValueError("api_key is required")
