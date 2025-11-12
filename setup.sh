#!/bin/bash

# DataContainer - Setup Script
# Installs Docker and Docker Compose on a clean Ubuntu/Debian system

set -e

echo "=== DataContainer Setup ==="
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

# Check if Docker is already installed
if command -v docker &> /dev/null; then
    echo "✓ Docker already installed: $(docker --version)"
    
    if docker compose version &> /dev/null; then
        echo "✓ Docker Compose already installed: $(docker compose version)"
        echo ""
        echo "Setup complete!"
        exit 0
    fi
fi

echo "Installing Docker and Docker Compose..."
echo ""

# Linux installation (Ubuntu/Debian)
if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
    # Update and install prerequisites
    sudo apt-get update
    sudo apt-get install -y ca-certificates curl gnupg lsb-release
    
    # Add Docker's GPG key
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/$OS/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    
    # Add Docker repository
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/$OS \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Start and enable Docker
    sudo systemctl start docker
    sudo systemctl enable docker
    
    # Add user to docker group
    sudo usermod -aG docker $USER
    
    echo ""
    echo "✓ Docker installed: $(docker --version)"
    echo "✓ Docker Compose installed: $(docker compose version)"
    echo ""
    echo "Note: You may need to log out and back in for group changes to take effect"
    echo "Or run: newgrp docker"
else
    echo "Error: Unsupported OS: $OS"
    echo "This script supports Ubuntu and Debian only"
    exit 1
fi

echo ""
echo "=== Setup Complete ==="

