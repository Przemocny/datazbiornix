# DataContainer - Platforma do Nauki Pracy z Danymi

Aplikacja edukacyjna dostarczająca realistyczne dane biznesowe z 7 działów w trzech poziomach jakości.

## ✨ Funkcjonalności

- **~1 milion rekordów** danych z różnych działów biznesowych
- **3 poziomy jakości**: idealne, ładne (5-10% błędów), realistyczne (10-20% błędów)
- **REST API** z paginacją, filtrami i eksportem CSV
- **Interaktywny dashboard** do przeglądania danych
- **Dokumentacja Swagger** dla każdego endpointa
- **Admin panel** do zarządzania danymi

## 🚀 Szybki Start

### ⚡ Deployment na Serwerze (VM/VPS)

```bash
# 1. Sklonuj repozytorium
git clone https://github.com/your-repo/datacontainer.git
cd datacontainer

# 2. Zainstaluj Docker (jednorazowo)
./setup.sh

# 3. Uruchom aplikację
./init.sh prod          # Produkcja (port 3005)
# LUB
./init.sh dev           # Development (port 3000)
```

Skrypty automatycznie:
- ✅ Zainstalują Docker i Docker Compose
- ✅ Utworzą plik .env z konfiguracją
- ✅ Zbudują i uruchomią kontenery
- ✅ Wykonają migracje bazy danych
- ✅ Opcjonalnie wypełnią bazę danymi (seed)

### 🔄 Aktualizacja Aplikacji

```bash
# Na serwerze
cd datacontainer
git pull
./init.sh prod          # Restart z nowym kodem
```

---

### 🛠️ Manualna Instalacja

#### Wymagania

- Node.js 18+
- PostgreSQL 14+ (lub Docker)

#### Kroki instalacji

```bash
# 1. Sklonuj repozytorium
git clone <repo-url>
cd datacontainer

# 2. Zainstaluj zależności
npm install

# 3. Skopiuj zmienne środowiskowe
cp .env.example .env

# 4. Uruchom PostgreSQL (Docker)
docker-compose up -d

# 5. Wykonaj migracje Prisma
npx prisma migrate dev --name init

# 6. Wygeneruj Prisma Client
npx prisma generate

# 7. Uruchom seed (może zająć ~10-20 minut)
npm run seed

# 8. Uruchom serwer deweloperski
npm run dev
```

Aplikacja dostępna pod: `http://localhost:3000`

## 📊 Działy Biznesowe

### 🏦 Finanse
- Faktury (150,000)
- Transakcje (200,000)
- Wpisy budżetowe (20,000)
- Centra kosztów (500)

### 💼 Sprzedaż
- Leady (200,000)
- Qualified Leads (50,000)
- Deale (30,000)
- Szanse sprzedażowe (40,000)
- Aktywności sprzedażowe (150,000)

### 📢 Marketing
- Kampanie (5,000)
- Grupy reklamowe (15,000)
- Reklamy (50,000)
- Metryki kampanii (150,000)

### 🚚 Logistyka
- Magazyny (100)
- Paczki (150,000)
- Wysyłki (80,000)
- Trasy dostaw (10,000)
- Ruchy magazynowe (250,000)

### 🛒 E-commerce
- Klienci (50,000)
- Produkty (10,000)
- Zamówienia (100,000)
- Pozycje zamówień (250,000)
- Płatności (100,000)

### 🏭 Produkcja
- Dostawcy (1,000)
- Zamówienia od dostawców (20,000)
- Partie produkcyjne (15,000)
- Kontrole jakości (30,000)
- Stany magazynowe (10,000)

### ⏱️ Time Tracking
- Pracownicy (2,000)
- Projekty (5,000)
- Taski (100,000)
- Wpisy czasu (500,000)

## 🔌 API

### Przykładowe requesty

```bash
# Pobierz faktury (JSON)
curl "http://localhost:3000/api/finance/invoices?quality=ideal&page=1&limit=50"

# Pobierz leady (CSV)
curl "http://localhost:3000/api/sales/leads?quality=realistic&format=csv" -o leads.csv

# Pobierz zamówienia z filtrem
curl "http://localhost:3000/api/ecommerce/orders?status=delivered&sort=orderDate&order=desc"
```

### Parametry wspólne

