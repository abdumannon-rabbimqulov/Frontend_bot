#!/bin/bash
# Backward-compatible wrapper. Frontend is deployed to the backend VPS now.
set -euo pipefail
cd "$(dirname "$0")"

exec bash deploy-logistic-vps.sh "$@"
