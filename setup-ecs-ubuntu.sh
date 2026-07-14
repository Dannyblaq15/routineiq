#!/bin/bash
# RoutineIQ - Alibaba Cloud ECS Ubuntu Setup Script
# This script automates the installation of Node.js 20 LTS, PM2, Git, Nginx, and UFW firewall rules on an Ubuntu ECS instance.

set -e

echo "=========================================================="
echo "🚀 Starting RoutineIQ Setup on Alibaba Cloud ECS (Ubuntu)"
echo "=========================================================="

# 1. Update and upgrade packages
echo "🔄 Updating system packages..."
sudo apt-get update -y

# 2. Install Node.js 20 LTS
echo "📦 Installing Node.js 20 LTS..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installations
echo "✅ Node.js version: $(node -v)"
echo "✅ NPM version: $(npm -v)"

# 3. Install Git and PM2
echo "📦 Installing Git and PM2 (Process Manager)..."
sudo apt-get install -y git
sudo npm install -g pm2

# 4. Install Nginx
echo "🌐 Installing Nginx..."
sudo apt-get install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 5. Configure Nginx Reverse Proxy
echo "⚙️ Configuring Nginx reverse proxy to port 3000..."
cat << 'EOF' | sudo tee /etc/nginx/sites-available/routineiq
server {
    listen 80;
    server_name _; # Change this to your domain or keep it as _ to catch all IP traffic

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Activate configuration
sudo ln -sf /etc/nginx/sites-available/routineiq /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx

# 6. Configure UFW Firewall
echo "🛡️ Configuring Firewall (UFW) to allow SSH, HTTP, and HTTPS..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
sudo ufw status

echo "=========================================================="
echo "🎉 Environment Setup Complete!"
echo "=========================================================="
echo "Next Steps to deploy the application:"
echo "1. Clone the repository into /var/www/routineiq:"
echo "   sudo mkdir -p /var/www && sudo chown -R \$USER:\$USER /var/www"
echo "   git clone <your-git-repo-url> /var/www/routineiq"
echo "2. Create the production .env file in /var/www/routineiq/.env"
echo "3. Run setup and build:"
echo "   cd /var/www/routineiq"
echo "   npm install"
echo "   npx prisma generate"
echo "   npm run build"
echo "4. Start with PM2:"
echo "   pm2 start npm --name \"routineiq\" -- start"
echo "5. To enable PM2 to start on system boot:"
echo "   pm2 startup"
echo "   pm2 save"
echo "=========================================================="
