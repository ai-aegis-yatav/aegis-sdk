# AEGIS OpenAPI Spec — Single Source of Truth

`openapi.json` in this directory is the **single source of truth** for all 6
AEGIS SDKs (JavaScript, Python, Go, Rust, Java) and all external API
documentation.

It is **generated from `apps/api`** via Utoipa procedural macros. **Do not edit
`openapi.json` by hand.**

## Regenerating

```bash
# From repo root
make sdk-openapi
```

This runs `cargo run --bin generate-openapi` against `apps/api` and writes the
result to `openapi/openapi.json`.

## When you must regenerate

Per the synchronization matrix in `CLAUDE.md`, regenerate **whenever** any of
the following change in `apps/api`:

- A route is added, removed, renamed, or its method changes
- A handler's request/response type changes
- A `utoipa` annotation (`#[utoipa::path(...)]`, schemas, tags) changes
- A new tag group is introduced (update SDK resource grouping as well)
- Auth scopes or security schemes change

After regenerating, re-run per-language codegen so the low-level clients track
the spec:

```bash
make sdk-codegen   # runs sdks/{lang}/scripts/codegen.sh for each language
```

## Drift check (CI)

`make sdk-openapi-check` regenerates the spec and fails if the working tree has
any diff against the committed `openapi.json`. CI must run this on every PR
that touches `apps/api`.

## SDK coverage strategy

Each language SDK has two layers:

1. **Generated low-level client** (`sdks/{lang}/src/.../generated/`) — produced
   from this spec by language-native OpenAPI generators. Guarantees **100% of
   the 151 endpoints** are callable in every language, always in sync.
2. **Human-written resource layer** (`sdks/{lang}/src/.../resources/`) —
   idiomatic wrappers with domain-friendly method names, convenience helpers
   (auto-pagination, streaming, typed errors), and documentation. Covers the
   core endpoints users call most often.

Users can reach any endpoint through the low-level layer even if no high-level
wrapper exists yet. See the per-language `README.md` for examples.

## Spec facts

- **Format**: OpenAPI 3.0 JSON
- **Paths**: 151
- **Tags**: 27 groups — Health, Defense, Rules, Escalations, Analytics,
  Evidence, ML, NLP, AI Act Compliance, Judgment, v2-classify, v2-jailbreak,
  v2-safety, v2-advanced, v2-adversaflow, v3-agent, v3-anomaly, v3-defense,
  v3-evolution, v3-multimodal, v3-saber, v3-validate, EvalOps, RedTeam, VLA,
  orchestration
- **Security schemes**: `api_key` (header `X-API-Key`), `bearer_auth` (JWT)

## References

- Generator source: `apps/api/src/bin/generate-openapi.rs`
- Route assembly: `apps/api/src/lib.rs` → `create_router()`
- ADR: [`docs/architecture/adr/005-sdk-six-language-openapi.md`](../../docs/architecture/adr/005-sdk-six-language-openapi.md)
