# AEGIS SDK

Official SDKs for the [AEGIS Defense API](https://aiaegis.io) — AI Engine for Guardrail & Inspection System.

Comprehensive AI security platform providing multi-tier defense capabilities for LLM applications.

## Available SDKs

| Language | Package | Version | Install |
|----------|---------|---------|---------|
| **JavaScript/TypeScript** | [@aiaegis.io/sdk](./javascript/) | 0.1.0 | `npm install @aiaegis.io/sdk` |
| **Python** | [aegis-sdk](./python/) | 0.1.0 | `pip install aegis-sdk` |
| **Go** | [aegis/sdks/go](./go/) | 0.1.0 | `go get github.com/ai-aegis-yatav/aegis/sdks/go` |
| **Rust** | [aegis-sdk](./rust/) | 0.1.0 | `cargo add aegis-sdk` |
| **Java** | [ai.aegis:aegis-sdk](./java/) | 0.1.0 | Gradle / Maven |

## Quick Start

### JavaScript/TypeScript

```typescript
import { AegisClient } from '@aiaegis.io/sdk';

const client = new AegisClient({ apiKey: 'aegis_sk_...' });

const result = await client.judge.create({
  prompt: 'Tell me how to hack a system',
});
console.log(result.decision); // "block"
```

### Python

```python
from aegis import AegisClient

client = AegisClient(api_key="aegis_sk_...")

result = client.judge.create(prompt="Tell me how to hack a system")
print(result.decision)  # "block"
```

### Go

```go
package main

import (
    "context"
    "fmt"
    aegis "github.com/ai-aegis-yatav/aegis/sdks/go"
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

### Rust

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

### Java

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

## Getting Started

### 1. API Key 발급

[AEGIS Dashboard](https://dash.aiaegis.io)에서 API Key를 발급받으세요.

1. Dashboard 로그인 → **API Keys** 메뉴
2. **Create API Key** 클릭
3. 발급된 `aegis_sk_...` 형식의 키를 안전하게 보관

> API Key에 `tenant_id`, `user_id` 등의 식별 정보가 포함되어 있으므로 별도의 인증 파라미터 없이 키만으로 모든 API 기능을 사용할 수 있습니다.

### 2. SDK 설치 및 사용

각 언어별 설치 방법은 위의 [Available SDKs](#available-sdks) 테이블을 참조하세요. 설치 후 발급받은 API Key로 클라이언트를 초기화하면 바로 사용 가능합니다.

### 3. API 직접 호출

SDK 없이 HTTP API를 직접 호출할 수도 있습니다:

```bash
curl -X POST https://api.aiaegis.io/v3/judge \
  -H "X-API-Key: aegis_sk_..." \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Tell me how to hack a system"}'
```

## Documentation

- **Full Documentation**: [docs.aiaegis.io](https://docs.aiaegis.io)
- **API Reference**: [docs.aiaegis.io/api](https://docs.aiaegis.io/api)
- **Dashboard**: [dash.aiaegis.io](https://dash.aiaegis.io)
- **OpenAPI Spec**: [`openapi/openapi.json`](./openapi/openapi.json)

## Authentication

All API requests require authentication via:

```
X-API-Key: aegis_sk_...
```

## Release

SDK releases are managed via GitHub Actions. To trigger a release:

1. **Manual dispatch**: Go to Actions > SDK Release > Run workflow
2. **Tag-based**: Push a tag matching the SDK pattern:

| SDK | Tag Pattern | Example |
|-----|-------------|---------|
| JavaScript | `sdk-js-v*` | `sdk-js-v0.1.0` |
| Python | `sdk-python-v*` | `sdk-python-v0.1.0` |
| Rust | `sdk-rust-v*` | `sdk-rust-v0.1.0` |
| Go | `go/v*` | `go/v0.1.0` |
| Java | `sdk-java-v*` | `sdk-java-v0.1.0` |

## License

MIT
