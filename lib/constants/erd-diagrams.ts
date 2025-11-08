export const ERD_DIAGRAMS: Record<string, string> = {
  finance: `erDiagram
    COST_CENTER ||--o{ INVOICE : "posiada wiele"
    COST_CENTER ||--o{ BUDGET_ENTRY : "posiada wiele"
    INVOICE ||--o{ TRANSACTION : "zawiera wiele"
    BUDGET_ENTRY ||--o{ TRANSACTION : "zawiera wiele"

    COST_CENTER {
        uuid id PK "Unikalny identyfikator"
        string code UK "Kod centrum"
        string name "Nazwa centrum"
        string department "Dział"
        string manager "Menedżer"
        boolean active "Czy aktywne"
    }

    INVOICE {
        uuid id PK "Unikalny identyfikator"
        string invoice_number UK "Numer faktury"
        date issue_date "Data wystawienia"
        date due_date "Termin płatności"
        decimal amount "Kwota"
        string currency "Waluta"
        string status "Status"
        string customer_name "Nazwa klienta"
        string customer_email "Email klienta"
        uuid cost_center_id FK "Centrum kosztów"
    }

    TRANSACTION {
        uuid id PK "Unikalny identyfikator"
        datetime transaction_date "Data transakcji"
        decimal amount "Kwota"
        string type "Typ transakcji"
        string category "Kategoria"
        text description "Opis"
        uuid invoice_id FK "Faktura"
        uuid budget_entry_id FK "Wpis budżetowy"
    }

    BUDGET_ENTRY {
        uuid id PK "Unikalny identyfikator"
        int fiscal_year "Rok fiskalny"
        int quarter "Kwartał"
        string department "Dział"
        string category "Kategoria"
        decimal planned_amount "Kwota planowana"
        decimal actual_amount "Kwota rzeczywista"
        decimal variance "Wariancja"
        uuid cost_center_id FK "Centrum kosztów"
    }
`,

  sales: `erDiagram
    LEAD ||--o| QUALIFIED_LEAD : "kwalifikuje się do"
    QUALIFIED_LEAD ||--o{ DEAL : "posiada wiele"
    DEAL ||--o{ OPPORTUNITY : "zawiera wiele"
    LEAD ||--o{ SALES_ACTIVITY : "ma wiele aktywności"
    DEAL ||--o{ SALES_ACTIVITY : "ma wiele aktywności"

    LEAD {
        uuid id PK "Unikalny identyfikator"
        string first_name "Imię"
        string last_name "Nazwisko"
        string email "Email"
        string phone "Telefon"
        string company "Firma"
        string source "Źródło"
        string status "Status"
        datetime created_at "Data utworzenia"
        string assigned_to "Przypisany do"
    }

    QUALIFIED_LEAD {
        uuid id PK "Unikalny identyfikator"
        uuid lead_id FK "Lead (UK)"
        datetime qualification_date "Data kwalifikacji"
        decimal budget "Budżet"
        string decision_maker "Decydent"
        string timeline "Termin"
        text needs "Potrzeby"
        int score "Ocena"
    }

    DEAL {
        uuid id PK "Unikalny identyfikator"
        uuid qualified_lead_id FK "Kwalifikowany lead"
        string deal_name "Nazwa dealu"
        decimal amount "Kwota"
        int probability "Prawdopodobieństwo"
        string stage "Etap"
        date expected_close_date "Oczekiwana data zamknięcia"
        date actual_close_date "Rzeczywista data zamknięcia"
        string owner "Właściciel"
    }

    OPPORTUNITY {
        uuid id PK "Unikalny identyfikator"
        uuid deal_id FK "Deal"
        string product_name "Nazwa produktu"
        int quantity "Ilość"
        decimal unit_price "Cena jednostkowa"
        decimal total_value "Wartość całkowita"
        text notes "Notatki"
    }

    SALES_ACTIVITY {
        uuid id PK "Unikalny identyfikator"
        uuid lead_id FK "Lead"
        uuid deal_id FK "Deal"
        string activity_type "Typ aktywności"
        datetime activity_date "Data aktywności"
        int duration_minutes "Czas trwania (minuty)"
        text notes "Notatki"
        string outcome "Wynik"
    }
`,

  marketing: `erDiagram
    CAMPAIGN ||--o{ AD_GROUP : "zawiera wiele"
    AD_GROUP ||--o{ AD : "zawiera wiele"
    CAMPAIGN ||--o{ CAMPAIGN_METRIC : "śledzi metryki"

    CAMPAIGN {
        uuid id PK "Unikalny identyfikator"
        string name "Nazwa kampanii"
        string platform "Platforma"
        date start_date "Data rozpoczęcia"
        date end_date "Data zakończenia"
        decimal budget "Budżet"
        string status "Status"
        string objective "Cel kampanii"
    }

    AD_GROUP {
        uuid id PK "Unikalny identyfikator"
        uuid campaign_id FK "Kampania"
        string name "Nazwa grupy"
        string target_audience "Grupa docelowa"
        decimal daily_budget "Dzienny budżet"
    }

    AD {
        uuid id PK "Unikalny identyfikator"
        uuid ad_group_id FK "Grupa reklamowa"
        string headline "Nagłówek"
        text description "Opis"
        string cta "Wezwanie do działania"
        string image_url "URL obrazka"
        string status "Status"
    }

    CAMPAIGN_METRIC {
        uuid id PK "Unikalny identyfikator"
        uuid campaign_id FK "Kampania"
        date date "Data"
        int impressions "Wyświetlenia"
        int clicks "Kliknięcia"
        int conversions "Konwersje"
        decimal cost "Koszt"
        decimal ctr "CTR"
        decimal cpc "CPC"
        decimal conversion_rate "Wskaźnik konwersji"
    }
`,

  logistics: `erDiagram
    WAREHOUSE ||--o{ PACKAGE : "przechowuje"
    WAREHOUSE ||--o{ SHIPMENT : "miejsce nadania"
    WAREHOUSE ||--o{ DELIVERY_ROUTE : "punkt początkowy"
    WAREHOUSE ||--o{ INVENTORY_MOVEMENT : "rejestruje ruchy"
    PACKAGE ||--o{ INVENTORY_MOVEMENT : "śledzi ruch"
    SHIPMENT ||--o{ INVENTORY_MOVEMENT : "śledzi ruch"

    WAREHOUSE {
        uuid id PK "Unikalny identyfikator"
        string code UK "Kod magazynu"
        string name "Nazwa"
        string address "Adres"
        string city "Miasto"
        string country "Kraj"
        decimal capacity_sqm "Pojemność (m²)"
        string manager "Kierownik"
    }

    PACKAGE {
        uuid id PK "Unikalny identyfikator"
        string tracking_number UK "Numer przesyłki"
        decimal weight_kg "Waga (kg)"
        string dimensions "Wymiary"
        uuid warehouse_id FK "Magazyn"
        string status "Status"
        datetime created_at "Data utworzenia"
    }

    SHIPMENT {
        uuid id PK "Unikalny identyfikator"
        string shipment_number UK "Numer wysyłki"
        uuid origin_warehouse_id FK "Magazyn nadania"
        string destination_address "Adres docelowy"
        string destination_city "Miasto docelowe"
        string destination_country "Kraj docelowy"
        string carrier "Przewoźnik"
        datetime shipment_date "Data wysyłki"
        date estimated_delivery "Szacowana dostawa"
        date actual_delivery "Rzeczywista dostawa"
        string status "Status"
    }

    DELIVERY_ROUTE {
        uuid id PK "Unikalny identyfikator"
        string route_name "Nazwa trasy"
        string driver_name "Kierowca"
        string vehicle "Pojazd"
        uuid start_warehouse_id FK "Magazyn początkowy"
        date route_date "Data trasy"
        decimal distance_km "Dystans (km)"
        decimal estimated_duration_hours "Szacowany czas (h)"
    }

    INVENTORY_MOVEMENT {
        uuid id PK "Unikalny identyfikator"
        uuid warehouse_id FK "Magazyn"
        string movement_type "Typ ruchu"
        uuid package_id FK "Paczka"
        uuid shipment_id FK "Wysyłka"
        int quantity "Ilość"
        datetime movement_date "Data ruchu"
        text notes "Notatki"
    }
`,

  ecommerce: `erDiagram
    CUSTOMER ||--o{ ORDER : "składa zamówienia"
    ORDER ||--o{ ORDER_ITEM : "zawiera pozycje"
    PRODUCT ||--o{ ORDER_ITEM : "występuje w"
    ORDER ||--o{ PAYMENT : "posiada płatność"

    CUSTOMER {
        uuid id PK "Unikalny identyfikator"
        string first_name "Imię"
        string last_name "Nazwisko"
        string email UK "Email"
        string phone "Telefon"
        string address "Adres"
        string city "Miasto"
        string country "Kraj"
        string postal_code "Kod pocztowy"
        date registration_date "Data rejestracji"
        string customer_type "Typ klienta"
    }

    PRODUCT {
        uuid id PK "Unikalny identyfikator"
        string sku UK "SKU"
        string name "Nazwa"
        text description "Opis"
        string category "Kategoria"
        decimal price "Cena"
        int stock_quantity "Stan magazynowy"
        uuid supplier_id FK "Dostawca"
        boolean active "Czy aktywny"
    }

    ORDER {
        uuid id PK "Unikalny identyfikator"
        string order_number UK "Numer zamówienia"
        uuid customer_id FK "Klient"
        datetime order_date "Data zamówienia"
        decimal total_amount "Wartość całkowita"
        string status "Status"
        string shipping_address "Adres wysyłki"
        string billing_address "Adres rozliczeniowy"
    }

    ORDER_ITEM {
        uuid id PK "Unikalny identyfikator"
        uuid order_id FK "Zamówienie"
        uuid product_id FK "Produkt"
        int quantity "Ilość"
        decimal unit_price "Cena jednostkowa"
        decimal subtotal "Suma częściowa"
        decimal discount "Rabat"
    }

    PAYMENT {
        uuid id PK "Unikalny identyfikator"
        uuid order_id FK "Zamówienie"
        datetime payment_date "Data płatności"
        decimal amount "Kwota"
        string payment_method "Metoda płatności"
        string transaction_id "ID transakcji"
        string status "Status"
    }
`,

  production: `erDiagram
    SUPPLIER ||--o{ SUPPLIER_ORDER : "otrzymuje zamówienia"
    SUPPLIER ||--o{ PRODUCT : "dostarcza produkty"
    PRODUCT ||--o{ PRODUCTION_BATCH : "produkowana w"
    PRODUCTION_BATCH ||--o{ QUALITY_CHECK : "przechodzi kontrolę"
    PRODUCT ||--o{ WAREHOUSE_STOCK : "przechowywany w"
    WAREHOUSE ||--o{ WAREHOUSE_STOCK : "zawiera"

    SUPPLIER {
        uuid id PK "Unikalny identyfikator"
        string company_name "Nazwa firmy"
        string contact_person "Osoba kontaktowa"
        string email "Email"
        string phone "Telefon"
        string address "Adres"
        string country "Kraj"
        decimal rating "Ocena"
        boolean active "Czy aktywny"
    }

    SUPPLIER_ORDER {
        uuid id PK "Unikalny identyfikator"
        string order_number UK "Numer zamówienia"
        uuid supplier_id FK "Dostawca"
        date order_date "Data zamówienia"
        date expected_delivery "Oczekiwana dostawa"
        date actual_delivery "Rzeczywista dostawa"
        decimal total_amount "Wartość całkowita"
        string status "Status"
    }

    PRODUCT {
        uuid id PK "Unikalny identyfikator"
        string sku UK "SKU"
        string name "Nazwa"
        text description "Opis"
        string category "Kategoria"
        decimal price "Cena"
        int stock_quantity "Stan magazynowy"
        uuid supplier_id FK "Dostawca"
        boolean active "Czy aktywny"
    }

    PRODUCTION_BATCH {
        uuid id PK "Unikalny identyfikator"
        string batch_number UK "Numer partii"
        uuid product_id FK "Produkt"
        int quantity_planned "Planowana ilość"
        int quantity_produced "Wyprodukowana ilość"
        datetime start_date "Data rozpoczęcia"
        datetime end_date "Data zakończenia"
        string status "Status"
    }

    QUALITY_CHECK {
        uuid id PK "Unikalny identyfikator"
        uuid production_batch_id FK "Partia produkcyjna"
        datetime check_date "Data kontroli"
        string inspector_name "Inspektor"
        boolean passed "Czy przeszła"
        int defects_found "Znalezione defekty"
        decimal defect_rate "Wskaźnik defektów"
        text notes "Notatki"
    }

    WAREHOUSE_STOCK {
        uuid id PK "Unikalny identyfikator"
        uuid product_id FK "Produkt"
        uuid warehouse_id FK "Magazyn"
        int quantity "Ilość"
        datetime last_updated "Ostatnia aktualizacja"
        int reorder_point "Punkt zamówienia"
        int reorder_quantity "Ilość zamówienia"
    }

    WAREHOUSE {
        uuid id PK "Unikalny identyfikator"
        string code UK "Kod magazynu"
        string name "Nazwa"
    }
`,

  timetracking: `erDiagram
    EMPLOYEE ||--o{ TASK : "przypisany do"
    PROJECT ||--o{ TASK : "zawiera zadania"
    EMPLOYEE ||--o{ TIME_ENTRY : "rejestruje czas"
    TASK ||--o{ TIME_ENTRY : "śledzi czas"
    PROJECT ||--o{ TIME_ENTRY : "należy do"

    EMPLOYEE {
        uuid id PK "Unikalny identyfikator"
        string employee_id UK "ID pracownika"
        string first_name "Imię"
        string last_name "Nazwisko"
        string email UK "Email"
        string department "Dział"
        string role "Rola"
        decimal hourly_rate "Stawka godzinowa"
        date hire_date "Data zatrudnienia"
        boolean active "Czy aktywny"
    }

    PROJECT {
        uuid id PK "Unikalny identyfikator"
        string project_code UK "Kod projektu"
        string name "Nazwa"
        text description "Opis"
        string client_name "Nazwa klienta"
        date start_date "Data rozpoczęcia"
        date end_date "Data zakończenia"
        decimal budget_hours "Budżet godzinowy"
        string status "Status"
    }

    TASK {
        uuid id PK "Unikalny identyfikator"
        uuid project_id FK "Projekt"
        string task_key UK "Klucz zadania"
        string title "Tytuł"
        text description "Opis"
        uuid assigned_to_id FK "Przypisany do"
        string priority "Priorytet"
        string status "Status"
        decimal estimated_hours "Szacowany czas (h)"
        datetime created_at "Data utworzenia"
        date due_date "Termin"
    }

    TIME_ENTRY {
        uuid id PK "Unikalny identyfikator"
        uuid employee_id FK "Pracownik"
        uuid task_id FK "Zadanie"
        uuid project_id FK "Projekt"
        date date "Data"
        decimal hours "Godziny"
        text description "Opis"
        boolean billable "Czy rozliczalne"
    }
`,
}

