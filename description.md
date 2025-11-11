# Data Learning Platform - Pełna Specyfikacja

## 1. Wprowadzenie

### 1.1 Cel Aplikacji

Data Learning Platform to aplikacja edukacyjna przeznaczona dla osób **rozpoczynających naukę pracy z danymi i API**. Platforma dostarcza realistyczne dane biznesowe w trzech poziomach jakości, pozwalając na naukę:

- Podstaw obsługi REST API
- Technik czyszczenia i walidacji danych
- Analizy danych z różnych działów biznesowych
- Eksportu i przetwarzania danych w formacie CSV

### 1.2 Dla Kogo?

- Studenci data science i analytics
- Początkujący analitycy danych
- Osoby uczące się programowania i integracji API
- Trenerzy i nauczyciele prowadzący kursy z analizy danych

### 1.3 Co Oferuje Platforma?

- **~1 milion rekordów** danych z 7 różnych działów biznesowych
- **3 poziomy jakości danych**: idealne, ładne (z drobnymi błędami), realistyczne (10-20% błędów)
- **REST API** z paginacją i filtrowaniem
- **Eksport CSV** z możliwością filtrowania
- **Interaktywną dokumentację** API (Swagger)
- **Dashboard wizualizacyjny** do przeglądania danych
- **Tutorial** krok po kroku dla początkujących

---

## 2. Architektura Techniczna

### 2.1 Stack Technologiczny

- **Frontend & Backend**: Next.js 14 (App Router)
- **Język**: TypeScript
- **Baza Danych**: PostgreSQL
- **ORM**: Prisma
- **Dokumentacja API**: Swagger/OpenAPI
- **Deployment**: Docker, Google Cloud Platform

### 2.2 Struktura Danych

**Baza danych:**
- Jedna baza PostgreSQL zawierająca **idealne** dane
- Mechanizm degradacji jakości aplikowany w warstwie API

**Poziomy czystości (parametr `quality`):**

| Poziom | Opis | Charakterystyka |
|--------|------|-----------------|
| `ideal` | Dane perfekcyjne | 100% kompletności, brak błędów, spójne formaty |
| `clean` | Dane ładne | 5-10% brakujących wartości, drobne niespójności formatowania |
| `realistic` | Dane realistyczne | 10-20% błędów: brakujące wartości, niewłaściwe typy, duplikaty, niespójne struktury |

**Typy błędów w danych `realistic`:**
- Brakujące wartości (NULL, puste stringi)
- Niewłaściwe formaty dat (tekst zamiast daty, nieprawidłowe formaty)
- Błędne typy danych (liczby jako string, stringi jako liczby)
- Duplikaty rekordów
- Niespójne wartości (np. różne formaty numerów telefonu)
- Wartości poza zakresem (ujemne ceny, przyszłe daty urodzenia)
- Błędne relacje (FK do nieistniejących rekordów)

---

## 3. Działy Biznesowe i Encje

### 3.1 Finanse (Finance)

**Encje:**

#### `invoices` (Faktury)
- `id`: UUID
- `invoice_number`: string (unikalny numer faktury)
- `issue_date`: date (data wystawienia)
- `due_date`: date (termin płatności)
- `amount`: decimal (kwota)
- `currency`: string (USD, EUR, GBP)
- `status`: enum (draft, sent, paid, overdue, cancelled)
- `customer_name`: string
- `customer_email`: string
- `cost_center_id`: FK → cost_centers

**Relacje:** 1 faktura → 1 centrum kosztów

#### `transactions` (Transakcje)
- `id`: UUID
- `transaction_date`: datetime
- `amount`: decimal
- `type`: enum (debit, credit)
- `category`: string (salary, rent, supplies, revenue)
- `description`: text
- `invoice_id`: FK → invoices (nullable)
- `budget_entry_id`: FK → budget_entries (nullable)

#### `budget_entries` (Wpisy Budżetowe)
- `id`: UUID
- `fiscal_year`: integer
- `quarter`: integer (1-4)
- `department`: string
- `category`: string
- `planned_amount`: decimal
- `actual_amount`: decimal
- `variance`: decimal (calculated)
- `cost_center_id`: FK → cost_centers

#### `cost_centers` (Centra Kosztów)
- `id`: UUID
- `code`: string (unikalny)
- `name`: string
- `department`: string
- `manager_name`: string
- `active`: boolean

