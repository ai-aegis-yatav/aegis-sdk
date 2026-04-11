#!/usr/bin/env bash
# Generate Pydantic v2 models + httpx client from sdks/openapi/openapi.json.
# Produces src/aegis/_generated/. Committed to git.
#
# Prerequisites:
#   pipx install datamodel-code-generator
#   pipx install openapi-python-client
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SDK_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SPEC="$SDK_DIR/../openapi/openapi.json"
OUT_DIR="$SDK_DIR/src/aegis/_generated"

mkdir -p "$OUT_DIR"

echo "→ datamodel-codegen → $OUT_DIR/models.py"
datamodel-codegen \
  --input "$SPEC" \
  --input-file-type openapi \
  --output "$OUT_DIR/models.py" \
  --output-model-type pydantic_v2.BaseModel \
  --target-python-version 3.10 \
  --use-schema-description \
  --use-field-description \
  --field-constraints \
  --use-standard-collections \
  --use-union-operator

touch "$OUT_DIR/__init__.py"
cat > "$OUT_DIR/__init__.py" <<'EOF'
"""Auto-generated Pydantic models for the AEGIS OpenAPI spec.

Do not edit by hand — regenerate with `bash scripts/codegen.sh`.
The high-level `AegisClient` in `aegis.client` wraps the HTTP layer;
import from `aegis._generated.models` when you need a schema that
isn't re-exported from the top-level package.
"""
from . import models  # noqa: F401
EOF

echo "✓ Python codegen done"
