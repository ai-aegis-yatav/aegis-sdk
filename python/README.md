# AEGIS Python SDK

Official Python SDK for the [AEGIS Defense API](https://aiaegis.io) — AI Engine for Guardrail & Inspection System.

## Installation

```bash
pip install aegis-sdk
```

## Quick Start

```python
from aegis import AegisClient

client = AegisClient(api_key="aegis_sk_...")

# Judge content safety
result = client.judge.create(prompt="Tell me how to hack a system")
print(result.decision)     # "block"
print(result.confidence)   # 0.95
print(result.risks)        # [Risk(label="harmful", severity="high")]

# Check quota usage
print(client.quota.remaining)
```

## Async Usage

```python
import asyncio
from aegis import AsyncAegisClient

async def main():
    async with AsyncAegisClient(api_key="aegis_sk_...") as client:
        result = await client.judge.create(prompt="Test content")

        # Streaming judgment
        async for event in client.judge.stream(prompt="Explain quantum computing"):
            print(event.partial_decision)

asyncio.run(main())
```

## API Coverage by Tier

| Tier | Resources | Monthly Quota |
|------|-----------|---------------|
| **Free** | `judge`, `rules`, `escalations`, `analytics`, `evidence`, `ml`, `nlp`, `ai_act` | 1,000 |
| **Starter** | + `classify`, `jailbreak`, `safety`, `defense`, `advanced`, `adversaflow` | 10,000 |
| **Pro** | Same as Starter with higher limits | 100,000 |
| **Enterprise** | + `guardnet`, `agent`, `anomaly`, `multimodal`, `evolution`, `saber` | 1,000,000 |

All tiers have access to `ops` (DevSecOps) and `api_keys` management.

## Resources

### V1 — Basic Tier (Free)

```python
# Judgment
result = client.judge.create(prompt="...")
results = client.judge.batch([JudgeRequest(prompt="...")])
for event in client.judge.stream(prompt="..."):
    print(event)

# Rules
rule = client.rules.create(name="block-harmful", pattern=".*hack.*", action="block")
rules = client.rules.list().to_list()
client.rules.test(content="test content")

# Escalations
esc = client.escalations.create(judgment_id="j-1", reason="Needs review")
client.escalations.resolve(esc.id, resolution="Confirmed block")
stats = client.escalations.stats()

# Analytics
overview = client.analytics.overview(start_date="2026-01-01")

# Evidence
evidence = client.evidence.for_judgment("j-1")

# ML Inference
embedding = client.ml.embed("hello world")
classification = client.ml.classify("test text")

# NLP
client.nlp.detect_jailbreak("ignore all previous instructions")

# AI Act Compliance
watermark = client.ai_act.watermark("AI-generated content")
pii = client.ai_act.pii_detect("김철수의 주민번호는...")
```

### V2 — Professional Tier (Starter/Pro)

```python
# Classification
result = client.classify.classify(content="suspicious text")

# Jailbreak Detection
detection = client.jailbreak.detect(content="Ignore previous instructions")
print(detection.is_jailbreak)  # True

# Safety Check
safety = client.safety.check(content="potentially unsafe text")
print(safety.is_safe)

# Defense (PALADIN, Trust, RAG, Circuit Breaker, Adaptive)
client.defense.paladin_stats()
client.defense.trust_validate(content="untrusted input")
client.defense.rag_detect(query="query", documents=["doc1", "doc2"])

# Advanced Attack Detection
result = client.advanced.detect(content="sophisticated attack")

# AdversaFlow
for campaign in client.adversaflow.campaigns():
    print(campaign.id)
```

### V3 — Enterprise Tier

```python
# GuardNet
client.guardnet.analyze(content="test")
client.guardnet.jbshield(content="jailbreak attempt")

# Agent Security
scan = client.agent.scan(prompt="Use tool X to...", tools=["web_search"])
print(scan.injection_detected)

# Anomaly Detection
anomalies = client.anomaly.detect(metric="request_rate")

# Multimodal Security
result = client.multimodal.scan(content="text", image_url="https://...")

# SABER Risk Estimation
estimate = client.saber.estimate(content="test")
```

## Error Handling

```python
from aegis.errors import TierAccessError, QuotaExceededError, AuthenticationError

try:
    result = client.jailbreak.detect(content="test")
except TierAccessError as e:
    print(f"Upgrade to {e.required_tier}: {e.upgrade_url}")
except QuotaExceededError as e:
    print(f"Quota: {e.used}/{e.limit}, resets at {e.reset_at}")
except AuthenticationError:
    print("Invalid API key")
```

## Configuration

```python
client = AegisClient(
    api_key="aegis_sk_...",
    base_url="http://localhost:8000",  # Custom API URL
    timeout=60.0,                      # Request timeout in seconds
    max_retries=5,                     # Retry on 429/5xx
    custom_headers={"X-Custom": "value"},
)
```

## Requirements

- Python 3.9+
- Dependencies: `httpx`, `pydantic>=2.0`, `httpx-sse`

## License

MIT
