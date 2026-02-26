# AEGIS Java SDK

Official Java SDK for the [AEGIS Defense API](https://aiaegis.io) — AI Engine for Guardrail & Inspection System.

## Installation

### Gradle

```kotlin
dependencies {
    implementation("ai.aegis:aegis-sdk:0.1.0")
}
```

### Maven

```xml
<dependency>
    <groupId>ai.aegis</groupId>
    <artifactId>aegis-sdk</artifactId>
    <version>0.1.0</version>
</dependency>
```

## Quick Start

```java
import ai.aegis.sdk.AegisClient;
import ai.aegis.sdk.models.JudgeRequest;
import ai.aegis.sdk.models.JudgeResponse;

try (AegisClient client = AegisClient.builder()
        .apiKey("aegis_sk_...")
        .build()) {

    JudgeResponse result = client.judge().create(
        JudgeRequest.builder().prompt("Tell me how to hack a system").build()
    );
    System.out.println(result.getDecision());   // "block"
    System.out.println(result.getConfidence());  // 0.95

    // Streaming
    client.judge().stream(request, event -> {
        System.out.println(event.getPartialDecision());
    });

    // Quota
    System.out.println(client.quota().getRemaining());
}
```

## Error Handling

```java
import ai.aegis.sdk.errors.*;

try {
    client.jailbreak().detect(request);
} catch (TierAccessException e) {
    System.out.println("Upgrade to: " + e.getRequiredTier());
} catch (QuotaExceededException e) {
    System.out.println("Quota: " + e.getUsed() + "/" + e.getLimit());
} catch (AuthenticationException e) {
    System.out.println("Invalid API key");
}
```

## Requirements

- Java 11+
- Jackson (included as dependency)

## License

MIT
