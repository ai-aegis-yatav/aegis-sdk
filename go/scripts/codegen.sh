#!/usr/bin/env bash
# Go SDK uses the hand-written root-package client (aegis.go, client.go, and
# per-resource files like saber.go). The generated/ directory is reserved for
# a future oapi-codegen-based low-level client but is not currently consumed
# by the public API surface. The oapi-codegen output for the current
# openapi.json produces duplicate type declarations due to operation/schema
# name collisions, so the script is a no-op when oapi-codegen is not present
# and short-circuits with a warning when generation would produce invalid code.
#
# To enable (requires manual de-duplication): install github.com/oapi-codegen/oapi-codegen/v2
set -euo pipefail

if ! command -v oapi-codegen >/dev/null 2>&1; then
  echo "→ skip Go codegen (oapi-codegen not installed; hand-written client is canonical)"
  exit 0
fi

echo "→ skip Go codegen (current openapi.json produces duplicate types; hand-written client is canonical)"
exit 0