| Parametr | Typ | Domyślna | Opis |
|----------|-----|----------|------|
| `quality` | string | `ideal` | `ideal`, `clean`, `realistic` |
| `page` | integer | `1` | Numer strony |
| `limit` | integer | `100` | Rekordów na stronę (1-1000) |
| `format` | string | `json` | `json`, `csv` |
| `sort` | string | `id` | Pole sortowania |
| `order` | string | `asc` | `asc`, `desc` |

### Format odpowiedzi

```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 100,
    "total": 150000,
    "totalPages": 1500,
    "quality": "ideal"
  },
  "links": {
    "first": "...",
    "prev": null,
    "next": "...",
    "last": "..."
  }
}
```

## 🎓 Poziomy Jakości Danych

### Idealne (ideal)
- 100% kompletności
- Brak błędów
- Idealne do nauki podstaw

### Ładne (clean)
- 5-10% brakujących wartości
- Drobne niespójności formatowania
- Brak krytycznych błędów

### Realistyczne (realistic)
- 10-20% błędów różnych typów:
  - Brakujące wartości (NULL, puste stringi)
  - Błędne formaty (email bez @, daty jako "TBD")
  - Wartości poza zakresem (ujemne ceny)
  - Duplikaty rekordów
  - Niespójne wartości

## 👨‍💼 Admin Panel

Dostępny pod: `http://localhost:3000/admin`

**API Key (dev):** `dev-admin-key-123`

Funkcjonalności:
- Regeneracja danych (seed)
- Statystyki bazy danych
- Monitoring

## 🐳 Docker

### Tylko PostgreSQL

```bash
docker-compose up -d
```

### Cała aplikacja

```bash
# Build
docker build -t datacontainer .

# Run
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e ADMIN_API_KEY="your-key" \
  datacontainer
```

## 📖 Dokumentacja

- **Pełna specyfikacja:** `description.md`
- **Jak korzystać:** `http://localhost:3000/guide`
- **API Docs:** `http://localhost:3000/api-docs`

## 🛠️ Komendy

```bash
# Development
npm run dev              # Uruchom dev server
npm run build            # Zbuduj produkcyjną wersję
npm run start            # Uruchom produkcyjny build

# Database
npm run seed             # Wygeneruj dane
npx prisma studio        # Otwórz Prisma Studio
npx prisma migrate dev   # Utwórz nową migrację
npx prisma generate      # Wygeneruj Prisma Client

# Linting
npm run lint             # Uruchom ESLint
```

## 📁 Struktura Projektu

```
datacontainer/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── finance/       # Finance endpoints
│   │   ├── sales/         # Sales endpoints
│   │   ├── marketing/     # Marketing endpoints
│   │   ├── logistics/     # Logistics endpoints
│   │   ├── ecommerce/     # Ecommerce endpoints
│   │   ├── production/    # Production endpoints
│   │   ├── timetracking/  # Time tracking endpoints
│   │   └── admin/         # Admin endpoints
│   ├── [domain]/          # Domain pages
│   ├── admin/             # Admin panel
│   ├── guide/             # User guide
│   └── api-docs/          # API documentation
│
├── components/            # React components
├── lib/                   # Core logic
│   ├── api/              # API utilities
│   ├── db/               # Prisma client
│   ├── seed/             # Data generators
│   ├── data-degradation/ # Data quality logic
│   ├── auth/             # Authentication
│   └── constants/        # Constants
│
├── prisma/               # Prisma schema & migrations
├── types/                # TypeScript types
└── public/               # Static assets
```

## 🎯 Use Cases

### Data Science & Analytics
- Ucz się SQL queries
- Ćwicz pandas/R
- Testuj narzędzia BI

### Data Engineering
- Pipeline development
- ETL testing
- Data validation

### Software Development
- API integration testing
- CSV parsing
- Database operations

### Training & Education
- Warsztaty z data cleaning
- Kursy SQL
- Projekty portfolio

## ⚠️ Uwagi

- Wszystkie dane są w 100% fikcyjne i wygenerowane
- Seed może zająć 10-20 minut
- Baza danych zajmuje ~2-3 GB po seedzie
- Pierwsze zapytania mogą być wolniejsze (cold start)

## 📝 Licencja

MIT

## 🤝 Wkład

Projekt stworzony dla celów edukacyjnych. Pull requests mile widziane!

## 📧 Kontakt

W razie pytań lub problemów, utwórz Issue na GitHubie.

---

**Stworzono z ❤️ dla osób uczących się pracy z danymi**
