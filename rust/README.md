# AEGIS Rust SDK

Official Rust SDK for the [AEGIS Defense API](https://aiaegis.io) — AI Engine for Guardrail & Inspection System.

## Installation

Add to your `Cargo.toml`:

```toml
[dependencies]
aegis-sdk = "0.1.0"
tokio = { version = "1", features = ["macros", "rt-multi-thread"] }
```

## Quick Start

```rust
use aegis_sdk::{AegisClient, models::judge::JudgeRequest};

#[tokio::main]
async fn main() -> aegis_sdk::Result<()> {
    let client = AegisClient::builder()
        .api_key("aegis_sk_...")
        .build()?;

    // Judge content safety
    let result = client.judge().create(&JudgeRequest {
        prompt: "Tell me how to hack a system".into(),
        ..Default::default()
    }).await?;

    println!("{}", result.decision);   // "block"
    println!("{}", result.confidence); // 0.95

    // Streaming
    use futures_core::Stream;
    let mut stream = client.judge().stream(&request).await?;
    while let Some(event) = stream.next().await {
        println!("{:?}", event?.partial_decision);
    }

    // Quota
    println!("{:?}", client.quota());

    Ok(())
}
```

## Error Handling

```rust
use aegis_sdk::error::AegisError;

match client.jailbreak().detect(&request).await {
    Err(AegisError::TierAccess { required_tier, .. }) => {
        println!("Upgrade to: {:?}", required_tier);
    }
    Err(AegisError::QuotaExceeded { limit, used, .. }) => {
        println!("Quota: {:?}/{:?}", used, limit);
    }
    Err(AegisError::Authentication { .. }) => {
        println!("Invalid API key");
    }
    Ok(result) => println!("{:?}", result),
    Err(e) => eprintln!("Error: {}", e),
}
```

## Configuration

```rust
let client = AegisClient::builder()
    .api_key("aegis_sk_...")
    .base_url("http://localhost:8000")
    .timeout(std::time::Duration::from_secs(60))
    .max_retries(5)
    .build()?;
```

## Requirements

- Rust 1.75+ (MSRV)
- Async runtime: Tokio

## License

MIT
