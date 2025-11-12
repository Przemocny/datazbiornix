# DataContainer - Deployment Guide

## 📋 Deployment Workflow

Deployment odbywa się przez GitHub - git push lokalnie, git pull na serwerze.

---

## 🚀 Pierwszy Deployment (Nowy Serwer)

### 1. Przygotuj Serwer

```bash
# SSH do serwera
ssh user@your-server

# Zainstaluj Docker
git clone https://github.com/your-repo/datacontainer.git
cd datacontainer
./setup.sh

# Wyloguj się i zaloguj ponownie (albo: newgrp docker)
exit
ssh user@your-server
```

### 2. Uruchom Aplikację

```bash
cd datacontainer
./init.sh prod
```

**Gotowe!** Aplikacja działa na porcie 3005.

---

## 🔄 Aktualizacja Aplikacji

### Na Serwerze:

```bash
cd datacontainer
git pull
./init.sh prod
```

Init.sh automatycznie:
- Zatrzyma stare kontenery
- Zbuduje nowy obraz z nowym kodem
- Uruchomi aplikację
- Wykona migracje jeśli są potrzebne

---

## 📂 Skrypty

Projekt ma **tylko 2 skrypty**:

### setup.sh
- **Cel:** Instalacja Dockera na czystym systemie
- **Kiedy:** Jednorazowo przy pierwszym deployment
- **Użycie:** `./setup.sh`

### init.sh
- **Cel:** Inicjalizacja/restart aplikacji
- **Kiedy:** Pierwszy deployment i każda aktualizacja
- **Użycie:** `./init.sh [dev|prod]`

---

## 🔧 Podstawowe Komendy

```bash
# Status kontenerów
docker compose -f docker-compose.prod.yml ps

# Logi aplikacji
docker compose -f docker-compose.prod.yml logs -f app

# Restart bez rebuildu
docker compose -f docker-compose.prod.yml restart

# Stop
docker compose -f docker-compose.prod.yml down

# Pełny restart z rebuildem (jak init.sh)
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 🌐 Po Deployment

- **Aplikacja:** `http://your-server-ip:3005`
- **API Docs:** `http://your-server-ip:3005/api-docs`
- **Admin:** `http://your-server-ip:3005/admin`

**Admin API Key:** sprawdź w pliku `.env` (generowane automatycznie)

---

## ⚠️ Wymagania

- **OS:** Ubuntu 20.04+ lub Debian 11+
- **RAM:** Min 2 GB
- **Dysk:** Min 20 GB
- **Porty:** 3005 (prod) lub 3000 (dev) otwarty w firewall

---

## 💡 Przykład Pełnego Flow

```bash
# === LOKALNA MASZYNA ===
git add .
git commit -m "New feature"
git push origin main

# === SERWER ===
ssh user@server
cd datacontainer
git pull
./init.sh prod

# Sprawdź czy działa
curl http://localhost:3005/api/finance/invoices?quality=ideal
```

---

## 🐛 Troubleshooting

### Docker nie jest zainstalowany
```bash
./setup.sh
```

### Kontenery nie startują
```bash
docker compose -f docker-compose.prod.yml logs
```

### Port zajęty
```bash
sudo lsof -i :3005
docker compose -f docker-compose.prod.yml down
```

### Baza danych nie odpowiada
```bash
docker compose -f docker-compose.prod.yml restart postgres
```

---

## 📝 Uwagi

- **setup.sh** trzeba uruchomić tylko **raz** (przy pierwszym deployment)
- **init.sh** uruchamiasz **za każdym razem** gdy robisz update
- Wszystkie dane są w volumenach Docker - przetrwają restart
- Przy rebuild kontenera migracje wykonują się automatycznie

