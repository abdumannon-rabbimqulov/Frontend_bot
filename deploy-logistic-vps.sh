#!/bin/bash
# Backward-compatible wrapper. Static rsync deploy is replaced by Docker deploy.
set -euo pipefail
cd "$(dirname "$0")"

exec bash ../deploy-frontend.sh "$@"
