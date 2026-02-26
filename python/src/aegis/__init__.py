"""AEGIS Defense API SDK for Python."""

from aegis.client import AegisClient, AsyncAegisClient
from aegis.config import ClientConfig
from aegis.errors import (
    AegisError,
    AuthenticationError,
    NetworkError,
    NotFoundError,
    QuotaExceededError,
    RateLimitError,
    ServerError,
    TierAccessError,
    ValidationError,
)

__version__ = "0.1.0"
__all__ = [
    "AegisClient",
    "AsyncAegisClient",
    "ClientConfig",
    "AegisError",
    "AuthenticationError",
    "TierAccessError",
    "QuotaExceededError",
    "RateLimitError",
    "ValidationError",
    "NotFoundError",
    "ServerError",
    "NetworkError",
]
