#!/bin/bash

set -e

echo "=== Node.js & npm Update/Installation Script ==="
echo ""

# Check if nvm is installed
if [ ! -d "$HOME/.nvm" ]; then
    echo "Installing nvm (Node Version Manager)..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    
    # Load nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
else
    echo "nvm is already installed"
    # Load nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    echo "Updating nvm..."
    cd "$NVM_DIR"
    git fetch --tags origin
    git checkout `git describe --abbrev=0 --tags --match "v[0-9]*" $(git rev-list --tags --max-count=1)`
    cd -
fi

echo ""
echo "Current Node versions installed:"
nvm list

echo ""
echo "Installing latest LTS version..."
nvm install --lts
nvm alias default 'lts/*'

echo ""
echo "Installing latest stable version..."
nvm install node

echo ""
echo "Using LTS as default..."
nvm use --lts

echo ""
echo "Current Node version:"
node --version

echo ""
echo "Current npm version:"
npm --version

echo ""
echo "Updating npm to latest version..."
npm install -g npm@latest

echo ""
echo "Current npx version:"
npx --version

echo ""
echo "=== Installation Complete ==="
echo ""
echo "Installed Node versions:"
nvm list

echo ""
echo "Active Node version: $(node --version)"
echo "npm version: $(npm --version)"
echo "npx version: $(npx --version)"

echo ""
echo "To switch between versions:"
echo "  nvm use --lts        # Use LTS version"
echo "  nvm use node         # Use latest version"
echo "  nvm list             # List installed versions"

