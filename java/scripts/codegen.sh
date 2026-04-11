#!/usr/bin/env bash
# Generate Java low-level client from sdks/openapi/openapi.json.
# Produces src/main/java/ai/aegis/sdk/generated/. Committed to git.
#
# Prerequisites:
#   npm i -g @openapitools/openapi-generator-cli
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SDK_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SPEC="$SDK_DIR/../openapi/openapi.json"
OUT_DIR="$SDK_DIR/build/openapi-gen"
TARGET_PKG_DIR="$SDK_DIR/src/main/java/ai/aegis/sdk/generated"

if ! command -v openapi-generator-cli >/dev/null 2>&1; then
  echo "→ skip Java codegen (openapi-generator-cli not installed; hand-written resources are canonical)"
  exit 0
fi

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR" "$TARGET_PKG_DIR"

echo "→ openapi-generator-cli → $OUT_DIR"
openapi-generator-cli generate \
  -i "$SPEC" \
  -g java \
  --library okhttp-gson \
  --api-package ai.aegis.sdk.generated.api \
  --model-package ai.aegis.sdk.generated.model \
  --invoker-package ai.aegis.sdk.generated \
  --additional-properties=hideGenerationTimestamp=true,dateLibrary=java8,openApiNullable=false \
  -o "$OUT_DIR"

# Copy just the generated Java sources into the committed tree.
rsync -a --delete \
  "$OUT_DIR/src/main/java/ai/aegis/sdk/generated/" \
  "$TARGET_PKG_DIR/"

echo "✓ Java codegen done"
