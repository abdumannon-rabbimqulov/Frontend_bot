#!/bin/bash
# logistic.org.uz — API bilan bir VPS (Docker 8003 + statik frontend).
set -euo pipefail
cd "$(dirname "$0")"

LOGISTIKA_SSH_HOST="${LOGISTIKA_SSH_HOST:-root@158.220.100.58}"
SSH_KEY="${LOGISTIKA_SSH_KEY:-$HOME/.ssh/deploy_key}"
REMOTE_WEB="${LOGISTICS_REMOTE_WEBROOT:-/var/www/frontend_bot}"
NGINX_FRAGMENT="nginx/logistic-org-uz.vps.conf"
ADMIN_DIR="admin"
ADMIN_DIST="$ADMIN_DIR/dist"

if [ ! -f "$NGINX_FRAGMENT" ]; then
    echo "Yo‘q: $NGINX_FRAGMENT" >&2
    exit 1
fi
if [ ! -f "$SSH_KEY" ]; then
    echo "SSH kalit yo‘q: $SSH_KEY" >&2
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
SCP_BASE=(
    scp
    -i "$SSH_KEY"
    -o StrictHostKeyChecking=no
    -o ControlMaster=auto
    -o ControlPersist=60s
    -o ControlPath="/tmp/logistika_frontend_%r@%h:%p"
)

echo "🏗️  Admin SPA build..."
if [ -d "$ADMIN_DIR" ]; then
    if [ ! -d "$ADMIN_DIR/node_modules" ]; then
        (cd "$ADMIN_DIR" && npm ci --prefer-offline --no-audit --no-fund)
    fi
    (cd "$ADMIN_DIR" && npm run build)
fi

if [ ! -d "$ADMIN_DIST" ]; then
    echo "Admin build topilmadi: $ADMIN_DIST" >&2
    exit 1
fi

echo "📤 Frontend → ${LOGISTIKA_SSH_HOST}:${REMOTE_WEB}"
"${SSH_BASE[@]}" "$LOGISTIKA_SSH_HOST" "mkdir -p '$REMOTE_WEB/admin'"

# rsync faqat o'zgargan fayllarni yuboradi. Avvalgi scp -r admin esa node_modules,
# src va configlarni ham yuborib deployni juda sekinlashtirardi.
rsync -az --delete \
    -e "ssh -i '$SSH_KEY' -o StrictHostKeyChecking=no -o ControlMaster=auto -o ControlPersist=60s -o ControlPath=/tmp/logistika_frontend_%r@%h:%p" \
    index.html \
    "$LOGISTIKA_SSH_HOST:$REMOTE_WEB/index.html"

rsync -az --delete \
    -e "ssh -i '$SSH_KEY' -o StrictHostKeyChecking=no -o ControlMaster=auto -o ControlPersist=60s -o ControlPath=/tmp/logistika_frontend_%r@%h:%p" \
    "$ADMIN_DIST/" \
    "$LOGISTIKA_SSH_HOST:$REMOTE_WEB/admin/"

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
