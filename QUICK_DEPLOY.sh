#!/bin/bash
# Quick deployment commands - do uruchomienia na VM

cd /tmp
wget https://storage.googleapis.com/datazbiornix-deploy-1762607288/datazbiornix.tar.gz
mkdir -p datazbiornix
tar -xzf datazbiornix.tar.gz -C datazbiornix
cd datazbiornix

cat > .env << 'EOF'
DATABASE_URL="postgresql://datazbiornix:datazbiornix_secure_pass_2024@postgres:5432/datazbiornix"
NODE_ENV=production
POSTGRES_PASSWORD=datazbiornix_secure_pass_2024
EOF

sudo docker-compose -f docker-compose.prod.yml down || true
sudo docker-compose -f docker-compose.prod.yml up -d --build

echo "Czekaj 5-10 minut na build..."
echo "Sprawdź logi: sudo docker logs -f datazbiornix-app"
echo "Potem uruchom: sudo docker exec datazbiornix-app npx prisma db push --accept-data-loss"
echo "I seed: sudo docker exec datazbiornix-app npm run seed"

