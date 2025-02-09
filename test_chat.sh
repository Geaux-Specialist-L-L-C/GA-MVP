#!/bin/bash

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker first."
  exit 1
fi

# Check if TIPI container exists
if ! docker ps -a --format '{{.Names}}' | grep -q "cheshire-cat"; then
  echo "🚀 Starting new TIPI container..."
  docker run -d \
    --name cheshire-cat \
    -p 1865:1865 \
    -v $PWD/cat_data:/app/cat_data \
    ghcr.io/cheshire-cat-ai/core:latest
else
  # Check if container is running
  if ! docker ps --format '{{.Names}}' | grep -q "cheshire-cat"; then
    echo "🔄 Starting existing TIPI container..."
    docker start cheshire-cat
  else
    echo "✅ TIPI container is already running"
  fi
fi

# Wait for container to be ready
echo "⏳ Waiting for TIPI container to be ready..."
attempt=1
max_attempts=30
until curl -s http://localhost:1865 > /dev/null || [ $attempt -eq $max_attempts ]; do
  printf "."
  sleep 1
  attempt=$((attempt + 1))
done

if [ $attempt -eq $max_attempts ]; then
  echo "❌ TIPI container failed to start properly"
  echo "Check logs with: docker logs cheshire-cat"
  exit 1
fi

echo "✅ TIPI container is ready!"
echo "📝 API URL: http://localhost:1865"
echo "🔍 Logs: docker logs -f cheshire-cat"

# Get token
TOKEN=$(curl -s -X POST "https://cheshire.geaux.app/auth/token" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}' | jq -r .access_token)

# Test message
curl -X POST "https://cheshire.geaux.app/message" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"text":"What learning style would work best for me?"}'
