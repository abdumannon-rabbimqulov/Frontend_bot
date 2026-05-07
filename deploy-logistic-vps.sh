#!/bin/bash
# Backward-compatible wrapper for the standalone frontend deploy.
set -euo pipefail
cd "$(dirname "$0")"

exec bash deploy.sh "$@"
