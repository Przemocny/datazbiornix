#!/bin/bash

# DataZbiornix - Universal Initialization Script
# Usage: ./init.sh [dev|prod]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Default to production if no argument
MODE="${1:-prod}"

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   DataZbiornix Initialization Script   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Mode: ${MODE}${NC}"
echo ""

# Validate mode
if [[ "$MODE" != "dev" && "$MODE" != "prod" ]]; then
    echo -e "${RED}❌ Invalid mode: $MODE${NC}"
    echo -e "${YELLOW}Usage: ./init.sh [dev|prod]${NC}"
    exit 1
fi

# Determine docker-compose file
if [ "$MODE" = "prod" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
else
    COMPOSE_FILE="docker-compose.yml"
fi

echo -e "${GREEN}✓ Using: $COMPOSE_FILE${NC}"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Step 1: Check and install Docker
echo -e "${BLUE}[1/7]${NC} Checking Docker installation..."
if ! command_exists docker; then
    echo -e "${YELLOW}Docker not found. Installing...${NC}"
    
    # Detect OS
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID
    else
        echo -e "${RED}❌ Cannot detect OS${NC}"
        exit 1
    fi
    
    case $OS in
        ubuntu|debian)
            sudo apt-get update
            sudo apt-get install -y ca-certificates curl
            sudo install -m 0755 -d /etc/apt/keyrings
            sudo curl -fsSL https://download.docker.com/linux/$OS/gpg -o /etc/apt/keyrings/docker.asc
            sudo chmod a+r /etc/apt/keyrings/docker.asc
            echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/$OS $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
            sudo apt-get update
            sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
            sudo systemctl start docker
            sudo systemctl enable docker
            ;;
        centos|rhel|fedora)
            sudo yum install -y yum-utils
            sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
            sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
            sudo systemctl start docker
            sudo systemctl enable docker
            ;;
        *)
            echo -e "${RED}❌ Unsupported OS: $OS${NC}"
            echo -e "${YELLOW}Please install Docker manually: https://docs.docker.com/engine/install/${NC}"
            exit 1
            ;;
    esac
    
    # Add current user to docker group
    sudo usermod -aG docker $USER
    echo -e "${GREEN}✓ Docker installed successfully${NC}"
    echo -e "${YELLOW}⚠️  You may need to log out and back in for group changes to take effect${NC}"
else
    echo -e "${GREEN}✓ Docker is already installed${NC}"
fi

# Check Docker Compose
echo ""
echo -e "${BLUE}[2/7]${NC} Checking Docker Compose..."
if ! docker compose version >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker Compose not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker Compose is available${NC}"

# Step 2: Create .env file
echo ""
echo -e "${BLUE}[3/7]${NC} Creating .env configuration..."

if [ "$MODE" = "prod" ]; then
    # Generate secure password for production
    DB_PASSWORD=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32)
    cat > .env << EOF
DATABASE_URL="postgresql://datazbiornix:${DB_PASSWORD}@postgres:5432/datazbiornix"
NODE_ENV=production
POSTGRES_PASSWORD=${DB_PASSWORD}
EOF
    echo -e "${GREEN}✓ Production .env created with secure password${NC}"
else
    cat > .env << 'EOF'
DATABASE_URL="postgresql://datazbiornix:devpassword@postgres:5432/datazbiornix"
NODE_ENV=development
POSTGRES_PASSWORD=devpassword
EOF
    echo -e "${GREEN}✓ Development .env created${NC}"
fi

# Step 3: Stop any existing containers
echo ""
echo -e "${BLUE}[4/7]${NC} Cleaning up existing containers..."
docker compose -f $COMPOSE_FILE down -v 2>/dev/null || true
echo -e "${GREEN}✓ Cleanup complete${NC}"

# Step 4: Build and start containers
echo ""
echo -e "${BLUE}[5/7]${NC} Building and starting containers..."
echo -e "${YELLOW}This may take 10-15 minutes for the initial build...${NC}"
docker compose -f $COMPOSE_FILE up -d --build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to start containers${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Containers started successfully${NC}"

# Step 5: Wait for database to be ready
echo ""
echo -e "${BLUE}[6/7]${NC} Waiting for database to be ready..."
sleep 10

APP_CONTAINER=$(docker compose -f $COMPOSE_FILE ps -q app)
DB_CONTAINER=$(docker compose -f $COMPOSE_FILE ps -q postgres)

if [ -z "$APP_CONTAINER" ] || [ -z "$DB_CONTAINER" ]; then
    echo -e "${RED}❌ Containers not running${NC}"
    echo ""
    echo "Checking logs..."
    docker compose -f $COMPOSE_FILE logs --tail=50
    exit 1
fi

# Wait for app to be fully ready
echo "Waiting for application to initialize..."
sleep 15

# Step 6: Run Prisma migrations
echo ""
echo -e "${BLUE}[7/7]${NC} Setting up database schema..."
docker compose -f $COMPOSE_FILE exec -T app npx prisma db push --accept-data-loss --skip-generate

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Database migration failed${NC}"
    echo ""
    echo "Application logs:"
    docker compose -f $COMPOSE_FILE logs app --tail=50
    exit 1
fi

echo -e "${GREEN}✓ Database schema created${NC}"

# Step 7: Optional - Run seed
echo ""
read -p "$(echo -e ${YELLOW}Do you want to seed the database with sample data? [y/N]:${NC} )" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Seeding database... This may take 20-30 minutes!${NC}"
    docker compose -f $COMPOSE_FILE exec -T app npm run seed
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Database seeded successfully${NC}"
    else
        echo -e "${RED}❌ Seeding failed (this is optional, app will still work)${NC}"
    fi
else
    echo -e "${YELLOW}Skipping database seed${NC}"
fi

# Final status check
echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ DataZbiornix is ready!${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""

# Get port
if [ "$MODE" = "prod" ]; then
    PORT=3005
else
    PORT=3000
fi

# Try to get host IP
if command_exists curl; then
    EXTERNAL_IP=$(curl -s ifconfig.me 2>/dev/null || echo "your-server-ip")
else
    EXTERNAL_IP="your-server-ip"
fi

echo -e "${GREEN}🌐 Application URLs:${NC}"
echo -e "   Local:    http://localhost:${PORT}"
echo -e "   Network:  http://${EXTERNAL_IP}:${PORT}"
echo ""

echo -e "${GREEN}📊 Useful commands:${NC}"
echo -e "   View logs:      docker compose -f $COMPOSE_FILE logs -f"
echo -e "   View app logs:  docker compose -f $COMPOSE_FILE logs -f app"
echo -e "   Stop:           docker compose -f $COMPOSE_FILE down"
echo -e "   Restart:        docker compose -f $COMPOSE_FILE restart"
echo -e "   Rebuild:        docker compose -f $COMPOSE_FILE up -d --build"
echo ""

echo -e "${GREEN}🔍 Check status:${NC}"
docker compose -f $COMPOSE_FILE ps
echo ""

echo -e "${YELLOW}📝 Note: Configuration is stored in .env file${NC}"
echo -e "${YELLOW}📚 Documentation: http://localhost:${PORT}/api-docs${NC}"
echo ""

