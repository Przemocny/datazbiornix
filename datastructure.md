# Data Structure

## FINANCE
```
CostCenter
├─> Invoice[] (one-to-many)
└─> BudgetEntry[] (one-to-many)

Invoice
├─> CostCenter (many-to-one)
└─> Transaction[] (one-to-many)

Transaction
├─> Invoice? (many-to-one, optional)
└─> BudgetEntry? (many-to-one, optional)

BudgetEntry
├─> CostCenter (many-to-one)
└─> Transaction[] (one-to-many)
```

## SALES
```
Lead
├─> QualifiedLead? (one-to-one, optional)
└─> SalesActivity[] (one-to-many)

QualifiedLead
├─> Lead (one-to-one)
└─> Deal[] (one-to-many)

Deal
├─> QualifiedLead (many-to-one)
├─> Opportunity[] (one-to-many)
└─> SalesActivity[] (one-to-many)

Opportunity
└─> Deal (many-to-one)

SalesActivity
├─> Lead? (many-to-one, optional)
└─> Deal? (many-to-one, optional)
```

## MARKETING
```
Campaign
├─> AdGroup[] (one-to-many)
└─> CampaignMetric[] (one-to-many)

AdGroup
├─> Campaign (many-to-one)
└─> Ad[] (one-to-many)

Ad
└─> AdGroup (many-to-one)

CampaignMetric
└─> Campaign (many-to-one)
```

## LOGISTICS
```
Warehouse
├─> Package[] (one-to-many)
├─> Shipment[] (one-to-many) [as origin]
├─> DeliveryRoute[] (one-to-many) [as start]
├─> InventoryMovement[] (one-to-many)
└─> WarehouseStock[] (one-to-many)

Package
├─> Warehouse (many-to-one)
└─> InventoryMovement[] (one-to-many)

Shipment
├─> Warehouse (many-to-one) [origin]
└─> InventoryMovement[] (one-to-many)

DeliveryRoute
└─> Warehouse (many-to-one) [start]

InventoryMovement
├─> Warehouse (many-to-one)
├─> Package? (many-to-one, optional)
└─> Shipment? (many-to-one, optional)
```

## ECOMMERCE
```
Customer
└─> Order[] (one-to-many)

Product
├─> Supplier? (many-to-one, optional)
├─> OrderItem[] (one-to-many)
├─> ProductionBatch[] (one-to-many)
└─> WarehouseStock[] (one-to-many)

Order
├─> Customer (many-to-one)
├─> OrderItem[] (one-to-many)
└─> Payment[] (one-to-many)

OrderItem
├─> Order (many-to-one)
└─> Product (many-to-one)

Payment
└─> Order (many-to-one)
```

## PRODUCTION
```
Supplier
├─> SupplierOrder[] (one-to-many)
└─> Product[] (one-to-many)

SupplierOrder
└─> Supplier (many-to-one)

ProductionBatch
├─> Product (many-to-one)
└─> QualityCheck[] (one-to-many)

QualityCheck
└─> ProductionBatch (many-to-one)

WarehouseStock
├─> Product (many-to-one)
└─> Warehouse (many-to-one)
[unique: productId + warehouseId]
```

## TIMETRACKING
```
Employee
├─> Task[] (one-to-many) [assigned]
└─> TimeEntry[] (one-to-many)

Project
├─> Task[] (one-to-many)
└─> TimeEntry[] (one-to-many)

Task
├─> Project (many-to-one)
├─> Employee (many-to-one) [assignedTo]
└─> TimeEntry[] (one-to-many)

TimeEntry
├─> Employee (many-to-one)
├─> Task (many-to-one)
└─> Project (many-to-one)
```

## CROSS-DOMAIN CONNECTIONS
```
Product ←→ Supplier (ECOMMERCE ←→ PRODUCTION)
Product ←→ ProductionBatch (ECOMMERCE ←→ PRODUCTION)
Product ←→ WarehouseStock (ECOMMERCE ←→ LOGISTICS)
Warehouse ←→ WarehouseStock (LOGISTICS ←→ PRODUCTION)
```

