#!/bin/bash

set -e

echo "=== Docker & Docker Compose Update Script ==="
echo ""

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "Error: Homebrew is not installed."
    echo "Install from: https://brew.sh"
    exit 1
fi

echo "Updating Homebrew..."
brew update

echo ""
echo "Current Docker version:"
docker --version || echo "Docker not installed"

echo ""
echo "Current Docker Compose version:"
docker compose version || echo "Docker Compose not installed"

echo ""
echo "Updating Docker Desktop..."
brew upgrade --cask docker || brew install --cask docker

echo ""
echo "Waiting for Docker to be ready..."
sleep 5

# Wait for Docker daemon to be ready
max_attempts=30
attempt=0
while ! docker info &> /dev/null; do
    attempt=$((attempt + 1))
    if [ $attempt -ge $max_attempts ]; then
        echo "Warning: Docker daemon not responding after $max_attempts attempts"
        echo "You may need to start Docker Desktop manually"
        break
    fi
    echo "Waiting for Docker daemon... ($attempt/$max_attempts)"
    sleep 2
done

echo ""
echo "=== Update Complete ==="
echo ""
echo "Updated Docker version:"
docker --version

echo ""
echo "Updated Docker Compose version:"
docker compose version

echo ""
echo "Docker info:"
docker info | grep -E "Server Version|Operating System|Total Memory|CPUs"