**Relacje:**
- 1 cost_center → wiele invoices
- 1 cost_center → wiele budget_entries

**Przybliżona liczba rekordów:**
- invoices: 150,000
- transactions: 200,000
- budget_entries: 20,000
- cost_centers: 500

---

### 3.2 Sprzedaż (Sales)

#### `leads` (Leady)
- `id`: UUID
- `first_name`: string
- `last_name`: string
- `email`: string
- `phone`: string
- `company`: string
- `source`: enum (website, referral, cold_call, event, social_media)
- `status`: enum (new, contacted, qualified, disqualified)
- `created_at`: datetime
- `assigned_to`: string (nazwa sprzedawcy)

#### `qualified_leads` (Zakwalifikowane Leady)
- `id`: UUID
- `lead_id`: FK → leads
- `qualification_date`: datetime
- `budget`: decimal
- `decision_maker`: string
- `timeline`: string (np. "Q2 2024")
- `needs`: text
- `score`: integer (1-100)

#### `deals` (Deale)
- `id`: UUID
- `qualified_lead_id`: FK → qualified_leads
- `deal_name`: string
- `amount`: decimal
- `probability`: integer (0-100)
- `stage`: enum (proposal, negotiation, closed_won, closed_lost)
- `expected_close_date`: date
- `actual_close_date`: date (nullable)
- `owner`: string

#### `opportunities` (Szanse Sprzedażowe)
- `id`: UUID
- `deal_id`: FK → deals
- `product_name`: string
- `quantity`: integer
- `unit_price`: decimal
- `total_value`: decimal
- `notes`: text

#### `sales_activities` (Aktywności Sprzedażowe)
- `id`: UUID
- `lead_id`: FK → leads (nullable)
- `deal_id`: FK → deals (nullable)
- `activity_type`: enum (call, email, meeting, demo)
- `activity_date`: datetime
- `duration_minutes`: integer
- `notes`: text
- `outcome`: string

**Relacje:**
- 1 lead → 0-1 qualified_lead → 0-N deals → 0-N opportunities
- 1 lead → N sales_activities
- 1 deal → N sales_activities

**Przybliżona liczba rekordów:**
- leads: 200,000
- qualified_leads: 50,000
- deals: 30,000
- opportunities: 40,000
- sales_activities: 150,000

---

### 3.3 Marketing (Marketing)

#### `campaigns` (Kampanie Performance)
- `id`: UUID
- `name`: string
- `platform`: enum (google_ads, facebook, linkedin, twitter)
- `start_date`: date
- `end_date`: date (nullable)
- `budget`: decimal
- `status`: enum (draft, active, paused, completed)
- `objective`: string (awareness, leads, sales)

#### `ad_groups` (Grupy Reklamowe)
- `id`: UUID
- `campaign_id`: FK → campaigns
- `name`: string
- `target_audience`: string
- `daily_budget`: decimal

#### `ads` (Reklamy)
- `id`: UUID
- `ad_group_id`: FK → ad_groups
- `headline`: string
- `description`: text
- `cta`: string (call to action)
- `image_url`: string
- `status`: enum (active, paused, rejected)

#### `campaign_metrics` (Metryki Kampanii)
- `id`: UUID
- `campaign_id`: FK → campaigns
- `date`: date
- `impressions`: integer
- `clicks`: integer
- `conversions`: integer
- `cost`: decimal
- `ctr`: decimal (click-through rate)
- `cpc`: decimal (cost per click)
- `conversion_rate`: decimal

**Relacje:**
- 1 campaign → N ad_groups → N ads
- 1 campaign → N campaign_metrics (daily)

**Przybliżona liczba rekordów:**
- campaigns: 5,000
- ad_groups: 15,000
- ads: 50,000
- campaign_metrics: 150,000

---

### 3.4 Logistyka (Logistics)

#### `warehouses` (Magazyny)
- `id`: UUID
- `code`: string (unikalny)
- `name`: string
- `address`: string
- `city`: string
- `country`: string
- `capacity_sqm`: decimal
- `manager`: string

#### `packages` (Paczki)
- `id`: UUID
- `tracking_number`: string (unikalny)
- `weight_kg`: decimal
- `dimensions`: string (format: "LxWxH cm")
- `warehouse_id`: FK → warehouses
- `status`: enum (received, in_transit, delivered, returned, lost)
- `created_at`: datetime

