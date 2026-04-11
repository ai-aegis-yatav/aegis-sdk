#!/usr/bin/env bash
# Generate low-level TypeScript client from sdks/openapi/openapi.json.
# Produces src/generated/ (types + fetch client). Committed to git.
#
# Prerequisites:
#   npm i -D openapi-typescript openapi-fetch
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SDK_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SPEC="$SDK_DIR/../openapi/openapi.json"
OUT_DIR="$SDK_DIR/src/generated"

if [ ! -f "$SPEC" ]; then
  echo "openapi spec not found: $SPEC" >&2
  exit 1
fi

mkdir -p "$OUT_DIR"

echo "→ openapi-typescript → $OUT_DIR/schema.d.ts"
npx --yes openapi-typescript "$SPEC" -o "$OUT_DIR/schema.d.ts"

cat > "$OUT_DIR/index.ts" <<'EOF'
/**
 * Auto-generated low-level client surface.
 * Do not edit by hand — regenerate with `bash scripts/codegen.sh`.
 *
 * The human-written `AegisClient` in `../client.ts` wraps this for
 * idiomatic usage; import from here only when you need an endpoint
 * not yet wrapped by the high-level layer.
 */
import createClient from 'openapi-fetch';
import type { paths } from './schema';

export type { paths, components } from './schema';

export function createLowLevelClient(opts: {
  baseUrl: string;
  apiKey?: string;
  bearerToken?: string;
  fetch?: typeof fetch;
}) {
  const headers: Record<string, string> = {};
  if (opts.apiKey) headers['X-API-Key'] = opts.apiKey;
  if (opts.bearerToken) headers['Authorization'] = `Bearer ${opts.bearerToken}`;
  return createClient<paths>({
    baseUrl: opts.baseUrl,
    headers,
    fetch: opts.fetch,
  });
}
EOF

echo "✓ JS codegen done"
