#!/bin/bash
# logistic.org.uz — API bilan bir VPS (Docker 8003 + statik frontend).
set -euo pipefail
cd "$(dirname "$0")"

LOGISTIKA_SSH_HOST="${LOGISTIKA_SSH_HOST:-root@158.220.100.58}"
SSH_KEY="${LOGISTIKA_SSH_KEY:-$HOME/.ssh/deploy_key}"
REMOTE_WEB="${LOGISTICS_REMOTE_WEBROOT:-/var/www/frontend_bot}"
NGINX_FRAGMENT="nginx/logistic-org-uz.vps.conf"

if [ ! -f "$NGINX_FRAGMENT" ]; then
    echo "Yo‘q: $NGINX_FRAGMENT" >&2
    exit 1
fi
if [ ! -f "$SSH_KEY" ]; then
    echo "SSH kalit yo‘q: $SSH_KEY" >&2
    exit 1
fi

SSH_BASE=(ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no)
SCP_BASE=(scp -i "$SSH_KEY" -o StrictHostKeyChecking=no)

echo "📤 Frontend → ${LOGISTIKA_SSH_HOST}:${REMOTE_WEB}"
"${SSH_BASE[@]}" "$LOGISTIKA_SSH_HOST" "mkdir -p '$REMOTE_WEB'"
"${SCP_BASE[@]}" index.html "$LOGISTIKA_SSH_HOST:$REMOTE_WEB/index.html"
"${SCP_BASE[@]}" hero.png "$LOGISTIKA_SSH_HOST:$REMOTE_WEB/hero.png"
"${SCP_BASE[@]}" -r admin "$LOGISTIKA_SSH_HOST:$REMOTE_WEB/"

echo "⚙️ Nginx logistic.org.uz konfig..."
"${SCP_BASE[@]}" "$NGINX_FRAGMENT" "$LOGISTIKA_SSH_HOST:/tmp/logistic.org.uz.conf.new"

"${SSH_BASE[@]}" "$LOGISTIKA_SSH_HOST" << 'REMOTE'
set -euo pipefail
install -m 0644 /tmp/logistic.org.uz.conf.new /etc/nginx/conf.d/logistic.org.uz.conf
rm -f /tmp/logistic.org.uz.conf.new
nginx -t
systemctl reload nginx
REMOTE

echo "✅ Tayyor: https://logistic.org.uz/"
echo "   Bot WEBAPP_URL: https://logistic.org.uz/ (.env)"
