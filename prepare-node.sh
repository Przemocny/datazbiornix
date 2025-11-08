#!/bin/bash

set -e

echo "=== Node.js & npm Global Installation Script ==="
echo ""

# Install NVM globally
NVM_DIR="/usr/local/nvm"

if [ ! -d "$NVM_DIR" ]; then
    echo "Installing nvm globally..."
    sudo mkdir -p "$NVM_DIR"
    sudo curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | sudo NVM_DIR="$NVM_DIR" bash
    sudo chmod -R 755 "$NVM_DIR"
else
    echo "nvm is already installed globally"
    
    echo "Updating nvm..."
    cd "$NVM_DIR"
    sudo git fetch --tags origin
    sudo git checkout `git describe --abbrev=0 --tags --match "v[0-9]*" $(git rev-list --tags --max-count=1)` 2>/dev/null || true
    cd -
fi

# Load nvm
export NVM_DIR="$NVM_DIR"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Create global profile script for nvm
echo "Creating global nvm profile..."
sudo tee /etc/profile.d/nvm.sh > /dev/null <<'EOF'
export NVM_DIR="/usr/local/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
EOF

sudo chmod +x /etc/profile.d/nvm.sh

echo ""
echo "Current Node versions installed:"
nvm list

echo ""
echo "Installing latest LTS version..."
nvm install --lts

echo ""
echo "Installing latest stable version..."
nvm install node

echo ""
echo "Setting latest version as default..."
nvm alias default node

echo ""
echo "Switching to latest version..."
nvm use node

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
echo "Creating global symlinks for node, npm, and npx..."
NODE_PATH=$(which node)
NPM_PATH=$(which npm)
NPX_PATH=$(which npx)

sudo rm -f /usr/local/bin/node /usr/local/bin/npm /usr/local/bin/npx
sudo ln -sf "$NODE_PATH" /usr/local/bin/node
sudo ln -sf "$NPM_PATH" /usr/local/bin/npm
sudo ln -sf "$NPX_PATH" /usr/local/bin/npx

echo ""
echo "Verifying global access..."
echo "node: $(which node) -> $(readlink -f /usr/local/bin/node 2>/dev/null || readlink /usr/local/bin/node)"
echo "npm: $(which npm) -> $(readlink -f /usr/local/bin/npm 2>/dev/null || readlink /usr/local/bin/npm)"
echo "npx: $(which npx) -> $(readlink -f /usr/local/bin/npx 2>/dev/null || readlink /usr/local/bin/npx)"

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
echo "Global binaries available at:"
echo "  /usr/local/bin/node"
echo "  /usr/local/bin/npm"
echo "  /usr/local/bin/npx"

echo ""
echo "To switch between versions:"
echo "  nvm use --lts        # Use LTS version"
echo "  nvm use node         # Use latest version"
echo "  nvm list             # List installed versions"
echo ""
echo "Note: After switching versions with nvm, symlinks will be updated automatically"

