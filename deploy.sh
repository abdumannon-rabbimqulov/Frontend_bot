#!/bin/bash

# =================================================================
# FRONTEND DEPLOYMENT SCRIPT
# =================================================================

# --- CONFIGURATION ---
# Load environment variables from .env file
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

SERVER="${DEPLOY_SERVER:-root@138.68.70.230}"
PASSWORD="${DEPLOY_PASSWORD}"
SSH_KEY="${DEPLOY_SSH_KEY:-$HOME/.ssh/deploy_key}"
REMOTE_DIR="/var/www/frontend_bot"
NGINX_CONF_PATH="/etc/nginx/sites-available/frontend_bot"
# Domen DNS i shu VPS (DEPLOY_SERVER) ga ishora qilishi kerak (HTTP-01). IP bo'lsa nip.io ishlaydi.
FRONT_HOST="${SERVER##*@}"
if [[ -z "${SITE_DOMAIN:-}" && "$FRONT_HOST" =~ ^[0-9.]+$ ]]; then
    SITE_DOMAIN="${FRONT_HOST}.nip.io"
else
    SITE_DOMAIN="${SITE_DOMAIN:-logistic.org.uz}"
fi

# --- COLORS ---
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# SSH helper with password
ssh_cmd() {
    sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no "$@"
}

# SCP helper with password
scp_cmd() {
    sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no "$@"
}

echo -e "${CYAN}🚀 Frontend deployment started...${NC}"

# Logistika_bot FastAPI (see ../Logistika_bot docker-compose: 8003:8000 on deploy server)
LOGISTIKA_BACKEND="${LOGISTIKA_BACKEND:-158.220.100.58:8003}"

# 1. Check if IP is set
if [[ $SERVER == *"YOUR_SERVER_IP"* ]]; then
    echo -e "${RED}❌ Please edit deploy.sh and set your SERVER IP!${NC}"
    exit 1
fi

# 2. Create remote directory
echo -e "${CYAN}📂 Creating remote directory: ${REMOTE_DIR}${NC}"
ssh_cmd $SERVER "mkdir -p $REMOTE_DIR"

# 3. Upload files
echo -e "${CYAN}📤 Uploading index.html and admin folder...${NC}"
scp_cmd index.html $SERVER:$REMOTE_DIR/index.html
scp_cmd -r admin $SERVER:$REMOTE_DIR/

# 4. Nginx — domen + Logistika proxy. Sertifikat bo‘lmasa HTTP-only bootstrap.
if [ -f "nginx.conf" ] && [ -f "nginx.http-only.conf" ]; then
    echo -e "${CYAN}⚙️ Nginx: domen ${SITE_DOMAIN}, backend ${LOGISTIKA_BACKEND}...${NC}"
    HAS_SSL="$(ssh_cmd "$SERVER" "test -f /etc/letsencrypt/live/${SITE_DOMAIN}/fullchain.pem && echo yes || echo no" | tr -d '\r')"
    if [ "$HAS_SSL" = "yes" ]; then
        TEMPLATE="nginx.conf"
        echo -e "${CYAN}   (HTTPS konfig)${NC}"
    else
        TEMPLATE="nginx.http-only.conf"
        echo -e "${YELLOW}   (HTTP bootstrap — keyin: ./setup-ssl.sh)${NC}"
    fi
    NGINX_GEN="$(mktemp)"
    sed -e "s|__LOGISTIKA_BACKEND__|${LOGISTIKA_BACKEND}|g" \
        -e "s|__DOMAIN__|${SITE_DOMAIN}|g" \
        "$TEMPLATE" > "$NGINX_GEN"
    scp_cmd "$NGINX_GEN" "$SERVER":/tmp/nginx.conf
    rm -f "$NGINX_GEN"
    ssh_cmd "$SERVER" << EOF
        sudo rm -f /etc/nginx/sites-enabled/default
        sudo mv /tmp/nginx.conf $NGINX_CONF_PATH
        sudo ln -sf $NGINX_CONF_PATH /etc/nginx/sites-enabled/
        sudo nginx -t && sudo systemctl reload nginx
EOF
elif [ -f "nginx.conf" ]; then
    echo -e "${YELLOW}nginx.http-only.conf yo‘q — faqat nginx.conf ishlatilmayapti (to‘liq loyiha fayllarini yuklang).${NC}"
fi

echo -e "${GREEN}✅ Deployment successful!${NC}"
echo -e "${YELLOW}Note: Make sure your server's Nginx is configured to serve ${REMOTE_DIR}${NC}"
