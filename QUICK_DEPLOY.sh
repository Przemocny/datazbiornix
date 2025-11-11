#!/bin/bash
# Quick deployment commands - do uruchomienia na VM

cd /tmp
wget https://storage.googleapis.com/datacontainer-deploy-1762607288/datacontainer.tar.gz
mkdir -p datacontainer
tar -xzf datacontainer.tar.gz -C datacontainer
cd datacontainer

cat > .env << 'EOF'
DATABASE_URL="postgresql://datacontainer:datacontainer_secure_pass_2024@postgres:5432/datacontainer"
NODE_ENV=production
POSTGRES_PASSWORD=datacontainer_secure_pass_2024
EOF

sudo docker-compose -f docker-compose.prod.yml down || true
sudo docker-compose -f docker-compose.prod.yml up -d --build

echo "Czekaj 5-10 minut na build..."
echo "Sprawdź logi: sudo docker logs -f datacontainer-app"
echo "Potem uruchom: sudo docker exec datacontainer-app npx prisma db push --accept-data-loss"
echo "I seed: sudo docker exec datacontainer-app npm run seed"

