#!/bin/bash

set -e

echo "=== Docker & Docker Compose Update/Installation Script ==="
echo ""

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
else
    echo "Error: Cannot detect OS"
    exit 1
fi

echo "Detected OS: $OS"
echo ""

echo "Current Docker version:"
docker --version 2>/dev/null || echo "Docker not installed"

echo ""
echo "Current Docker Compose version:"
docker compose version 2>/dev/null || echo "Docker Compose not installed"

echo ""

# Linux installation (Ubuntu/Debian)
if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
    echo "Installing/Updating Docker on Linux..."
    
    # Update package index
    sudo apt-get update
    
    # Install prerequisites
    sudo apt-get install -y \
        ca-certificates \
        curl \
        gnupg \
        lsb-release
    
    # Add Docker's official GPG key
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/$OS/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    
    # Set up repository
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/$OS \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Update package index again
    sudo apt-get update
    
    # Install Docker Engine, CLI, containerd, and Docker Compose plugin
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Start Docker service
    sudo systemctl start docker
    sudo systemctl enable docker
    
    # Add current user to docker group
    sudo usermod -aG docker $USER
    
    echo ""
    echo "Note: You may need to log out and back in for group changes to take effect"
    echo "Or run: newgrp docker"
    
else
    echo "Error: Unsupported OS: $OS"
    echo "This script supports Ubuntu and Debian only"
    exit 1
fi

echo ""
echo "Waiting for Docker daemon to be ready..."
sleep 3

# Wait for Docker daemon to be ready
max_attempts=30
attempt=0
while ! sudo docker info &> /dev/null; do
    attempt=$((attempt + 1))
    if [ $attempt -ge $max_attempts ]; then
        echo "Warning: Docker daemon not responding after $max_attempts attempts"
        break
    fi
    echo "Waiting for Docker daemon... ($attempt/$max_attempts)"
    sleep 2
done

echo ""
echo "=== Installation/Update Complete ==="
echo ""
echo "Docker version:"
sudo docker --version

echo ""
echo "Docker Compose version:"
sudo docker compose version

echo ""
echo "Docker info:"
sudo docker info | grep -E "Server Version|Operating System|Total Memory|CPUs"

