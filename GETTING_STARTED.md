# Getting Started - DataZbiornix

## 🎯 Co zostało zaimplementowane

### ✅ Ukończone zadania

1. **description.md** - Pełna specyfikacja projektu (11 sekcji, 600+ linii)
2. **Next.js 14 Setup** - TypeScript, Tailwind CSS, App Router
3. **Prisma Schema** - 33 modele, ~700 linii, wszystkie relacje
4. **Generatory danych** - 7 działów, ~1M rekordów
5. **Mechanizm degradacji** - 3 poziomy jakości danych
6. **API Routes** - 33 endpointy + 2 admin
7. **Dashboard publiczny** - Home, działy, zasoby, guide
8. **Admin Panel** - Auth przez API key, seed, statystyki

### 📊 Statystyki

- **Pliki utworzone:** ~80+
- **Linie kodu:** ~6000+
- **API endpoints:** 35
- **Modele danych:** 33
- **Docelowa liczba rekordów:** ~1,050,000

## 🚀 Pierwsze uruchomienie

### Krok 1: Sprawdź wymagania

```bash
node --version  # Powinno być >= 18
docker --version  # Opcjonalnie dla PostgreSQL
```

### Krok 2: Zainstaluj zależności

```bash
cd /Users/campuscto/Projects/datazbiornix
npm install
```

### Krok 3: Uruchom PostgreSQL

**Opcja A: Docker (zalecane)**
```bash
docker-compose up -d
```

**Opcja B: Lokalny PostgreSQL**
Upewnij się, że PostgreSQL działa i utwórz bazę `datazbiornix`

### Krok 4: Skonfiguruj .env

Plik `.env` został już utworzony z wartościami domyślnymi:
```
DATABASE_URL="postgresql://datazbiornix:datazbiornix_password@localhost:5432/datazbiornix"
ADMIN_API_KEY="dev-admin-key-123"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### Krok 5: Uruchom migracje

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Krok 6: Seed bazy danych

⚠️ **WAŻNE:** Ten krok zajmie 10-20 minut

```bash
npm run seed
```

Zobaczysz progress:
```
🌱 Starting database seed...

🏦 Seeding Finance domain...
  Creating cost centers...
  Creating invoices...
    Invoices: 1000/150000
    Invoices: 2000/150000
    ...
```

### Krok 7: Uruchom aplikację

```bash
npm run dev
```

Otwórz: `http://localhost:3000`

## 🎓 Pierwsze kroki w aplikacji

### 1. Przeglądaj dane

1. Otwórz `http://localhost:3000`
2. Kliknij kartę działu (np. "Finanse")
3. Wybierz zasób (np. "Faktury")
4. Zmień poziom jakości na "Realistyczne"
5. Zobacz błędy w danych

### 2. Testuj API

```bash
# Pobierz pierwsze 10 faktur
curl "http://localhost:3000/api/finance/invoices?limit=10"

# Pobierz realistyczne leady jako CSV
curl "http://localhost:3000/api/sales/leads?quality=realistic&format=csv" -o leads.csv
```

### 3. Sprawdź dokumentację

- Guide: `http://localhost:3000/guide`
- API Docs: `http://localhost:3000/api-docs`

### 4. Wejdź do Admin Panelu

1. Otwórz `http://localhost:3000/admin`
2. Wpisz API key: `dev-admin-key-123`
3. Zobacz statystyki bazy danych

## 📱 Główne URL

- **Homepage:** http://localhost:3000
- **Przykładowy zasób:** http://localhost:3000/finance/invoices
- **Guide:** http://localhost:3000/guide
- **API Docs:** http://localhost:3000/api-docs
- **Admin:** http://localhost:3000/admin

## 🐛 Troubleshooting

### Problem: Błąd połączenia z bazą

**Rozwiązanie:**
```bash
# Sprawdź czy PostgreSQL działa
docker ps

# Jeśli nie, uruchom ponownie
docker-compose down
docker-compose up -d
```

### Problem: Prisma Client nie znaleziony

**Rozwiązanie:**
```bash
npx prisma generate
```

### Problem: Błąd podczas seed

**Rozwiązanie:**
```bash
# Wyczyść bazę i zacznij od nowa
npx prisma migrate reset --force
npx prisma generate
npm run seed
```

### Problem: Port 3000 zajęty

**Rozwiązanie:**
```bash
# Uruchom na innym porcie
PORT=3001 npm run dev
```

### Problem: Wolne zapytania API

To normalne przy pierwszym zapytaniu (cold start Prisma). Kolejne będą szybsze.

## 🔧 Narzędzia developerskie

### Prisma Studio

Graficzny interfejs do przeglądania bazy:

```bash
npx prisma studio
```

Otwiera się na `http://localhost:5555`

### Prisma Format

Formatowanie schema:

```bash
npx prisma format
```

### ESLint

```bash
npm run lint
```

## 📚 Dalsze kroki

### 1. Eksploruj dane

Wybierz dział i zasób, testuj różne poziomy jakości

### 2. Ucz się API

Czytaj dokumentację, testuj endpointy

### 3. Analizuj dane

Pobierz CSV i analizuj w Excel/Python/R

### 4. Ćwicz czyszczenie danych

Używaj trybu "realistic" do nauki wykrywania i naprawiania błędów

## 💡 Przykładowe scenariusze

### Scenariusz 1: Analiza sprzedaży

```bash
# 1. Pobierz wszystkie deale
curl "http://localhost:3000/api/sales/deals?format=csv" -o deals.csv

# 2. Otwórz w Excel
# 3. Policz conversion rate po źródle leada
```

### Scenariusz 2: Czyszczenie danych

```bash
# 1. Pobierz realistyczne faktury
curl "http://localhost:3000/api/finance/invoices?quality=realistic&limit=1000&format=csv" -o invoices_dirty.csv

# 2. Napisz skrypt Python do czyszczenia
# 3. Porównaj z idealnymi danymi
```

### Scenariusz 3: Integracja API

```python
# fetch_data.py
import requests
import pandas as pd

def fetch_all_pages(endpoint, quality='ideal'):
    page = 1
    all_data = []
    
    while True:
        response = requests.get(
            f"http://localhost:3000/api/{endpoint}",
            params={'quality': quality, 'page': page, 'limit': 1000}
        )
        data = response.json()
        all_data.extend(data['data'])
        
        if page >= data['meta']['totalPages']:
            break
        page += 1
    
    return pd.DataFrame(all_data)

# Użycie
df = fetch_all_pages('finance/invoices', quality='realistic')
print(f"Pobrano {len(df)} faktur")
```

## 🎉 Gotowe!

Aplikacja jest w pełni funkcjonalna. Miłej nauki!

Jeśli masz pytania, sprawdź:
- `description.md` - pełna dokumentacja
- `README.md` - podstawowe info
- `http://localhost:3000/guide` - interaktywny guide

---

**Data utworzenia:** 2025-11-08
**Wersja:** 1.0.0

