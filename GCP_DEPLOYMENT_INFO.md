# DataZbiornix - Deployment na GCP

## 📊 Status Deploymentu

**Projekt GCP:** `pj-test-437616`  
**Instancja VM:** `datazbiornix-vm`  
**Typ maszyny:** `e2-small` (2GB RAM, 2 vCPU)  
**Region:** `europe-central2-a` (Warszawa)  
**External IP:** `34.116.190.192`  
**Port aplikacji:** `3005`

## 🚨 Aktualny Status

Instancja VM e2-small jest uruchomiona. Większa ilość RAM (2GB) pozwala na pełny deployment aplikacji wraz z bazą danych i seedem.

## 💡 Rozwiązanie

Użytkownik powinien ręcznie dokończyć deployment SSH-ujc się do instancji.

## 🔧 Instrukcje Manualne

### Krok 1: SSH do instancji

```bash
gcloud compute ssh datazbiornix-vm \\
  --zone=europe-central2-a \\
  --project=pj-test-437616 \\
  --ssh-key-file=~/.ssh/google_compute_engine
```

**Problem z SSH?** Spróbuj:
```bash
gcloud compute ssh datazbiornix-vm \\
  --zone=europe-central2-a \\
  --project=pj-test-437616 \\
  --tunnel-through-iap
```

### Krok 2: Pobierz projekt z GCS

```bash
cd /tmp
wget https://storage.googleapis.com/datazbiornix-deploy-1762607288/datazbiornix.tar.gz
mkdir -p datazbiornix
tar -xzf datazbiornix.tar.gz -C datazbiornix
cd datazbiornix
```

### Krok 3: Stwórz plik .env

```bash
cat > .env << 'EOF'
DATABASE_URL="postgresql://datazbiornix:datazbiornix_secure_pass_2024@postgres:5432/datazbiornix"
NODE_ENV=production
POSTGRES_PASSWORD=datazbiornix_secure_pass_2024
EOF
```

### Krok 4: Uruchom Docker Compose

```bash
sudo docker-compose -f docker-compose.prod.yml down || true
sudo docker-compose -f docker-compose.prod.yml up -d --build
```

**Uwaga:** Build może zająć 10-15 minut na e2-micro.

### Krok 5: Sprawdź logi

```bash
# Sprawdź logi aplikacji
sudo docker logs -f datazbiornix-app

# Sprawdź logi bazy danych
sudo docker logs datazbiornix-db

# Sprawdź status kontenerów
sudo docker ps
```

### Krok 6: Poczekaj na build i uruchom migracje

```bash
# Poczekaj aż aplikacja się zbuduje (sprawdź logi powyżej)

# Uruchom migracje Prisma
sudo docker exec datazbiornix-app npx prisma db push --accept-data-loss
```

### Krok 7: Seed danych (opcjonalnie)

**Uwaga:** Seed może zająć 20-30 minut i wymaga dużo pamięci. Na e2-micro może się nie udać.

```bash
sudo docker exec datazbiornix-app npm run seed
```

Jeśli seed fail-uje z powodu braku pamięci, możesz:
1. Pominąć seed i przetestować aplikację bez danych
2. Upgrade'ować instancję do większej (np. e2-small)

### Krok 8: Sprawdź czy działa

Otwórz w przeglądarce:
- `http://34.116.190.192:3005`

Lub z terminala:
```bash
curl http://localhost:3005
```

## 🔄 Alternative: Większa Instancja

Jeśli e2-micro jest za słaba, zmień na e2-small:

```bash
# Stop instancji
gcloud compute instances stop datazbiornix-vm \\
  --zone=europe-central2-a \\
  --project=pj-test-437616

# Zmień machine type
gcloud compute instances set-machine-type datazbiornix-vm \\
  --machine-type=e2-small \\
  --zone=europe-central2-a \\
  --project=pj-test-437616

# Start instancji
gcloud compute instances start datazbiornix-vm \\
  --zone=europe-central2-a \\
  --project=pj-test-437616
```

## 🛑 Zatrzymanie/Usunięcie

### Zatrzymanie instancji (bez usuwania)
```bash
gcloud compute instances stop datazbiornix-vm \\
  --zone=europe-central2-a \\
  --project=pj-test-437616
```

### Usunięcie instancji
```bash
gcloud compute instances delete datazbiornix-vm \\
  --zone=europe-central2-a \\
  --project=pj-test-437616
```

### Usunięcie firewalla
```bash
gcloud compute firewall-rules delete allow-datazbiornix --project=pj-test-437616
gcloud compute firewall-rules delete allow-ssh-ingress-from-iap --project=pj-test-437616
```

### Usunięcie bucketa GCS
```bash
gsutil rm -r gs://datazbiornix-deploy-1762607288/
```

## 📝 Notatki

- Maszyna e2-micro ma tylko 1GB RAM i 2 vCPU (burst), co może być niewystarczające dla Next.js build + PostgreSQL + seed 1M rekordów
- Zalecana maszyna dla pełnego seedu: `e2-small` (2GB RAM) lub `e2-medium` (4GB RAM)
- Koszt e2-small: ~$13/miesiąc przy ciągłym działaniu
- Aplikacja działa na porcie 3005, dostępna przez HTTP (nie HTTPS)

## ✅ Następne Kroki

1. SSH do instancji
2. Sprawdź co się stało ze startup script: `sudo journalctl -u google-startup-scripts -f`
3. Dokończ deployment manualnie zgodnie z instrukcjami powyżej
4. Test aplikacji
5. Jeśli działa - wyślij dane (seed)

