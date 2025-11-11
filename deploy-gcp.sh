#!/bin/bash

# DataContainer - GCP Deployment Script
# Skrypt do wdrożenia aplikacji na Google Cloud Platform

set -e

echo "🚀 DataContainer - Deployment na GCP"
echo "=================================="
echo ""

# Kolory
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Zmienne
PROJECT_NAME="datacontainer"
INSTANCE_NAME="datacontainer-vm"
ZONE="europe-central2-a"
MACHINE_TYPE="e2-small"
IMAGE_FAMILY="ubuntu-2204-lts"
IMAGE_PROJECT="ubuntu-os-cloud"

echo -e "${YELLOW}Krok 1: Sprawdzanie autoryzacji GCP${NC}"
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q "@"; then
    echo -e "${RED}Nie jesteś zalogowany do GCP. Uruchom: gcloud auth login${NC}"
    exit 1
fi

CURRENT_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)")
echo -e "${GREEN}✓ Zalogowany jako: $CURRENT_ACCOUNT${NC}"

echo ""
echo -e "${YELLOW}Krok 2: Wybór projektu${NC}"
gcloud projects list
echo ""
read -p "Podaj PROJECT_ID (lub naciśnij Enter aby stworzyć nowy): " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    PROJECT_ID="datacontainer-$(date +%s)"
    echo "Tworzenie nowego projektu: $PROJECT_ID"
    gcloud projects create $PROJECT_ID --name="DataContainer"
fi

gcloud config set project $PROJECT_ID
echo -e "${GREEN}✓ Projekt ustawiony: $PROJECT_ID${NC}"

echo ""
echo -e "${YELLOW}Krok 3: Włączanie wymaganych API${NC}"
gcloud services enable compute.googleapis.com
echo -e "${GREEN}✓ Compute Engine API włączone${NC}"

echo ""
echo -e "${YELLOW}Krok 4: Tworzenie instancji VM${NC}"
echo "Maszyna: $MACHINE_TYPE (2GB RAM, 2 vCPU)"
echo "Region: $ZONE"

# Sprawdź czy instancja już istnieje
if gcloud compute instances describe $INSTANCE_NAME --zone=$ZONE &>/dev/null; then
    echo -e "${YELLOW}Instancja już istnieje. Usuwam i tworzę od nowa...${NC}"
    gcloud compute instances delete $INSTANCE_NAME --zone=$ZONE --quiet
fi

# Tworzenie instancji
gcloud compute instances create $INSTANCE_NAME \
    --zone=$ZONE \
    --machine-type=$MACHINE_TYPE \
    --image-family=$IMAGE_FAMILY \
    --image-project=$IMAGE_PROJECT \
    --boot-disk-size=30GB \
    --boot-disk-type=pd-standard \
    --tags=http-server,https-server,datacontainer \
    --metadata=startup-script='#!/bin/bash
apt-get update
apt-get install -y docker.io docker-compose git
systemctl start docker
systemctl enable docker
usermod -aG docker ${USER}
'

echo -e "${GREEN}✓ Instancja VM utworzona${NC}"

echo ""
echo -e "${YELLOW}Krok 5: Konfiguracja firewalla${NC}"

# Sprawdź czy reguły już istnieją, jeśli nie - utwórz
if ! gcloud compute firewall-rules describe allow-datacontainer &>/dev/null; then
    gcloud compute firewall-rules create allow-datacontainer \
        --allow=tcp:3005 \
        --source-ranges=0.0.0.0/0 \
        --target-tags=datacontainer \
        --description="Allow port 3005 for DataContainer"
    echo -e "${GREEN}✓ Reguła firewalla utworzona (port 3005)${NC}"
else
    echo -e "${GREEN}✓ Reguła firewalla już istnieje${NC}"
fi

# Czekaj aż instancja się uruchomi
echo ""
echo -e "${YELLOW}Czekam na uruchomienie instancji...${NC}"
sleep 30

# Pobierz external IP
EXTERNAL_IP=$(gcloud compute instances describe $INSTANCE_NAME --zone=$ZONE --format='get(networkInterfaces[0].accessConfigs[0].natIP)')
echo -e "${GREEN}✓ External IP: $EXTERNAL_IP${NC}"

echo ""
echo -e "${YELLOW}Krok 6: Instalacja Dockera i Git (startup script)${NC}"
echo "Czekam 60s na zakończenie startup script..."
sleep 60

echo ""
echo -e "${YELLOW}Krok 7: Kopiowanie projektu na VM${NC}"

# Sprawdź czy .dockerignore istnieje
if [ ! -f .dockerignore ]; then
    cat > .dockerignore << 'EOF'
node_modules
.next
.git
.env
*.log
.DS_Store
EOF
fi

# Stwórz archiwum projektu
tar -czf /tmp/datacontainer.tar.gz \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.git' \
    --exclude='*.log' \
    .

# Kopiuj na VM
gcloud compute scp /tmp/datacontainer.tar.gz $INSTANCE_NAME:/tmp/ --zone=$ZONE

echo -e "${GREEN}✓ Projekt skopiowany${NC}"

echo ""
echo -e "${YELLOW}Krok 8: Deployment aplikacji na VM${NC}"

gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command="
    set -e
    cd /tmp
    mkdir -p datacontainer
    tar -xzf datacontainer.tar.gz -C datacontainer
    cd datacontainer
    
    # Stwórz .env
    cat > .env << 'ENVEOF'
DATABASE_URL=\"postgresql://datacontainer:datacontainer_secure_pass_2024@postgres:5432/datacontainer\"
NODE_ENV=production
POSTGRES_PASSWORD=datacontainer_secure_pass_2024
ENVEOF
    
    # Uruchom docker-compose
    sudo docker-compose -f docker-compose.prod.yml down || true
    sudo docker-compose -f docker-compose.prod.yml up -d --build
    
    echo 'Czekam na uruchomienie bazy danych...'
    sleep 15
    
    # Uruchom migracje Prisma
    sudo docker exec datacontainer-app npx prisma migrate deploy || echo 'Migracje nieudane, próbuję db push...'
    sudo docker exec datacontainer-app npx prisma db push --accept-data-loss || echo 'DB push nieudany'
    
    echo 'Uruchamiam seed...'
    sudo docker exec datacontainer-app npm run seed
"

echo ""
echo -e "${GREEN}=================================="
echo "✅ Deployment zakończony!"
echo "=================================="
echo ""
echo "🌐 Aplikacja dostępna pod adresem:"
echo -e "${GREEN}http://$EXTERNAL_IP:3005${NC}"
echo ""
echo "📊 Strony do sprawdzenia:"
echo "  - http://$EXTERNAL_IP:3005"
echo "  - http://$EXTERNAL_IP:3005/finance"
echo "  - http://$EXTERNAL_IP:3005/admin (klucz: dev-admin-key-123)"
echo ""
echo "🔧 Przydatne komendy:"
echo "  SSH do VM:        gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --project=$PROJECT_ID"
echo "  Logi aplikacji:   gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command='sudo docker logs -f datacontainer-app'"
echo "  Restart:          gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command='cd /tmp/datacontainer && sudo docker-compose -f docker-compose.prod.yml restart'"
echo "  Stop VM:          gcloud compute instances stop $INSTANCE_NAME --zone=$ZONE"
echo "  Start VM:         gcloud compute instances start $INSTANCE_NAME --zone=$ZONE"
echo "  Delete VM:        gcloud compute instances delete $INSTANCE_NAME --zone=$ZONE"
echo ""

