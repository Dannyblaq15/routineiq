#!/bin/bash

# Configuration
SERVER_IP="your-ecs-public-ip"  # Replace with your actual ECS Public IP
SERVER_USER="root"
APP_DIR="/var/www/routineiq"
PM2_NAME="routineiq"

echo "=========================================="
echo "🚀 Starting RoutineIQ ECS Deployment Script"
echo "=========================================="

# Check if SSH configuration is updated
if [ "$SERVER_IP" == "your-ecs-public-ip" ]; then
  echo "❌ Error: Please update the SERVER_IP variable in deploy-ecs.sh first!"
  exit 1
fi

echo "📦 Connecting to ECS ($SERVER_IP)..."

ssh ${SERVER_USER}@${SERVER_IP} << EOF
  echo "📁 Navigating to application directory..."
  cd ${APP_DIR} || { echo "❌ Error: Directory ${APP_DIR} not found!"; exit 1; }

  echo "🔄 Pulling latest changes from git..."
  git pull origin main

  echo "⚙️ Installing dependencies..."
  npm install

  echo "🗄️ Generating Prisma client..."
  npx prisma generate

  echo "🛠️ Building Next.js production code..."
  npm run build

  echo "🔄 Restarting application with PM2..."
  pm2 restart ${PM2_NAME} || pm2 start npm --name "${PM2_NAME}" -- start

  echo "✅ Deployment finished successfully!"
EOF