#### `shipments` (Wysyłki)
- `id`: UUID
- `shipment_number`: string (unikalny)
- `origin_warehouse_id`: FK → warehouses
- `destination_address`: string
- `destination_city`: string
- `destination_country`: string
- `carrier`: string (DHL, FedEx, UPS)
- `shipment_date`: datetime
- `estimated_delivery`: date
- `actual_delivery`: date (nullable)
- `status`: enum (pending, picked_up, in_transit, delivered, failed)

#### `delivery_routes` (Trasy Dostaw)
- `id`: UUID
- `route_name`: string
- `driver_name`: string
- `vehicle`: string
- `start_warehouse_id`: FK → warehouses
- `route_date`: date
- `distance_km`: decimal
- `estimated_duration_hours`: decimal

#### `inventory_movements` (Ruchy Magazynowe)
- `id`: UUID
- `warehouse_id`: FK → warehouses
- `movement_type`: enum (inbound, outbound, transfer, adjustment)
- `package_id`: FK → packages (nullable)
- `shipment_id`: FK → shipments (nullable)
- `quantity`: integer
- `movement_date`: datetime
- `notes`: text

**Relacje:**
- 1 warehouse → N packages, shipments, inventory_movements
- 1 shipment → N packages (przez inventory_movements)

**Przybliżona liczba rekordów:**
- warehouses: 100
- packages: 150,000
- shipments: 80,000
- delivery_routes: 10,000
- inventory_movements: 250,000

---

### 3.5 E-commerce

#### `customers` (Klienci)
- `id`: UUID
- `first_name`: string
- `last_name`: string
- `email`: string (unikalny)
- `phone`: string
- `address`: string
- `city`: string
- `country`: string
- `postal_code`: string
- `registration_date`: date
- `customer_type`: enum (regular, premium, vip)

#### `products` (Produkty)
- `id`: UUID
- `sku`: string (unikalny)
- `name`: string
- `description`: text
- `category`: string
- `price`: decimal
- `stock_quantity`: integer
- `supplier_id`: FK → suppliers (z działu Produkcja)
- `active`: boolean

#### `orders` (Zamówienia)
- `id`: UUID
- `order_number`: string (unikalny)
- `customer_id`: FK → customers
- `order_date`: datetime
- `total_amount`: decimal
- `status`: enum (pending, processing, shipped, delivered, cancelled, refunded)
- `shipping_address`: string
- `billing_address`: string

#### `order_items` (Pozycje Zamówień)
- `id`: UUID
- `order_id`: FK → orders
- `product_id`: FK → products
- `quantity`: integer
- `unit_price`: decimal
- `subtotal`: decimal
- `discount`: decimal (nullable)

#### `payments` (Płatności)
- `id`: UUID
- `order_id`: FK → orders
- `payment_date`: datetime
- `amount`: decimal
- `payment_method`: enum (credit_card, paypal, bank_transfer, cash_on_delivery)
- `transaction_id`: string
- `status`: enum (pending, completed, failed, refunded)

**Relacje:**
- 1 customer → N orders
- 1 order → N order_items
- 1 order → 1-N payments
- 1 product → N order_items

**Przybliżona liczba rekordów:**
- customers: 50,000
- products: 10,000
- orders: 100,000
- order_items: 250,000
- payments: 100,000

---

### 3.6 Produkcja (Production)

#### `suppliers` (Dostawcy)
- `id`: UUID
- `company_name`: string
- `contact_person`: string
- `email`: string
- `phone`: string
- `address`: string
- `country`: string
- `rating`: decimal (1-5)
- `active`: boolean

#### `supplier_orders` (Zamówienia od Dostawców)
- `id`: UUID
- `order_number`: string (unikalny)
- `supplier_id`: FK → suppliers
- `order_date`: date
- `expected_delivery`: date
- `actual_delivery`: date (nullable)
- `total_amount`: decimal
- `status`: enum (ordered, confirmed, in_transit, received, cancelled)

#### `production_batches` (Partie Produkcyjne)
- `id`: UUID
- `batch_number`: string (unikalny)
- `product_id`: FK → products (z E-commerce)
- `quantity_planned`: integer
- `quantity_produced`: integer
- `start_date`: datetime
- `end_date`: datetime (nullable)
- `status`: enum (planned, in_progress, completed, failed)

