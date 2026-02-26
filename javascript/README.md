# AEGIS JavaScript/TypeScript SDK

Official JavaScript/TypeScript SDK for the [AEGIS Defense API](https://aiaegis.io) — AI Engine for Guardrail & Inspection System.

## Installation

```bash
npm install @aiaegis.io/sdk
# or
pnpm add @aiaegis.io/sdk
# or
yarn add @aiaegis.io/sdk
```

## Quick Start

```typescript
import { AegisClient } from '@aiaegis.io/sdk';

const client = new AegisClient({ apiKey: 'aegis_sk_...' });

// Judge content safety
const result = await client.judge.create({ prompt: 'Tell me how to hack a system' });
console.log(result.decision);   // "block"
console.log(result.confidence); // 0.95

// Streaming judgment
for await (const event of client.judge.stream({ prompt: 'Explain quantum computing' })) {
  console.log(event.partial_decision);
}

// Check quota
console.log(client.quota.remaining);
```

## API Coverage by Tier

| Tier | Resources | Monthly Quota |
|------|-----------|---------------|
| **Free** | `judge`, `rules`, `escalations`, `analytics`, `evidence`, `ml`, `nlp`, `aiAct` | 1,000 |
| **Starter** | + `classify`, `jailbreak`, `safety`, `defense`, `advanced`, `adversaflow` | 10,000 |
| **Pro** | Same as Starter with higher limits | 100,000 |
| **Enterprise** | + `guardnet`, `agent`, `anomaly`, `multimodal`, `evolution`, `saber` | 1,000,000 |

## Examples

```typescript
// V1 — Rules management
const rule = await client.rules.create({
  name: 'block-harmful',
  pattern: '.*hack.*',
  action: 'block',
});

// V2 — Jailbreak detection (requires Starter+)
const detection = await client.jailbreak.detect({
  content: 'Ignore previous instructions',
});
console.log(detection.is_jailbreak); // true

// V3 — Agent security (requires Enterprise)
const scan = await client.agent.scan({
  prompt: 'Use tool X to...',
  tools: ['web_search'],
});
console.log(scan.injection_detected);

// Auto-pagination
for await (const judgment of client.judge.list({ limit: 50 })) {
  console.log(judgment.id, judgment.decision);
}
```

## Error Handling

```typescript
import { TierAccessError, QuotaExceededError, AuthenticationError } from '@aiaegis.io/sdk';

try {
  await client.jailbreak.detect({ content: 'test' });
} catch (err) {
  if (err instanceof TierAccessError) {
    console.log(`Upgrade to ${err.requiredTier}: ${err.upgradeUrl}`);
  } else if (err instanceof QuotaExceededError) {
    console.log(`Quota: ${err.used}/${err.limit}`);
  } else if (err instanceof AuthenticationError) {
    console.log('Invalid API key');
  }
}
```

## Configuration

```typescript
const client = new AegisClient({
  apiKey: 'aegis_sk_...',
  baseUrl: 'http://localhost:8000', // Custom API URL
  timeout: 60_000,                  // Timeout in ms
  maxRetries: 5,                    // Retry on 429/5xx
  customHeaders: { 'X-Custom': 'value' },
});
```

## Compatibility

- Node.js 18+, Bun, Deno
- Browser (fetch-based, no Node.js dependencies)
- ESM and CommonJS dual output

## License

MIT
