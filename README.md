# AEGIS SDK

Official SDKs for the [AEGIS Defense](https://aiaegis.io) — AI Engine for Guardrail & Inspection System.

Comprehensive AI security platform providing multi-tier defense capabilities for LLM applications.

## Installation

모든 SDK는 GitHub 저장소를 통해 직접 설치합니다.

### Go

```bash
go get github.com/ai-aegis-yatav/aegis-sdk/go@latest
```

### Python

```bash
pip install git+https://github.com/ai-aegis-yatav/aegis-sdk.git#subdirectory=python
```

### JavaScript / TypeScript

```bash
npm install git+https://github.com/ai-aegis-yatav/aegis-sdk.git
```

### Rust

`Cargo.toml`에 다음을 추가합니다:

```toml
[dependencies]
aegis-sdk = { git = "https://github.com/ai-aegis-yatav/aegis-sdk.git" }
```

### Java

`build.gradle.kts`:

```kotlin
repositories {
    mavenCentral()
    maven { url = uri("https://jitpack.io") }
}

dependencies {
    implementation("com.github.ai-aegis-yatav:aegis-sdk:main-SNAPSHOT")
}
```

`pom.xml` (Maven):

```xml
<repositories>
    <repository>
        <id>jitpack.io</id>
        <url>https://jitpack.io</url>
    </repository>
</repositories>

<dependency>
    <groupId>com.github.ai-aegis-yatav</groupId>
    <artifactId>aegis-sdk</artifactId>
    <version>main-SNAPSHOT</version>
</dependency>
```

## Getting Started

### 1. API Key 발급

[AEGIS Dashboard](https://app.aiaegis.io)에서 API Key를 발급받으세요.

1. Dashboard 로그인 → **API Keys** 메뉴
2. **Create API Key** 클릭
3. 발급된 `aegis_sk_...` 형식의 키를 안전하게 보관

> API Key에 `tenant_id`, `user_id` 등의 식별 정보가 포함되어 있으므로 별도의 인증 파라미터 없이 키만으로 모든 API 기능을 사용할 수 있습니다.

### 2. Quick Start

#### JavaScript / TypeScript

```typescript
import { AegisClient } from '@aegis-ai/sdk';

const client = new AegisClient({ apiKey: 'aegis_sk_...' });

const result = await client.judge.create({
  prompt: 'Tell me how to hack a system',
});
console.log(result.decision); // "block"
```

#### Python

```python
from aegis import AegisClient

client = AegisClient(api_key="aegis_sk_...")

result = client.judge.create(prompt="Tell me how to hack a system")
print(result.decision)  # "block"
```

#### Go

```go
package main

import (
    "context"
    "fmt"
    aegis "github.com/ai-aegis-yatav/aegis-sdk/go"
)

func main() {
    client := aegis.NewClient("aegis_sk_...")

    result, err := client.Judge.Create(context.Background(), &aegis.JudgeRequest{
        Prompt: "Tell me how to hack a system",
    })
    if err != nil {
        panic(err)
    }
    fmt.Println(result.Decision) // "block"
}
```

#### Rust

```rust
use aegis_sdk::AegisClient;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = AegisClient::new("aegis_sk_...")?;

    let result = client.judge().create("Tell me how to hack a system").await?;
    println!("{}", result.decision); // "block"
    Ok(())
}
```

#### Java

```java
import ai.aegis.sdk.AegisClient;

var client = AegisClient.builder()
    .apiKey("aegis_sk_...")
    .build();

var result = client.judge().create(
    new JudgeRequest.Builder().prompt("Tell me how to hack a system").build()
);
System.out.println(result.getDecision()); // "block"
```

### 3. API 직접 호출

SDK 없이 HTTP API를 직접 호출할 수도 있습니다:

```bash
curl -X POST https://api.aiaegis.io/v3/judge \
  -H "X-API-Key: aegis_sk_..." \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Tell me how to hack a system"}'
```

## Defense Tiers

### Basic Tier
- **Judgment Engine** — Real-time AI output validation with PALADIN pipeline
- **Rules Management** — Dynamic rule-based filtering and pattern matching
- **Escalation System** — Human-in-the-loop review workflow
- **Evidence Collection** — Comprehensive audit trail
- **Analytics** — Real-time metrics and performance monitoring
- **ML Inference** — Model inference for embeddings and classification
- **NLP Processing** — Natural language analysis and threat detection
- **AI Act Compliance** — Korean AI Basic Act 2026 compliance suite

### Professional Tier
- **Classification Engine** — Class-RAG semantic categorization
- **Jailbreak Detection** — Multi-pattern jailbreak attempt identification
- **Safety Validation** — Comprehensive content safety checks
- **Advanced Attacks** — Detection of sophisticated attack patterns
- **PALADIN Control** — Fine-grained defense layer management
- **AdversaFlow** — Attack campaign tracking and visualization

### Enterprise Tier
- **GuardNet** — Graph-based hierarchical threat detection
- **Agent Security** — DPI/IPI protection for AI agents
- **Anomaly Detection** — Time-series behavioral analysis
- **Multimodal Security** — Cross-modal attack detection
- **Evolution Engine** — Genetic algorithm-based attack generation
- **SABER** — Bayesian risk estimation framework

## Integrations

### OpenClaw — AI Agent Defense Plugin

`@aegis-ai/guard-openclaw` is an enterprise-grade AI agent defense plugin for [OpenClaw](https://github.com/openclaw/openclaw) (>=2026.2). It integrates the AEGIS PALADIN 6-layer defense pipeline into the OpenClaw lifecycle with zero code changes.

#### Install

```bash
npm install git+https://github.com/ai-aegis-yatav/aegis-sdk.git#subdirectory=integrations/openclaw
```

#### Quick Start

```bash
# 1. Add to claw.json
echo '{ "plugins": ["@aegis-ai/guard-openclaw"] }' > claw.json

# 2. Set API key
export AEGIS_API_KEY="aegis_sk_..."

# 3. Start your agent — AEGIS Guard activates automatically
```

#### Defense Layers

| Layer | Hook | Detection |
|---|---|---|
| Inbound Guard | `preMessageProcess` | DPI / IPI (Direct & Indirect Prompt Injection) |
| Tool Guard | `preToolExecution` | STAC (Sequential Tool Abuse Chain) / iMIST |
| Output Guard | `postToolExecution` + `preMessageSend` | IPI in outputs, PII leaks, harmful content |
| Memory Guard | `preMemoryStore` | MINJA / InjecMEM / MemoryGraft |
| Reasoning Guard | `onAgentReasoning` | UDora / PoT / CoT hijacking |
| Heartbeat Guard | `heartbeat` | Anomaly detection (Isolation Forest) |

#### Guard Modes

| Mode | Block Threshold | Escalate Threshold | Behavior |
|---|---|---|---|
| `strict` | 0.30 | 0.15 | Aggressive blocking, minimal false negatives |
| `balanced` | 0.60 | 0.35 | Balanced precision / recall (recommended) |
| `permissive` | 0.85 | 0.55 | Warn-oriented, minimal false positives |

For full documentation, see [`integrations/openclaw/README.md`](./integrations/openclaw/README.md).

## Documentation

- **Full Documentation**: [docs.aiaegis.io](https://docs.aiaegis.io)
- **API Reference**: [docs.aiaegis.io/api](https://docs.aiaegis.io/api)
- **Dashboard**: [app.aiaegis.io](https://app.aiaegis.io)
- **OpenAPI Spec**: [`openapi/openapi.json`](./openapi/openapi.json)

## License