#### `quality_checks` (Kontrole Jakości)
- `id`: UUID
- `production_batch_id`: FK → production_batches
- `check_date`: datetime
- `inspector_name`: string
- `passed`: boolean
- `defects_found`: integer
- `defect_rate`: decimal
- `notes`: text

#### `warehouse_stock` (Stany Magazynowe Produkcji)
- `id`: UUID
- `product_id`: FK → products
- `warehouse_id`: FK → warehouses (z Logistyki)
- `quantity`: integer
- `last_updated`: datetime
- `reorder_point`: integer
- `reorder_quantity`: integer

**Relacje:**
- 1 supplier → N supplier_orders
- 1 production_batch → N quality_checks
- 1 product → 1-N warehouse_stock (różne magazyny)

**Przybliżona liczba rekordów:**
- suppliers: 1,000
- supplier_orders: 20,000
- production_batches: 15,000
- quality_checks: 30,000
- warehouse_stock: 10,000

---

### 3.7 Time Tracking (Śledzenie Czasu)

#### `employees` (Pracownicy)
- `id`: UUID
- `employee_id`: string (unikalny)
- `first_name`: string
- `last_name`: string
- `email`: string
- `department`: string
- `role`: string
- `hourly_rate`: decimal
- `hire_date`: date
- `active`: boolean

#### `projects` (Projekty)
- `id`: UUID
- `project_code`: string (unikalny)
- `name`: string
- `description`: text
- `client_name`: string
- `start_date`: date
- `end_date`: date (nullable)
- `budget_hours`: decimal
- `status`: enum (planning, active, on_hold, completed, cancelled)

#### `tasks` (Taski)
- `id`: UUID
- `project_id`: FK → projects
- `task_key`: string (np. "PROJ-123")
- `title`: string
- `description`: text
- `assigned_to`: FK → employees
- `priority`: enum (low, medium, high, critical)
- `status`: enum (todo, in_progress, in_review, done, blocked)
- `estimated_hours`: decimal
- `created_at`: datetime
- `due_date`: date (nullable)

#### `time_entries` (Wpisy Czasu)
- `id`: UUID
- `employee_id`: FK → employees
- `task_id`: FK → tasks
- `project_id`: FK → projects
- `date`: date
- `hours`: decimal
- `description`: text
- `billable`: boolean

**Relacje:**
- 1 project → N tasks → N time_entries
- 1 employee → N tasks (assigned)
- 1 employee → N time_entries

**Przybliżona liczba rekordów:**
- employees: 2,000
- projects: 5,000
- tasks: 100,000
- time_entries: 500,000

---

## 4. API Specification

### 4.1 Struktura Endpointów

**Format:** `/api/[domain]/[resource]`

**Przykłady:**
- `/api/finance/invoices`
- `/api/sales/leads`
- `/api/logistics/packages`

### 4.2 Parametry Wspólne (Query String)

| Parametr | Typ | Wartości | Domyślna | Opis |
|----------|-----|----------|----------|------|
| `quality` | string | `ideal`, `clean`, `realistic` | `ideal` | Poziom czystości danych |
| `page` | integer | >= 1 | 1 | Numer strony |
| `limit` | integer | 1-1000 | 100 | Liczba rekordów na stronę |
| `format` | string | `json`, `csv` | `json` | Format odpowiedzi |
| `sort` | string | nazwa_pola | `id` | Pole do sortowania |
| `order` | string | `asc`, `desc` | `asc` | Kierunek sortowania |

### 4.3 Filtry Specyficzne dla Zasobów

Każdy zasób może mieć dodatkowe parametry filtrowania:

**Przykład dla `/api/finance/invoices`:**
- `status`: filtruj po statusie
- `from_date`: faktury od daty
- `to_date`: faktury do daty
- `min_amount`: minimalna kwota
- `max_amount`: maksymalna kwota
- `currency`: waluta

**Przykład dla `/api/sales/leads`:**
- `source`: źródło leada
- `status`: status leada
- `assigned_to`: przypisany do sprzedawcy

### 4.4 Przykładowe Requesty

**1. Pobranie idealnych faktur (JSON):**
```
GET /api/finance/invoices?quality=ideal&page=1&limit=50
```

**2. Pobranie realistycznych leadów z filtrem (CSV):**
```
GET /api/sales/leads?quality=realistic&status=qualified&format=csv
```

