#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"

LOGISTIKA_SSH_HOST="${LOGISTIKA_SSH_HOST:-root@158.220.100.58}"
SSH_KEY="${LOGISTIKA_SSH_KEY:-$HOME/.ssh/deploy_key}"
REMOTE_PROJECT_DIR="${LOGISTIKA_FRONTEND_REMOTE_DIR:-/root/Frontend_bot}"
NGINX_FRAGMENT="nginx/logistic-org-uz.vps.conf"
NGINX_TARGET="/etc/nginx/conf.d/logistic.org.uz.conf"

deploy_here() {
    local project_dir="${1:-$(pwd)}"

    if [ ! -f "$project_dir/docker-compose.yml" ]; then
        echo "docker-compose.yml topilmadi: $project_dir/docker-compose.yml" >&2
        exit 1
    fi
    if [ ! -f "$project_dir/$NGINX_FRAGMENT" ]; then
        echo "Nginx config topilmadi: $project_dir/$NGINX_FRAGMENT" >&2
        exit 1
    fi

    echo "🐳 Building and restarting frontend Docker container..."
    cd "$project_dir"
    docker compose up -d --build frontend

    echo "⚙️  Applying public Nginx config..."
    if [ "$(id -u)" -eq 0 ]; then
        install -m 0644 "$NGINX_FRAGMENT" "$NGINX_TARGET"
        nginx -t
        systemctl reload nginx
    elif command -v sudo >/dev/null 2>&1; then
        sudo install -m 0644 "$NGINX_FRAGMENT" "$NGINX_TARGET"
        sudo nginx -t
        sudo systemctl reload nginx
    else
        echo "sudo topilmadi; Nginx config qo'lda yangilanishi kerak: $NGINX_TARGET" >&2
        exit 1
    fi
}

if [ "${LOGISTIKA_DEPLOY_LOCAL:-0}" = "1" ] || [ ! -f "$SSH_KEY" ]; then
    echo "🚀 Deploying frontend locally from $(pwd)..."
    deploy_here "$(pwd)"
else
    rm -f /tmp/logistika_frontend_* 2>/dev/null || true

    SSH_BASE=(
        ssh
        -i "$SSH_KEY"
        -o StrictHostKeyChecking=no
        -o BatchMode=yes
        -o ConnectTimeout=45
        -o ServerAliveInterval=15
        -o ServerAliveCountMax=4
        -o ControlMaster=no
    )

    echo "🚀 Deploying frontend to ${LOGISTIKA_SSH_HOST}..."
    echo "📤 Syncing frontend repo to ${REMOTE_PROJECT_DIR}..."

    "${SSH_BASE[@]}" "$LOGISTIKA_SSH_HOST" "mkdir -p '$REMOTE_PROJECT_DIR'"

    rsync -az --delete \
        -e "ssh -i '$SSH_KEY' -o StrictHostKeyChecking=no -o ControlMaster=auto -o ControlPersist=60s -o ControlPath=/tmp/logistika_frontend_%r@%h:%p" \
        --exclude '.git' \
        --exclude '.next' \
        --exclude 'node_modules' \
        --exclude '.cursor' \
        --exclude '.DS_Store' \
        --exclude '._*' \
        ./ \
        "$LOGISTIKA_SSH_HOST:$REMOTE_PROJECT_DIR/"

    echo "⚙️  Running frontend deploy on server..."
    "${SSH_BASE[@]}" "$LOGISTIKA_SSH_HOST" "cd '$REMOTE_PROJECT_DIR' && LOGISTIKA_DEPLOY_LOCAL=1 bash deploy.sh"
fi

echo "✅ Frontend deploy successfully completed!"
echo "   Frontend: https://logistic.org.uz/"
