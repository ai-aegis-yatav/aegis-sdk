# AEGIS Go SDK

Official Go SDK for the [AEGIS Defense API](https://aiaegis.io) — AI Engine for Guardrail & Inspection System.

[![Go Reference](https://pkg.go.dev/badge/github.com/ai-aegis-yatav/aegis/sdks/go.svg)](https://pkg.go.dev/github.com/ai-aegis-yatav/aegis/sdks/go)

## Installation

```bash
go get github.com/ai-aegis-yatav/aegis/sdks/go@v0.1.0
```

## Quick Start

```go
package main

import (
    "context"
    "fmt"

    aegis "github.com/ai-aegis-yatav/aegis/sdks/go"
)

func main() {
    client := aegis.NewClient("aegis_sk_...")

    ctx := context.Background()

    // Judge content safety
    result, err := client.Judge.Create(ctx, &aegis.JudgeRequest{
        Prompt: "Tell me how to hack a system",
    })
    if err != nil {
        panic(err)
    }
    fmt.Println(result.Decision)   // "block"
    fmt.Println(result.Confidence) // 0.95

    // Streaming
    stream, _ := client.Judge.Stream(ctx, &aegis.JudgeRequest{Prompt: "Test"})
    defer stream.Close()
    for stream.Next() {
        event := stream.Event()
        fmt.Println(event.PartialDecision)
    }

    // Quota
    fmt.Println(client.Quota())
}
```

## API Coverage by Tier

| Tier | Resources | Monthly Quota |
|------|-----------|---------------|
| **Free** | `Judge`, `Rules`, `Escalations`, `Analytics`, `Evidence`, `ML`, `NLP`, `AiAct` | 1,000 |
| **Starter** | + `Classify`, `Jailbreak`, `Safety`, `Defense`, `Advanced`, `AdversaFlow` | 10,000 |
| **Pro** | Same as Starter with higher limits | 100,000 |
| **Enterprise** | + `GuardNet`, `Agent`, `Anomaly`, `Multimodal`, `Evolution`, `Saber` | 1,000,000 |

All tiers have access to `Ops` (DevSecOps) and `ApiKeys` management.

## Resources

### V1 — Basic Tier (Free)

```go
ctx := context.Background()

// Judgment
result, _ := client.Judge.Create(ctx, &aegis.JudgeRequest{Prompt: "..."})
results, _ := client.Judge.Batch(ctx, []*aegis.JudgeRequest{{Prompt: "..."}})
stream, _ := client.Judge.Stream(ctx, &aegis.JudgeRequest{Prompt: "..."})

// Rules
rule, _ := client.Rules.Create(ctx, &models.RuleCreateRequest{
    Name: "block-harmful", Pattern: ".*hack.*", Action: "block",
})
rules, _ := client.Rules.List(ctx)
client.Rules.Test(ctx, "test content")

// Escalations
esc, _ := client.Escalations.Create(ctx, "j-1", "Needs review")
client.Escalations.Resolve(ctx, esc.ID, "Confirmed block")
stats, _ := client.Escalations.Stats(ctx)

// Analytics
overview, _ := client.Analytics.Overview(ctx, "2026-01-01")

// Evidence
evidence, _ := client.Evidence.ForJudgment(ctx, "j-1")

// ML Inference
embedding, _ := client.ML.Embed(ctx, "hello world")
classification, _ := client.ML.Classify(ctx, "test text")

// NLP
client.NLP.DetectJailbreak(ctx, "ignore all previous instructions")

// AI Act Compliance (Korean AI Basic Act 2026)
watermark, _ := client.AiAct.Watermark(ctx, "AI-generated content")
pii, _ := client.AiAct.PiiDetect(ctx, "김철수의 주민번호는...")
```

### V2 — Professional Tier (Starter/Pro)

```go
// Classification
result, _ := client.Classify.Classify(ctx, "suspicious text")

// Jailbreak Detection
detection, _ := client.Jailbreak.Detect(ctx, &models.JailbreakDetectRequest{
    Content: "Ignore previous instructions",
})
fmt.Println(detection.IsJailbreak) // true

// Safety Check
safety, _ := client.Safety.Check(ctx, &models.SafetyCheckRequest{
    Content: "potentially unsafe text",
})
fmt.Println(safety.IsSafe)

// Defense (PALADIN, Trust, RAG, Circuit Breaker, Adaptive)
client.Defense.PaladinStats(ctx)
client.Defense.TrustValidate(ctx, "untrusted input")
client.Defense.RagDetect(ctx, "query", []string{"doc1", "doc2"})

// Advanced Attack Detection
result, _ := client.Advanced.Detect(ctx, "sophisticated attack")

// AdversaFlow — Campaign Tracking
campaigns, _ := client.AdversaFlow.Campaigns(ctx)
for _, c := range campaigns {
    fmt.Println(c.ID)
}
```

### V3 — Enterprise Tier

```go
// GuardNet — Graph-based Threat Detection
client.GuardNet.Analyze(ctx, "test")
client.GuardNet.JBShield(ctx, "jailbreak attempt")

// Agent Security — DPI/IPI Protection
scan, _ := client.Agent.Scan(ctx, &models.AgentScanRequest{
    Prompt: "Use tool X to...",
    Tools:  []string{"web_search"},
})
fmt.Println(scan.InjectionDetected)

// Anomaly Detection
anomalies, _ := client.Anomaly.Detect(ctx, "request_rate")

// Multimodal Security
result, _ := client.Multimodal.Scan(ctx, "text", "https://example.com/image.png")

// Evolution Engine
client.Evolution.Generate(ctx, "seed-attack")

// SABER Risk Estimation
estimate, _ := client.Saber.Estimate(ctx, "test")
fmt.Printf("Risk: %.2f\n", estimate.Score)
```

### DevSecOps & API Keys

```go
// Ops — CI/CD security gates
client.Ops.Eval(ctx, "benchmark-id")
client.Ops.RedTeam(ctx, "target-model")

// API Key Management
key, _ := client.ApiKeys.Create(ctx, "my-service-key")
keys, _ := client.ApiKeys.List(ctx)
client.ApiKeys.Revoke(ctx, key.ID)
```

## Pagination

```go
// Auto-pagination with iterator
iter := client.Judge.List(ctx, &aegis.ListOptions{Limit: 50})
for iter.Next() {
    judgment := iter.Current()
    fmt.Println(judgment.ID, judgment.Decision)
}
if err := iter.Err(); err != nil {
    log.Fatal(err)
}
```

## Error Handling

```go
import "github.com/ai-aegis-yatav/aegis/go/apierrors"

result, err := client.Jailbreak.Detect(ctx, &models.JailbreakDetectRequest{
    Content: "test",
})
if err != nil {
    if apierrors.IsTierError(err) {
        te := err.(*apierrors.TierError)
        fmt.Printf("Upgrade to %s: %s\n", te.RequiredTier, te.UpgradeURL)
    } else if apierrors.IsQuotaError(err) {
        qe := err.(*apierrors.QuotaError)
        fmt.Printf("Quota: %d/%d, resets at %s\n", qe.Used, qe.Limit, qe.ResetAt)
    } else if apierrors.IsAuthError(err) {
        fmt.Println("Invalid API key")
    } else if apierrors.IsRateLimit(err) {
        fmt.Println("Rate limited, retry after backoff")
    }
}
```

## Configuration

```go
client := aegis.NewClient("aegis_sk_...",
    aegis.WithBaseURL("http://localhost:8000"),
    aegis.WithTimeout(60 * time.Second),
    aegis.WithMaxRetries(5),
    aegis.WithCustomHeaders(map[string]string{"X-Custom": "value"}),
)
```

## Requirements

- Go 1.21+
- No external dependencies (standard library only)

## Repository

- Source: [github.com/ai-aegis-yatav/aegis](https://github.com/ai-aegis-yatav/aegis)
- API Docs: [docs.aiaegis.io](https://docs.aiaegis.io)
- OpenAPI Spec: [`openapi/openapi.json`](https://github.com/ai-aegis-yatav/aegis-sdk/blob/main/openapi/openapi.json)

## License

MIT