**3. Pobranie zamówień z sortowaniem:**
```
GET /api/ecommerce/orders?sort=order_date&order=desc&limit=100
```

### 4.5 Format Odpowiedzi JSON

```json
{
  "data": [...], // tablica obiektów
  "meta": {
    "page": 1,
    "limit": 100,
    "total": 150000,
    "total_pages": 1500,
    "quality": "ideal"
  },
  "links": {
    "first": "/api/finance/invoices?page=1&limit=100",
    "prev": null,
    "next": "/api/finance/invoices?page=2&limit=100",
    "last": "/api/finance/invoices?page=1500&limit=100"
  }
}
```

### 4.6 Format Odpowiedzi CSV

Standardowy CSV z nagłówkami:

```csv
id,invoice_number,issue_date,amount,currency,status
uuid-1,INV-001,2024-01-15,1250.00,USD,paid
uuid-2,INV-002,2024-01-16,3400.50,EUR,sent
```

### 4.7 Admin Endpoints

**POST /api/admin/seed**
- Wymaga: API Key w headerze `X-API-Key`
- Body: `{ "domain": "finance" | "all", "count": 10000 }`
- Odpowiedź: status regeneracji

**GET /api/admin/stats**
- Wymaga: API Key
- Odpowiedź: statystyki użycia API, liczba rekordów w bazie

---

## 5. Mechanizm Degradacji Jakości Danych

### 5.1 Poziom `clean` (5-10% błędów)

**Strategia:**
- Losowo usuń 5-10% wartości w polach niewymaganych (NULL)
- Drobne niespójności w formatowaniu (np. różne formaty dat)
- Brak krytycznych błędów

**Przykłady:**
- Email czasem NULL
- Telefon w różnych formatach (+1-555-1234 vs 5551234)
- Adresy z różnymi skrótami (St. vs Street)

### 5.2 Poziom `realistic` (10-20% błędów)

**Strategia:**
- 10-20% rekordów ma co najmniej jeden błąd
- Mix różnych typów błędów
- Zachowaj ~80% danych w dobrej jakości

**Typy błędów:**

1. **Brakujące wartości (30% błędów):**
   - NULL w wymaganych polach
   - Puste stringi
   - Brak relacji FK

2. **Błędne formaty (25% błędów):**
   - Daty jako string: "not available", "TBD"
   - Liczby jako string: "1,234.56" (z przecinkami)
   - Email bez @

3. **Wartości poza zakresem (20% błędów):**
   - Ujemne ceny
   - Przyszłe daty urodzenia
   - Quantity = 0 lub ujemne

4. **Duplikaty (15% błędów):**
   - Zduplikowane rekordy (lekko zmodyfikowane)
   - Te same wartości w polach unikalnych

5. **Niespójności relacyjne (10% błędów):**
   - FK wskazujący na nieistniejące rekordy
   - Circular references

### 5.3 Implementacja w Kodzie

Degradacja jest aplikowana **w czasie rzeczywistym** podczas pobierania danych z API, nie w bazie danych.

Algorytm:
1. Pobierz idealne dane z bazy
2. Jeśli `quality=clean`: zastosuj degradację 5-10%
3. Jeśli `quality=realistic`: zastosuj degradację 10-20%
4. Zwróć zmodyfikowane dane

---

## 6. Interfejs Użytkownika

### 6.1 Język i Lokalizacja

- **Interfejs**: w 100% po polsku
- **Nazwy encji w API**: po angielsku (konwencja REST)
- **Dane w bazie**: międzynarodowe (USA, Lorem Corp, etc.)

### 6.2 Strona Główna `/`

**Sekcje:**

1. **Hero Section**
   - Tytuł: "Platforma do Nauki Pracy z Danymi"
   - Opis: czym jest platforma, dla kogo
   - CTA: "Rozpocznij Naukę"

2. **Działy Biznesowe**
   - 7 kart z ikonami (Finanse, Sprzedaż, Marketing, Logistyka, E-commerce, Produkcja, Time Tracking)
   - Każda karta: opis, liczba dostępnych zasobów
   - Kliknięcie → widok zasobów działu

3. **Poziomy Jakości Danych**
   - Wizualne porównanie: Idealne | Ładne | Realistyczne
   - Ikony i procenty błędów
   - Przykład tego samego rekordu w 3 wersjach

