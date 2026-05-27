#!/bin/bash

# Cashier PKM Deployment Script

set -e

echo "🚀 Deploying Cashier PKM..."

# Load environment variables
if [ -f .env.production ]; then
  export $(cat .env.production | grep -v '^#' | xargs)
else
  echo "⚠️  Warning: .env.production not found. Using default values."
fi

# Build and start containers
echo "📦 Building Docker image..."
docker compose -f docker-compose.prod.yml build

echo "🔄 Restarting container..."
docker compose -f docker-compose.prod.yml up -d

echo "⏳ Waiting for application to start..."
sleep 10

# Check health
echo "🏥 Checking application health..."
HEALTH_CHECK=$(curl -s http://localhost:3155/api/health || echo "failed")

if echo "$HEALTH_CHECK" | grep -q "ok"; then
  echo "✅ Deployment successful!"
  echo "📱 Application URL: http://localhost:3155"
else
  echo "⚠️  Health check failed. Check logs with: docker compose -f docker-compose.prod.yml logs -f"
fi

echo "📋 Useful commands:"
echo "  View logs: docker compose -f docker-compose.prod.yml logs -f"
echo "  Stop app:   docker compose -f docker-compose.prod.yml down"
echo "  Restart:   docker compose -f docker-compose.prod.yml restart"
