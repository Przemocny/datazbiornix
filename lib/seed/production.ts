import { faker } from '@faker-js/faker'
import { prisma } from '../db/prisma'
import {
  randomEnum,
  randomDecimal,
  randomPastDate,
  randomFutureDate,
  maybe,
  SUPPLIER_ORDER_STATUSES,
  PRODUCTION_STATUSES,
} from './generators/faker-helpers'

export async function seedProduction() {
  console.log('🏭 Seeding Production domain...')

  // Suppliers (1,000)
  console.log('  Creating suppliers...')
  const suppliers = []
  for (let i = 0; i < 1000; i++) {
    suppliers.push({
      companyName: faker.company.name(),
      contactPerson: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      country: faker.location.country(),
      rating: randomDecimal(1, 5),
      active: faker.datatype.boolean({ probability: 0.9 }),
    })
  }
  await prisma.supplier.createMany({ data: suppliers })
  const allSuppliers = await prisma.supplier.findMany()

  // Link some products to suppliers
  const allProducts = await prisma.product.findMany({ where: { supplierId: null } })
  console.log('  Linking products to suppliers...')
  for (let i = 0; i < Math.min(8000, allProducts.length); i++) {
    await prisma.product.update({
      where: { id: allProducts[i].id },
      data: { supplierId: faker.helpers.arrayElement(allSuppliers).id },
    })
  }

  // Supplier Orders (20,000)
  console.log('  Creating supplier orders...')
  const supplierOrders = []
  for (let i = 0; i < 20000; i++) {
    const orderDate = randomPastDate(730)
    const expectedDelivery = new Date(orderDate)
    expectedDelivery.setDate(expectedDelivery.getDate() + faker.number.int({ min: 7, max: 60 }))
    const status = randomEnum(SUPPLIER_ORDER_STATUSES)
    const actualDelivery = status === 'received' ? new Date(expectedDelivery.getTime() + faker.number.int({ min: -86400000 * 3, max: 86400000 * 7 })) : null

    supplierOrders.push({
      orderNumber: `PO-${faker.string.alphanumeric(10).toUpperCase()}`,
      supplierId: faker.helpers.arrayElement(allSuppliers).id,
      orderDate,
      expectedDelivery,
      actualDelivery,
      totalAmount: randomDecimal(1000, 100000),
      status,
    })
  }
  await prisma.supplierOrder.createMany({ data: supplierOrders, skipDuplicates: true })

  // Production Batches (15,000)
  console.log('  Creating production batches...')
  const linkedProducts = await prisma.product.findMany({ where: { supplierId: { not: null } } })
  const batches = []
  for (let i = 0; i < 15000; i++) {
    const startDate = randomPastDate(365)
    const status = randomEnum(PRODUCTION_STATUSES)
    const endDate = status === 'completed' || status === 'failed' ? new Date(startDate.getTime() + faker.number.int({ min: 86400000, max: 86400000 * 14 })) : null
    const quantityPlanned = faker.number.int({ min: 100, max: 10000 })
    const quantityProduced = status === 'completed' ? faker.number.int({ min: quantityPlanned * 0.9, max: quantityPlanned }) : faker.number.int({ min: 0, max: quantityPlanned * 0.5 })

    batches.push({
      batchNumber: `BATCH-${faker.string.alphanumeric(10).toUpperCase()}`,
      productId: faker.helpers.arrayElement(linkedProducts).id,
      quantityPlanned,
      quantityProduced,
      startDate,
      endDate,
      status,
    })
  }
  await prisma.productionBatch.createMany({ data: batches, skipDuplicates: true })
  const allBatches = await prisma.productionBatch.findMany()

  // Quality Checks (30,000)
  console.log('  Creating quality checks...')
  const qualityChecks = []
  for (let i = 0; i < 30000; i++) {
    const defectsFound = faker.number.int({ min: 0, max: 100 })
    const totalChecked = faker.number.int({ min: 100, max: 1000 })
    const passed = defectsFound < totalChecked * 0.05

    qualityChecks.push({
      productionBatchId: faker.helpers.arrayElement(allBatches).id,
      checkDate: randomPastDate(365),
      inspectorName: faker.person.fullName(),
      passed,
      defectsFound,
      defectRate: defectsFound / totalChecked,
      notes: maybe(faker.lorem.sentence(), 0.6),
    })
  }
  await prisma.qualityCheck.createMany({ data: qualityChecks })

  // Warehouse Stock (10,000)
  console.log('  Creating warehouse stock...')
  const warehouses = await prisma.warehouse.findMany()
  const stockEntries = []
  for (let i = 0; i < 10000; i++) {
    stockEntries.push({
      productId: faker.helpers.arrayElement(linkedProducts).id,
      warehouseId: faker.helpers.arrayElement(warehouses).id,
      quantity: faker.number.int({ min: 0, max: 5000 }),
      lastUpdated: randomPastDate(30),
      reorderPoint: faker.number.int({ min: 50, max: 500 }),
      reorderQuantity: faker.number.int({ min: 100, max: 1000 }),
    })
  }
  await prisma.warehouseStock.createMany({ data: stockEntries, skipDuplicates: true })

  console.log('✅ Production domain seeded')
}

