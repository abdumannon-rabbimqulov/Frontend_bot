#!/bin/bash
# Backward-compatible wrapper. Run Docker frontend deploy from repo root.
set -euo pipefail
cd "$(dirname "$0")"

exec bash ../deploy-frontend.sh "$@"