4. **Jak Korzystać?**
   - Zakładka z instrukcjami krok po kroku
   - Przykładowe scenariusze użycia
   - Linki do dokumentacji API

### 6.3 Widok Zasobu `/[domain]/[resource]`

**Komponenty:**

1. **Breadcrumb Navigation**
   - Home > Finanse > Faktury

2. **Panel Kontrolny**
   - Wybór poziomu jakości (Ideal/Clean/Realistic)
   - Pole wyszukiwania
   - Filtry (specyficzne dla zasobu)
   - Sortowanie
   - Przycisk "Pobierz CSV"

3. **Tabela Danych**
   - Responsywna tabela z danymi
   - Tooltipsy nad nagłówkami kolumn (wyjaśnienia)
   - Podświetlenie błędów w trybie Realistic (opcjonalnie)
   - Paginacja (max 1000 na stronę)

4. **Info Box**
   - Statystyki: liczba rekordów, % błędów dla wybranego quality
   - Opis zasobu (co reprezentuje, do czego służy)
   - Przykładowe zapytania API

5. **Przykładowy Request/Response**
   - Side panel z kodem
   - Automatycznie generowany przykład dla aktualnych filtrów

### 6.4 Zakładka "Jak Korzystać?" `/guide`

**Struktur a:**

1. **Czym jest API?**
   - Proste wyjaśnienie dla laika
   - Analogia (np. restauracja - menu to API)

2. **Pierwszy Request**
   - Krok po kroku jak wykonać zapytanie
   - Przykład w przeglądarce
   - Przykład w Postman
   - Przykład w Python/JavaScript

3. **Parametry API**
   - Szczegółowe opisy wszystkich parametrów
   - Przykłady użycia

4. **Praca z CSV**
   - Jak pobrać CSV
   - Jak otworzyć w Excel/Google Sheets
   - Przykłady analizy

5. **Scenariusze Użycia**
   - "Analiza faktur zaległych"
   - "Konwersja leadów na deale"
   - "Optymalizacja kampanii marketingowych"
   - Każdy scenariusz z kodem i oczekiwanymi wynikami

6. **Praca z Brudnymi Danymi**
   - Typy błędów, których szukać
   - Jak je wykrywać
   - Jak je naprawiać (podstawy)

### 6.5 Dokumentacja API `/api-docs`

**Swagger UI:**
- Interaktywna dokumentacja OpenAPI
- Try it out dla każdego endpointa
- Przykładowe odpowiedzi
- Opisy parametrów

### 6.6 Admin Panel `/admin`

**Funkcjonalności:**

1. **Autentykacja**
   - Prosta forma z API Key
   - Walidacja po stronie API

2. **Dashboard Admin**
   - Statystyki: liczba requestów, popularne endpointy
   - Liczba rekordów w bazie (per zasób)
   - Status bazy danych

3. **Zarządzanie Seedem**
   - Przycisk "Regeneruj Wszystkie Dane"
   - Regeneruj wybrane działy
   - Progress bar podczas generowania
   - Historia seedów

4. **Monitoring**
   - Ostatnie requesty
   - Błędy API
   - Top użytkownicy (jeśli tracking włączony)

### 6.7 Tutorial Interaktywny (Onboarding)

**Pierwszy raz na stronie:**

1. **Welcome Modal**
   - "Witaj na Platformie do Nauki!"
   - "Przejdziemy przez podstawy krok po kroku"

2. **Krok 1: Wybierz Dział**
   - Highlight na kartach działów
   - "Kliknij na Finanse aby zobaczyć dostępne dane"

3. **Krok 2: Przeglądaj Dane**
   - Highlight na tabeli
   - "To są faktury. Możesz przewijać i przeglądać rekordy"

4. **Krok 3: Zmień Jakość**
   - Highlight na selectorze quality
   - "Przełącz na 'Realistyczne' aby zobaczyć dane z błędami"

5. **Krok 4: Pobierz CSV**
   - Highlight na przycisku CSV
   - "Pobierz dane do analizy w Excel"

6. **Krok 5: Zobacz API**
   - Highlight na przykładowym requeście
   - "To jest kod który możesz użyć w swoim programie"

7. **Zakończenie**
   - "Gotowe! Możesz teraz eksplorować samodzielnie"
   - Opcja: "Pokaż tutorial ponownie" w menu

---

## 7. Struktura Projektu (Szczegóły)

