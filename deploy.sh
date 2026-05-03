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

# 1. Check if IP is set
if [[ $SERVER == *"YOUR_SERVER_IP"* ]]; then
    echo -e "${RED}❌ Please edit deploy.sh and set your SERVER IP!${NC}"
    exit 1
fi

# 2. Create remote directory
echo -e "${CYAN}📂 Creating remote directory: ${REMOTE_DIR}${NC}"
ssh_cmd $SERVER "mkdir -p $REMOTE_DIR"

# 3. Upload files
echo -e "${CYAN}📤 Uploading index.html...${NC}"
scp_cmd index.html $SERVER:$REMOTE_DIR/index.html

# 4. Upload Nginx config (optional)
if [ -f "nginx.conf" ]; then
    echo -e "${CYAN}⚙️ Uploading Nginx config...${NC}"
    scp_cmd nginx.conf $SERVER:/tmp/nginx.conf
    ssh_cmd $SERVER << EOF
        sudo mv /tmp/nginx.conf $NGINX_CONF_PATH
        sudo ln -sf $NGINX_CONF_PATH /etc/nginx/sites-enabled/
        sudo nginx -t && sudo systemctl reload nginx
EOF
fi

echo -e "${GREEN}✅ Deployment successful!${NC}"
echo -e "${YELLOW}Note: Make sure your server's Nginx is configured to serve ${REMOTE_DIR}${NC}"
