#!/bin/bash
# Backend VPS'ning o'zida frontend + nginx + Let's Encrypt setup.
set -euo pipefail
cd "$(dirname "$0")"

LOGISTIKA_SSH_HOST="${LOGISTIKA_SSH_HOST:-root@158.220.100.58}"
SSH_KEY="${LOGISTIKA_SSH_KEY:-$HOME/.ssh/deploy_key}"
DOMAIN="${SITE_DOMAIN:-logistic.org.uz}"
EMAIL="${CERTBOT_EMAIL:-admin@${DOMAIN}}"
REMOTE_WEB="${LOGISTICS_REMOTE_WEBROOT:-/var/www/frontend_bot}"

CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'
YELLOW='\033[1;33m'

if [ ! -f "$SSH_KEY" ]; then
    echo -e "${RED}SSH key not found: $SSH_KEY${NC}" >&2
    exit 1
fi

SSH_BASE=(
    ssh
    -i "$SSH_KEY"
    -o StrictHostKeyChecking=no
    -o ControlMaster=auto
    -o ControlPersist=60s
    -o ControlPath="/tmp/logistika_frontend_%r@%h:%p"
)

FRONT_HOST="${LOGISTIKA_SSH_HOST##*@}"
echo -e "${CYAN}Certbot backend VPS: ${LOGISTIKA_SSH_HOST}, domain: ${DOMAIN}${NC}"

if [[ "${FORCE_IGNORE_DNS:-0}" != "1" ]] && [[ "$FRONT_HOST" =~ ^[0-9.]+$ ]]; then
    RESOLVED="$(dig +short "$DOMAIN" A 2>/dev/null | head -n1)"
    if [ -z "$RESOLVED" ] || [ "$RESOLVED" != "$FRONT_HOST" ]; then
        echo -e "${YELLOW}DNS warning: ${DOMAIN} -> ${RESOLVED:-empty}, backend VPS -> ${FRONT_HOST}${NC}" >&2
        echo -e "${YELLOW}Point the A record to backend IP or rerun with FORCE_IGNORE_DNS=1.${NC}" >&2
        exit 1
    fi
fi

echo -e "${CYAN}Deploying frontend to backend VPS...${NC}"
bash deploy-logistic-vps.sh

echo -e "${CYAN}Installing certbot / issuing certificate...${NC}"
"${SSH_BASE[@]}" "$LOGISTIKA_SSH_HOST" bash << REMOTE
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y certbot python3-certbot-nginx
mkdir -p "$REMOTE_WEB"
if [ ! -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
  certbot certonly --webroot -w "$REMOTE_WEB" \
    -d "${DOMAIN}" -d "www.${DOMAIN}" \
    --email "${EMAIL}" --agree-tos --non-interactive
else
  certbot renew --quiet || true
fi
REMOTE

echo -e "${CYAN}Redeploying nginx HTTPS config...${NC}"
bash deploy-logistic-vps.sh

echo -e "${GREEN}Frontend is ready on backend server: https://${DOMAIN}/${NC}"