```
datacontainer/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Homepage
│   ├── globals.css                   # Global styles
│   │
│   ├── [domain]/
│   │   └── [resource]/
│   │       └── page.tsx              # Resource view
│   │
│   ├── guide/
│   │   └── page.tsx                  # How to use guide
│   │
│   ├── api-docs/
│   │   └── page.tsx                  # Swagger UI
│   │
│   ├── admin/
│   │   ├── layout.tsx                # Admin layout
│   │   └── page.tsx                  # Admin dashboard
│   │
│   └── api/
│       ├── finance/
│       │   ├── invoices/route.ts
│       │   ├── transactions/route.ts
│       │   ├── budget_entries/route.ts
│       │   └── cost_centers/route.ts
│       │
│       ├── sales/
│       │   ├── leads/route.ts
│       │   ├── qualified_leads/route.ts
│       │   ├── deals/route.ts
│       │   ├── opportunities/route.ts
│       │   └── sales_activities/route.ts
│       │
│       ├── marketing/
│       │   ├── campaigns/route.ts
│       │   ├── ad_groups/route.ts
│       │   ├── ads/route.ts
│       │   └── campaign_metrics/route.ts
│       │
│       ├── logistics/
│       │   ├── warehouses/route.ts
│       │   ├── packages/route.ts
│       │   ├── shipments/route.ts
│       │   ├── delivery_routes/route.ts
│       │   └── inventory_movements/route.ts
│       │
│       ├── ecommerce/
│       │   ├── customers/route.ts
│       │   ├── products/route.ts
│       │   ├── orders/route.ts
│       │   ├── order_items/route.ts
│       │   └── payments/route.ts
│       │
│       ├── production/
│       │   ├── suppliers/route.ts
│       │   ├── supplier_orders/route.ts
│       │   ├── production_batches/route.ts
│       │   ├── quality_checks/route.ts
│       │   └── warehouse_stock/route.ts
│       │
│       ├── timetracking/
│       │   ├── employees/route.ts
│       │   ├── projects/route.ts
│       │   ├── tasks/route.ts
│       │   └── time_entries/route.ts
│       │
│       └── admin/
│           ├── seed/route.ts         # POST seed endpoint
│           └── stats/route.ts        # GET stats endpoint
│
├── components/
│   ├── ui/                           # shadcn/ui components
│   ├── DomainCard.tsx                # Domain card for homepage
│   ├── ResourceTable.tsx             # Data table component
│   ├── FilterPanel.tsx               # Filtering UI
│   ├── QualitySelector.tsx           # Quality level selector
│   ├── CSVExportButton.tsx           # CSV export button
│   ├── ApiExample.tsx                # API code example
│   ├── Tutorial.tsx                  # Onboarding tutorial
│   └── Tooltip.tsx                   # Custom tooltip
│
├── lib/
│   ├── db/
│   │   └── prisma.ts                 # Prisma client singleton
│   │
│   ├── api/
│   │   ├── pagination.ts             # Pagination utils
│   │   ├── filters.ts                # Query filters
│   │   ├── csv-export.ts             # CSV generation
│   │   └── response.ts               # API response formatter
│   │
│   ├── data-degradation/
│   │   ├── index.ts                  # Main degradation logic
│   │   ├── strategies.ts             # Degradation strategies
│   │   └── error-types.ts            # Types of errors to inject
│   │
│   ├── seed/
│   │   ├── index.ts                  # Main seed orchestrator
│   │   ├── finance.ts                # Finance seed
│   │   ├── sales.ts                  # Sales seed
│   │   ├── marketing.ts              # Marketing seed
│   │   ├── logistics.ts              # Logistics seed
│   │   ├── ecommerce.ts              # Ecommerce seed
│   │   ├── production.ts             # Production seed
│   │   ├── timetracking.ts           # Time tracking seed
│   │   └── generators/               # Data generators
│   │       ├── faker-helpers.ts      # Faker.js helpers
│   │       ├── relations.ts          # Relational data
│   │       └── realistic-data.ts     # Realistic business data
│   │
│   ├── auth/
│   │   └── api-key.ts                # API key validation
│   │
│   └── constants/
│       ├── domains.ts                # Domain definitions
│       ├── resources.ts              # Resource definitions
│       └── error-messages.ts         # Error messages (PL)
│
├── prisma/
│   ├── schema.prisma                 # Prisma schema
│   └── migrations/                   # DB migrations
│
├── public/
│   ├── icons/                        # Domain icons
│   └── images/                       # Images
│
├── types/
│   ├── api.ts                        # API types
│   ├── domain.ts                     # Domain types
│   └── quality.ts                    # Quality level types
│
├── .env.example                      # Example env vars
├── docker-compose.yml                # Docker compose for PG
├── Dockerfile                        # App dockerfile
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

---

## 8. Deployment i Uruchomienie

### 8.1 Wymagania

- Node.js 18+
- PostgreSQL 14+
- Docker (opcjonalnie)

### 8.2 Zmienne Środowiskowe

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/datacontainer"

# Admin
ADMIN_API_KEY="your-secure-api-key-here"

# Next.js
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 8.3 Uruchomienie Lokalne

```bash
# 1. Sklonuj repozytorium
git clone <repo-url>
cd datacontainer

