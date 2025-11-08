# Entity Relationship Diagrams (ERD)

## 📊 Co zostało dodane

Na każdej stronie działu (`/finance`, `/sales`, `/marketing`, etc.) znajduje się teraz **diagram ERD Mermaid** pokazujący:

1. **Strukturę tabel** - wszystkie tabele w danym dziale
2. **Typy pól** - każde pole z typem danych (uuid, string, decimal, date, etc.)
3. **Klucze** - oznaczenia PK (Primary Key), FK (Foreign Key), UK (Unique Key)
4. **Relacje** - połączenia między tabelami z kardynalnością (||--o{, ||--o|, etc.)

## 🎨 Gdzie zobaczyć

Diagramy są widoczne na stronach działów:

- **http://localhost:3005/finance** - ERD dla Finansów (4 tabele: Cost Center, Invoice, Transaction, Budget Entry)
- **http://localhost:3005/sales** - ERD dla Sprzedaży (5 tabel: Lead, Qualified Lead, Deal, Opportunity, Sales Activity)
- **http://localhost:3005/marketing** - ERD dla Marketingu (4 tabele: Campaign, Ad Group, Ad, Campaign Metric)
- **http://localhost:3005/logistics** - ERD dla Logistyki (5 tabel: Warehouse, Package, Shipment, Delivery Route, Inventory Movement)
- **http://localhost:3005/ecommerce** - ERD dla E-commerce (5 tabel: Customer, Product, Order, Order Item, Payment)
- **http://localhost:3005/production** - ERD dla Produkcji (6 tabel: Supplier, Supplier Order, Product, Production Batch, Quality Check, Warehouse Stock)
- **http://localhost:3005/timetracking** - ERD dla Time Tracking (4 tabele: Employee, Project, Task, Time Entry)

## 📖 Legenda diagramów

### Symbole relacji:

- `||--o{` - One-to-Many (jeden do wielu)
- `||--o|` - One-to-One (jeden do jednego)
- `||--||` - One-to-One (wymagany)
- `}o--o{` - Many-to-Many (wiele do wielu)

### Oznaczenia pól:

- `PK` - Primary Key (klucz główny)
- `FK` - Foreign Key (klucz obcy, relacja)
- `UK` - Unique Key (wartość unikalna)

### Typy danych:

- `uuid` - Uniwersalny unikalny identyfikator
- `string` - Tekst
- `text` - Długi tekst
- `int` - Liczba całkowita
- `decimal` - Liczba dziesiętna
- `date` - Data (bez czasu)
- `datetime` - Data i czas
- `boolean` - Prawda/fałsz

## 🔧 Implementacja techniczna

### Pliki:

1. **`components/MermaidDiagram.tsx`** - Komponent React renderujący diagramy Mermaid
2. **`lib/constants/erd-diagrams.ts`** - Definicje wszystkich 7 diagramów ERD
3. **`app/[domain]/page.tsx`** - Strona działu z wbudowanym diagramem

### Użyta biblioteka:

- **Mermaid** (v11.x) - biblioteka do renderowania diagramów
- **Źródło**: CDN (https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js)
- **Metoda ładowania**: Next.js Script component z strategią `afterInteractive`

## 📋 Przykład struktury (Finance):

```
COST_CENTER ||--o{ INVOICE : "has"
COST_CENTER ||--o{ BUDGET_ENTRY : "has"
INVOICE ||--o{ TRANSACTION : "has"
BUDGET_ENTRY ||--o{ TRANSACTION : "has"

Każdy Cost Center może mieć wiele Invoice
Każda Invoice może mieć wiele Transaction
```

## 🎯 Korzyści dla użytkownika

1. **Zrozumienie struktury** - Natychmiastowy wgląd w organizację danych
2. **Planowanie zapytań** - Widać jakie JOIN-y będą potrzebne
3. **Nauka SQL** - Doskonałe do uczenia się relacji między tabelami
4. **Debugowanie** - Łatwe sprawdzenie jakie pola są dostępne

## 🚀 Rozszerzenia na przyszłość

Możliwe ulepszenia:
- Dodanie możliwości kliknięcia w tabelę → przejście do danych
- Kolorowanie tabel według typu (transakcyjne, master data, etc.)
- Interaktywne podświetlanie relacji
- Export diagramu jako PNG/SVG

