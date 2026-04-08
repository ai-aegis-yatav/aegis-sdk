"""Main AEGIS client classes."""

from __future__ import annotations

from typing import Any, Dict, Optional

from aegis._transport import AsyncTransport, QuotaInfo, SyncTransport
from aegis.config import ClientConfig
from aegis.resources.advanced import AsyncAdvanced, SyncAdvanced
from aegis.resources.adversaflow import AsyncAdversaFlow, SyncAdversaFlow
from aegis.resources.agent import AsyncAgent, SyncAgent
from aegis.resources.ai_act import AsyncAiAct, SyncAiAct
from aegis.resources.analytics import AsyncAnalytics, SyncAnalytics
from aegis.resources.anomaly import AsyncAnomaly, SyncAnomaly
from aegis.resources.api_keys import AsyncApiKeys, SyncApiKeys
from aegis.resources.classify import AsyncClassify, SyncClassify
from aegis.resources.defense import AsyncDefense, SyncDefense
from aegis.resources.escalations import AsyncEscalations, SyncEscalations
from aegis.resources.evidence import AsyncEvidence, SyncEvidence
from aegis.resources.evolution import AsyncEvolution, SyncEvolution
from aegis.resources.guardnet import AsyncGuardNet, SyncGuardNet
from aegis.resources.jailbreak import AsyncJailbreak, SyncJailbreak
from aegis.resources.judge import AsyncJudge, SyncJudge
from aegis.resources.ml import AsyncML, SyncML
from aegis.resources.multimodal import AsyncMultimodal, SyncMultimodal
from aegis.resources.nlp import AsyncNLP, SyncNLP
from aegis.resources.ops import AsyncOps, SyncOps
from aegis.resources.orchestration import AsyncOrchestration, SyncOrchestration
from aegis.resources.rules import AsyncRules, SyncRules
from aegis.resources.saber import AsyncSaber, SyncSaber
from aegis.resources.safety import AsyncSafety, SyncSafety


class AegisClient:
    """Synchronous AEGIS API client.

    Usage:
        client = AegisClient(api_key="aegis_sk_...")
        result = client.judge.create(prompt="Test content")
    """

    def __init__(
        self,
        api_key: str,
        *,
        base_url: str = "https://api.aiaegis.io",
        timeout: float = 30.0,
        max_retries: int = 3,
        custom_headers: Optional[Dict[str, str]] = None,
        **kwargs: Any,
    ) -> None:
        self._config = ClientConfig(
            api_key=api_key,
            base_url=base_url,
            timeout=timeout,
            max_retries=max_retries,
            custom_headers=custom_headers or {},
            **kwargs,
        )
        self._transport = SyncTransport(self._config)

        # V1 resources
        self.judge = SyncJudge(self._transport)
        self.rules = SyncRules(self._transport)
        self.escalations = SyncEscalations(self._transport)
        self.analytics = SyncAnalytics(self._transport)
        self.evidence = SyncEvidence(self._transport)
        self.ml = SyncML(self._transport)
        self.nlp = SyncNLP(self._transport)
        self.ai_act = SyncAiAct(self._transport)

        # V2 resources
        self.classify = SyncClassify(self._transport)
        self.jailbreak = SyncJailbreak(self._transport)
        self.safety = SyncSafety(self._transport)
        self.defense = SyncDefense(self._transport)
        self.advanced = SyncAdvanced(self._transport)
        self.adversaflow = SyncAdversaFlow(self._transport)

        # V3 resources
        self.guardnet = SyncGuardNet(self._transport)
        self.agent = SyncAgent(self._transport)
        self.anomaly = SyncAnomaly(self._transport)
        self.multimodal = SyncMultimodal(self._transport)
        self.evolution = SyncEvolution(self._transport)
        self.saber = SyncSaber(self._transport)

        # Ops resources
        self.ops = SyncOps(self._transport)

        # Management
        self.api_keys = SyncApiKeys(self._transport)

        # Orchestration (v1 always included)
        self.orchestration = SyncOrchestration(self._transport)

    @property
    def quota(self) -> QuotaInfo:
        return self._transport.quota

    def close(self) -> None:
        self._transport.close()

    def __enter__(self) -> AegisClient:
        return self

    def __exit__(self, *args: Any) -> None:
        self.close()


class AsyncAegisClient:
    """Asynchronous AEGIS API client.

    Usage:
        async with AsyncAegisClient(api_key="aegis_sk_...") as client:
            result = await client.judge.create(prompt="Test content")
    """

    def __init__(
        self,
        api_key: str,
        *,
        base_url: str = "https://api.aiaegis.io",
        timeout: float = 30.0,
        max_retries: int = 3,
        custom_headers: Optional[Dict[str, str]] = None,
        **kwargs: Any,
    ) -> None:
        self._config = ClientConfig(
            api_key=api_key,
            base_url=base_url,
            timeout=timeout,
            max_retries=max_retries,
            custom_headers=custom_headers or {},
            **kwargs,
        )
        self._transport = AsyncTransport(self._config)

        # V1 resources
        self.judge = AsyncJudge(self._transport)
        self.rules = AsyncRules(self._transport)
        self.escalations = AsyncEscalations(self._transport)
        self.analytics = AsyncAnalytics(self._transport)
        self.evidence = AsyncEvidence(self._transport)
        self.ml = AsyncML(self._transport)
        self.nlp = AsyncNLP(self._transport)
        self.ai_act = AsyncAiAct(self._transport)

        # V2 resources
        self.classify = AsyncClassify(self._transport)
        self.jailbreak = AsyncJailbreak(self._transport)
        self.safety = AsyncSafety(self._transport)
        self.defense = AsyncDefense(self._transport)
        self.advanced = AsyncAdvanced(self._transport)
        self.adversaflow = AsyncAdversaFlow(self._transport)

        # V3 resources
        self.guardnet = AsyncGuardNet(self._transport)
        self.agent = AsyncAgent(self._transport)
        self.anomaly = AsyncAnomaly(self._transport)
        self.multimodal = AsyncMultimodal(self._transport)
        self.evolution = AsyncEvolution(self._transport)
        self.saber = AsyncSaber(self._transport)

        # Ops resources
        self.ops = AsyncOps(self._transport)

        # Management
        self.api_keys = AsyncApiKeys(self._transport)

        # Orchestration (v1 always included)
        self.orchestration = AsyncOrchestration(self._transport)

    @property
    def quota(self) -> QuotaInfo:
        return self._transport.quota

    async def close(self) -> None:
        await self._transport.close()

    async def __aenter__(self) -> AsyncAegisClient:
        return self

    async def __aexit__(self, *args: Any) -> None:
        await self.close()