# 2. Zainstaluj zależności
npm install

# 3. Uruchom PostgreSQL (Docker)
docker-compose up -d

# 4. Migracje Prisma
npx prisma migrate dev

# 5. Seed danych
npm run seed

# 6. Uruchom dev server
npm run dev
```

### 8.4 Uruchomienie Docker

```bash
# Build i uruchom wszystko
docker-compose up --build

# Seed przez API
curl -X POST http://localhost:3000/api/admin/seed \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"domain": "all"}'
```

### 8.5 Deployment na GCP

1. **Cloud SQL (PostgreSQL)**
   - Utwórz instancję PostgreSQL
   - Skonfiguruj DATABASE_URL

2. **Cloud Run**
   - Deploy Docker image
   - Ustaw zmienne środowiskowe
   - Ustaw min/max instances

3. **Seed Danych**
   - Uruchom seed przez admin endpoint
   - Lub seed lokalnie i zaimportuj dump

---

## 9. Przyszłe Rozszerzenia (Nice to Have)

- **GraphQL API**: alternatywa dla REST
- **Rate Limiting**: limity requestów per IP
- **Analytics**: tracking użycia dla celów edukacyjnych
- **Więcej działów**: HR, Legal, Customer Support
- **Playground SQL**: wykonuj SQL bezpośrednio w przeglądarce
- **Exporty do innych formatów**: JSON, Parquet, Excel
- **Integracje**: Jupyter Notebook examples, R examples
- **Multi-tenancy**: osobne dane per użytkownik/klasa
- **Webhooks**: powiadomienia o nowych danych

---

## 10. FAQ dla Użytkowników

### Co to jest API?
API (Application Programming Interface) to sposób komunikacji między programami. Wyobraź sobie to jak menu w restauracji - pokazuje co możesz zamówić i jak to zamówić.

### Czym różnią się poziomy jakości?
- **Ideal**: dane perfekcyjne, tak jakby wprowadzał je super dokładny człowiek
- **Clean**: dane z drobnymi błędami, ~95% jest OK
- **Realistic**: dane jak w prawdziwej firmie, ~10-20% wymaga czyszczenia

### Jak mogę użyć tych danych?
- Ucz się SQL i analityki danych
- Testuj narzędzia do czyszczenia danych
- Buduj projekty portfolio
- Prowadź warsztaty i szkolenia

### Czy mogę używać danych komercyjnie?
Dane są całkowicie fikcyjne i wygenerowane. Możesz ich używać do nauki, projektów, szkoleń bez ograniczeń.

### Jak często dane się zmieniają?
Dane są generowane podczas seeda i pozostają statyczne. Admin może je zregenerować w dowolnym momencie.

### Co jeśli znajdę błąd?
Jeśli widzisz błąd w danych `ideal`, to prawdziwy bug! Zgłoś przez GitHub Issues.

---

## 11. Metryki Sukcesu

Projekt będzie sukcesem jeśli:
- Użytkownik bez doświadczenia zrozumie czym jest API w 5 minut
- Wykonanie pierwszego requestu zajmie < 2 minuty
- Pobranie pierwszego CSV zajmie < 1 minutę
- Tutorial będzie intuicyjny bez dokumentacji
- Dane będą wystarczająco realistyczne do nauki czyszczenia

---

**Wersja dokumentu**: 1.0  
**Data utworzenia**: 2025-11-08  
**Autor**: Campus CTO

