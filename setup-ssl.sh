#!/bin/bash
# Bir marta: Let's Encrypt sertifikati (webroot), keyin to‘liq nginx (HTTPS).
set -euo pipefail
cd "$(dirname "$0")"

if [ -f .env ]; then
    # shellcheck disable=SC2046
    export $(grep -v '^#' .env | grep -v '^[[:space:]]*$' | xargs 2>/dev/null) || true
fi

SERVER="${DEPLOY_SERVER:-root@138.68.70.230}"
PASSWORD="${DEPLOY_PASSWORD}"
FRONT_HOST="${SERVER##*@}"
if [[ -z "${SITE_DOMAIN:-}" && "$FRONT_HOST" =~ ^[0-9.]+$ ]]; then
    DOMAIN="${FRONT_HOST}.nip.io"
else
    DOMAIN="${SITE_DOMAIN:-logistic.org.uz}"
fi
EMAIL="${CERTBOT_EMAIL:-admin@${DOMAIN}}"

ssh_cmd() {
    sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no "$@"
}

CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'
YELLOW='\033[1;33m'

if [ -z "${PASSWORD:-}" ]; then
    echo -e "${RED}DEPLOY_PASSWORD .env da yo‘q.${NC}" >&2
    exit 1
fi

echo -e "${CYAN}🔐 Certbot: ${DOMAIN} (email: ${EMAIL})${NC}"

if [[ "${FORCE_IGNORE_DNS:-0}" != "1" ]] && [[ "$FRONT_HOST" =~ ^[0-9.]+$ ]]; then
    RESOLVED="$(dig +short "$DOMAIN" A 2>/dev/null | head -n1)"
    if [ -z "$RESOLVED" ] || [ "$RESOLVED" != "$FRONT_HOST" ]; then
        echo -e "${RED}DNS mos emas: ${DOMAIN} → ${RESOLVED:-bo‘sh}, VPS → ${FRONT_HOST}${NC}" >&2
        echo -e "${YELLOW}SITE_DOMAIN A yozuvini shu IP ga qarang yoki SITE_DOMAIN=${FRONT_HOST}.nip.io qoldiring (default).${NC}" >&2
        exit 1
    fi
fi

echo -e "${CYAN}📂 Avval HTTP bootstrap nginx (webroot)…${NC}"
bash deploy.sh

echo -e "${CYAN}📜 Sertifikat olish…${NC}"
# shellcheck disable=SC2029
ssh_cmd "$SERVER" bash << REMOTE
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y certbot
if ! certbot certonly --webroot -w /var/www/frontend_bot \\
  -d "${DOMAIN}" \\
  --email "${EMAIL}" --agree-tos --non-interactive; then
  echo "Certbot xato: DNS A yozuvi server IP ga tushadimi? (dig +short ${DOMAIN})" >&2
  exit 1
fi
REMOTE

echo -e "${CYAN}🔄 To‘liq HTTPS nginx…${NC}"
bash deploy.sh

echo -e "${GREEN}✅ HTTPS tayyor: https://${DOMAIN}/${NC}"
