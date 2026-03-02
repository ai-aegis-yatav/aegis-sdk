# AEGIS Guard for OpenClaw

Enterprise-grade AI agent defense plugin for [OpenClaw](https://github.com/openclaw/openclaw), powered by the [AEGIS PALADIN](https://aegis.ai) 6-layer defense pipeline.

## Why AEGIS Guard?

OpenClaw agents can execute terminal commands, manage files, call APIs, and control connected services — making them high-value attack targets. AEGIS Guard adds multi-layer defense that existing solutions lack:

| Capability | AEGIS Guard |
|---|---|
| DPI/IPI detection | Rule + LLM hybrid analysis |
| Tool chain analysis | STAC graph detection |
| Memory poisoning | MINJA / InjecMEM / MemoryGraft |
| Reasoning protection | UDora / PoT / CoT hijack detection |
| Privilege escalation | Multi-step escalation analysis |
| Anomaly detection | Isolation Forest + Z-Score |

## Quick Start

### 1. Install

```bash
openclaw plugin install @aegis-ai/guard-openclaw
```

Or via npm (from GitHub):

```bash
npm install git+https://github.com/ai-aegis-yatav/aegis-sdk.git#subdirectory=integrations/openclaw
```

### 2. Configure

Set your AEGIS API key in the OpenClaw environment:

```bash
export AEGIS_API_KEY="aegis_sk_..."
```

### 3. Done

The plugin automatically registers guards on all lifecycle phases. No code changes needed.

## Configuration

All configuration is via environment variables:

| Variable | Default | Description |
|---|---|---|
| `AEGIS_API_KEY` | *(required)* | Your AEGIS API key |
| `AEGIS_BASE_URL` | `https://api.aegis.ai` | API base URL (for self-hosted) |
| `AEGIS_GUARD_MODE` | `balanced` | `strict` / `balanced` / `permissive` |
| `AEGIS_TIMEOUT` | `5000` | Request timeout in ms |
| `AEGIS_MAX_RETRIES` | `2` | Max retries per request |
| `AEGIS_ALLOWED_TOOLS` | *(empty)* | Comma-separated tool allowlist |
| `AEGIS_DENIED_TOOLS` | *(empty)* | Comma-separated tool denylist |
| `AEGIS_CACHE_ENABLED` | `true` | Enable result caching |
| `AEGIS_CACHE_TTL_MS` | `30000` | Cache TTL in ms |
| `AEGIS_GUARD_INBOUND` | `true` | Enable inbound message guard |
| `AEGIS_GUARD_TOOL` | `true` | Enable tool execution guard |
| `AEGIS_GUARD_OUTPUT` | `true` | Enable output safety guard |
| `AEGIS_GUARD_MEMORY` | `true` | Enable memory integrity guard |
| `AEGIS_GUARD_REASONING` | `true` | Enable reasoning hijack guard |
| `AEGIS_GUARD_HEARTBEAT` | `true` | Enable heartbeat anomaly guard |

## Guard Modes

| Mode | Block threshold | Escalate threshold | Behavior |
|---|---|---|---|
| `strict` | 0.30 | 0.15 | Aggressive blocking, minimal false negatives |
| `balanced` | 0.60 | 0.35 | Balanced precision / recall (recommended) |
| `permissive` | 0.85 | 0.55 | Warn-oriented, minimal false positives |

## Architecture

```
Inbound Message
  │
  ▼
┌─────────────────────────┐
│  preMessageProcess      │ ← AEGIS /v3/agent/scan (DPI/IPI)
│  (Inbound Guard)        │   + fallback to /v1/judge (PALADIN)
└─────────┬───────────────┘
          │ safe
          ▼
┌─────────────────────────┐
│  preToolExecution       │ ← AEGIS /v3/agent/toolchain (STAC)
│  (Tool Guard)           │   + /v3/agent/tool-disguise (iMIST)
└─────────┬───────────────┘
          │ safe
          ▼
┌─────────────────────────┐
│  postToolExecution      │ ← AEGIS /v3/agent/scan (IPI in output)
│  (Output Guard)         │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│  preMemoryStore         │ ← AEGIS /v3/agent/memory-poisoning
│  (Memory Guard)         │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│  onAgentReasoning       │ ← AEGIS /v3/agent/reasoning-hijack
│  (Reasoning Guard)      │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│  preMessageSend         │ ← AEGIS /v2/safety/check
│  (Output Safety)        │
└─────────┬───────────────┘
          │ safe
          ▼
     Deliver Reply
```

## Graceful Degradation

When the AEGIS API is unreachable, guards degrade gracefully:

1. V3 agent scan fails → falls back to V1 PALADIN judge
2. V1 judge fails → falls back to local pattern matching (20+ DPI patterns)
3. In `strict` mode, complete API failure → block; in `balanced`/`permissive` → allow

## AEGIS API Tiers

This plugin works with all AEGIS tiers, with features scaling by tier:

| Feature | V1 (Free) | V2 (Pro) | V3 (Enterprise) |
|---|---|---|---|
| PALADIN judge | Yes | Yes | Yes |
| Jailbreak detection | - | Yes | Yes |
| Safety check | - | Yes | Yes |
| Agent scan (DPI/IPI) | - | - | Yes |
| Tool chain analysis | - | - | Yes |
| Memory poisoning | - | - | Yes |
| Reasoning hijack | - | - | Yes |
| Anomaly detection | - | - | Yes |

Get a free API key at [aegis.ai](https://aegis.ai).

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Type check
npm run typecheck
```

## License

MIT
