export interface Resource {
  key: string
  name: string
  namePlural: string
  description: string
  model: string
}

export interface Domain {
  key: string
  name: string
  description: string
  icon: string
  resources: Resource[]
}

export const DOMAINS: Domain[] = [
  {
    key: 'finance',
    name: 'Finanse',
    description: 'Faktury, transakcje, budżety i centra kosztów',
    icon: '🏦',
    resources: [
      { key: 'invoices', name: 'Faktura', namePlural: 'Faktury', description: 'Faktury wystawione i otrzymane', model: 'invoice' },
      { key: 'transactions', name: 'Transakcja', namePlural: 'Transakcje', description: 'Transakcje finansowe', model: 'transaction' },
      { key: 'budget_entries', name: 'Wpis budżetowy', namePlural: 'Wpisy budżetowe', description: 'Wpisy w budżecie', model: 'budgetEntry' },
      { key: 'cost_centers', name: 'Centrum kosztów', namePlural: 'Centra kosztów', description: 'Centra kosztów', model: 'costCenter' },
    ],
  },
  {
    key: 'sales',
    name: 'Sprzedaż',
    description: 'Leady, deale, szanse sprzedażowe i aktywności',
    icon: '💼',
    resources: [
      { key: 'leads', name: 'Lead', namePlural: 'Leady', description: 'Potencjalni klienci', model: 'lead' },
      { key: 'qualified_leads', name: 'Qualified Lead', namePlural: 'Qualified Leads', description: 'Zakwalifikowane leady', model: 'qualifiedLead' },
      { key: 'deals', name: 'Deal', namePlural: 'Deale', description: 'Aktywne deale sprzedażowe', model: 'deal' },
      { key: 'opportunities', name: 'Szansa', namePlural: 'Szanse sprzedażowe', description: 'Szanse sprzedażowe', model: 'opportunity' },
      { key: 'sales_activities', name: 'Aktywność', namePlural: 'Aktywności sprzedażowe', description: 'Aktywności sprzedażowe', model: 'salesActivity' },
    ],
  },
  {
    key: 'marketing',
    name: 'Marketing',
    description: 'Kampanie, reklamy i metryki performance',
    icon: '📢',
    resources: [
      { key: 'campaigns', name: 'Kampania', namePlural: 'Kampanie', description: 'Kampanie marketingowe', model: 'campaign' },
      { key: 'ad_groups', name: 'Grupa reklamowa', namePlural: 'Grupy reklamowe', description: 'Grupy reklamowe', model: 'adGroup' },
      { key: 'ads', name: 'Reklama', namePlural: 'Reklamy', description: 'Reklamy', model: 'ad' },
      { key: 'campaign_metrics', name: 'Metryka', namePlural: 'Metryki kampanii', description: 'Metryki kampanii', model: 'campaignMetric' },
    ],
  },
  {
    key: 'logistics',
    name: 'Logistyka',
    description: 'Magazyny, paczki, wysyłki i ruchy magazynowe',
    icon: '🚚',
    resources: [
      { key: 'warehouses', name: 'Magazyn', namePlural: 'Magazyny', description: 'Magazyny', model: 'warehouse' },
      { key: 'packages', name: 'Paczka', namePlural: 'Paczki', description: 'Paczki', model: 'package' },
      { key: 'shipments', name: 'Wysyłka', namePlural: 'Wysyłki', description: 'Wysyłki', model: 'shipment' },
      { key: 'delivery_routes', name: 'Trasa dostawy', namePlural: 'Trasy dostaw', description: 'Trasy dostaw', model: 'deliveryRoute' },
      { key: 'inventory_movements', name: 'Ruch magazynowy', namePlural: 'Ruchy magazynowe', description: 'Ruchy magazynowe', model: 'inventoryMovement' },
    ],
  },
  {
    key: 'ecommerce',
    name: 'E-commerce',
    description: 'Klienci, produkty, zamówienia i płatności',
    icon: '🛒',
    resources: [
      { key: 'customers', name: 'Klient', namePlural: 'Klienci', description: 'Klienci sklepu', model: 'customer' },
      { key: 'products', name: 'Produkt', namePlural: 'Produkty', description: 'Produkty w sklepie', model: 'product' },
      { key: 'orders', name: 'Zamówienie', namePlural: 'Zamówienia', description: 'Zamówienia', model: 'order' },
      { key: 'order_items', name: 'Pozycja zamówienia', namePlural: 'Pozycje zamówień', description: 'Pozycje zamówień', model: 'orderItem' },
      { key: 'payments', name: 'Płatność', namePlural: 'Płatności', description: 'Płatności', model: 'payment' },
    ],
  },
  {
    key: 'production',
    name: 'Produkcja',
    description: 'Dostawcy, partie produkcyjne i kontrole jakości',
    icon: '🏭',
    resources: [
      { key: 'suppliers', name: 'Dostawca', namePlural: 'Dostawcy', description: 'Dostawcy', model: 'supplier' },
      { key: 'supplier_orders', name: 'Zamówienie od dostawcy', namePlural: 'Zamówienia od dostawców', description: 'Zamówienia od dostawców', model: 'supplierOrder' },
      { key: 'production_batches', name: 'Partia produkcyjna', namePlural: 'Partie produkcyjne', description: 'Partie produkcyjne', model: 'productionBatch' },
      { key: 'quality_checks', name: 'Kontrola jakości', namePlural: 'Kontrole jakości', description: 'Kontrole jakości', model: 'qualityCheck' },
      { key: 'warehouse_stock', name: 'Stan magazynowy', namePlural: 'Stany magazynowe', description: 'Stany magazynowe', model: 'warehouseStock' },
    ],
  },
  {
    key: 'timetracking',
    name: 'Time Tracking',
    description: 'Pracownicy, projekty, taski i wpisy czasu',
    icon: '⏱️',
    resources: [
      { key: 'employees', name: 'Pracownik', namePlural: 'Pracownicy', description: 'Pracownicy', model: 'employee' },
      { key: 'projects', name: 'Projekt', namePlural: 'Projekty', description: 'Projekty', model: 'project' },
      { key: 'tasks', name: 'Task', namePlural: 'Taski', description: 'Taski', model: 'task' },
      { key: 'time_entries', name: 'Wpis czasu', namePlural: 'Wpisy czasu', description: 'Wpisy czasu', model: 'timeEntry' },
    ],
  },
]

export function getDomain(key: string): Domain | undefined {
  return DOMAINS.find(d => d.key === key)
}

export function getResource(domainKey: string, resourceKey: string): Resource | undefined {
  const domain = getDomain(domainKey)
  return domain?.resources.find(r => r.key === resourceKey)
}

