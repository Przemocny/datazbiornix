#!/bin/bash

set -e

echo "=== Node.js & npm Global Installation Script ==="
echo ""

# Remove system-installed Node.js and npm to avoid conflicts
echo "Removing system-installed Node.js and npm (if any)..."
sudo apt-get remove -y nodejs npm 2>/dev/null || true
sudo apt-get autoremove -y 2>/dev/null || true

# Install NVM globally
NVM_DIR="/usr/local/nvm"

if [ ! -d "$NVM_DIR" ]; then
    echo "Installing nvm globally..."
    sudo mkdir -p "$NVM_DIR"
    sudo curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | sudo NVM_DIR="$NVM_DIR" bash
else
    echo "nvm is already installed globally"
    
    echo "Updating nvm..."
    cd "$NVM_DIR"
    sudo git fetch --tags origin
    sudo git checkout `git describe --abbrev=0 --tags --match "v[0-9]*" $(git rev-list --tags --max-count=1)` 2>/dev/null || true
    cd -
fi

# Set ownership to current user for installation
echo "Setting permissions for NVM directory..."
sudo chown -R $(whoami):$(id -gn) "$NVM_DIR"
sudo chmod -R 755 "$NVM_DIR"

# Create global profile script for nvm
echo "Creating global nvm profile..."
sudo tee /etc/profile.d/nvm.sh > /dev/null <<'EOF'
export NVM_DIR="/usr/local/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
EOF

sudo chmod +x /etc/profile.d/nvm.sh

# Also add to /etc/bash.bashrc for interactive shells
echo "Adding nvm to /etc/bash.bashrc..."
if ! grep -q "NVM_DIR" /etc/bash.bashrc 2>/dev/null; then
    echo '' | sudo tee -a /etc/bash.bashrc > /dev/null
    echo '# NVM Configuration' | sudo tee -a /etc/bash.bashrc > /dev/null
    echo 'export NVM_DIR="/usr/local/nvm"' | sudo tee -a /etc/bash.bashrc > /dev/null
    echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' | sudo tee -a /etc/bash.bashrc > /dev/null
    echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' | sudo tee -a /etc/bash.bashrc > /dev/null
fi

# Load nvm for current session
export NVM_DIR="$NVM_DIR"
source "$NVM_DIR/nvm.sh"

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
# Get paths from nvm
NODE_PATH=$(command -v node)
NPM_PATH=$(command -v npm)
NPX_PATH=$(command -v npx)

# Remove old system symlinks/binaries
sudo rm -f /usr/bin/node /usr/bin/npm /usr/bin/npx
sudo rm -f /usr/local/bin/node /usr/local/bin/npm /usr/local/bin/npx

# Create new symlinks
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
echo "================================================"
echo "IMPORTANT: To use nvm in your current session, run:"
echo ""
echo "  source /etc/profile.d/nvm.sh"
echo ""
echo "Or restart your terminal session (logout/login)"
echo "================================================"

