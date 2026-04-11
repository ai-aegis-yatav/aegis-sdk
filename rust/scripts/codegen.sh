#!/usr/bin/env bash
# Rust SDK uses hand-written resources/ backed by hand-written models/.
# The generated/ directory is reserved for a future low-level progenitor-based
# client; today it is intentionally empty. This script is a no-op when the
# progenitor CLI is not available (the common case on contributor machines)
# and only attempts generation when `cargo progenitor` is installed.
#
# To enable: cargo install cargo-progenitor --locked
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SDK_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SPEC="$SDK_DIR/../openapi/openapi.json"
OUT_DIR="$SDK_DIR/src/generated"

mkdir -p "$OUT_DIR"

if ! cargo progenitor --help >/dev/null 2>&1; then
  echo "→ skip Rust codegen (cargo-progenitor not installed; hand-written resources are canonical)"
  exit 0
fi

echo "→ cargo progenitor → $OUT_DIR"
if ! cargo progenitor \
  --input "$SPEC" \
  --output "$OUT_DIR" \
  --name aegis-generated \
  --version 0.1.0 \
  --interface positional 2>&1; then
  echo "⚠ cargo progenitor failed (Rust SDK uses hand-written resources; generated layer is optional) — skipping"
  exit 0
fi

echo "✓ Rust codegen done"
