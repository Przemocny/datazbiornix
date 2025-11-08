import { faker } from '@faker-js/faker'
import { prisma } from '../db/prisma'
import {
  randomEnum,
  randomDecimal,
  randomPastDate,
  maybe,
  PACKAGE_STATUSES,
  SHIPMENT_STATUSES,
  MOVEMENT_TYPES,
  CARRIERS,
} from './generators/faker-helpers'

export async function seedLogistics() {
  console.log('🚚 Seeding Logistics domain...')

  // Warehouses (100)
  console.log('  Creating warehouses...')
  const warehouses = []
  for (let i = 0; i < 100; i++) {
    warehouses.push({
      code: `WH-${faker.string.alphanumeric(4).toUpperCase()}`,
      name: `${faker.location.city()} Warehouse`,
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      country: faker.location.country(),
      capacitySqm: randomDecimal(1000, 50000, 0),
      manager: faker.person.fullName(),
    })
  }
  await prisma.warehouse.createMany({ data: warehouses })
  const allWarehouses = await prisma.warehouse.findMany()

  // Packages (150,000)
  console.log('  Creating packages...')
  const batchSize = 1000
  for (let batch = 0; batch < 150; batch++) {
    const packages = []
    for (let i = 0; i < batchSize; i++) {
      packages.push({
        trackingNumber: `TRK-${faker.string.alphanumeric(12).toUpperCase()}`,
        weightKg: randomDecimal(0.1, 100),
        dimensions: `${faker.number.int({ min: 10, max: 100 })}x${faker.number.int({ min: 10, max: 100 })}x${faker.number.int({ min: 10, max: 100 })} cm`,
        warehouseId: faker.helpers.arrayElement(allWarehouses).id,
        status: randomEnum(PACKAGE_STATUSES),
        createdAt: randomPastDate(365),
      })
    }
    await prisma.package.createMany({ data: packages, skipDuplicates: true })
    console.log(`    Packages: ${(batch + 1) * batchSize}/150000`)
  }

  const allPackages = await prisma.package.findMany({ take: 50000 })

  // Shipments (80,000)
  console.log('  Creating shipments...')
  for (let batch = 0; batch < 80; batch++) {
    const shipments = []
    for (let i = 0; i < 1000; i++) {
      const shipmentDate = randomPastDate(365)
      const estimatedDelivery = new Date(shipmentDate)
      estimatedDelivery.setDate(estimatedDelivery.getDate() + faker.number.int({ min: 1, max: 7 }))
      const status = randomEnum(SHIPMENT_STATUSES)
      const actualDelivery = status === 'delivered' ? new Date(estimatedDelivery.getTime() + faker.number.int({ min: -86400000, max: 86400000 * 2 })) : null

      shipments.push({
        shipmentNumber: `SHIP-${faker.string.alphanumeric(10).toUpperCase()}`,
        originWarehouseId: faker.helpers.arrayElement(allWarehouses).id,
        destinationAddress: faker.location.streetAddress(),
        destinationCity: faker.location.city(),
        destinationCountry: faker.location.country(),
        carrier: randomEnum(CARRIERS),
        shipmentDate,
        estimatedDelivery,
        actualDelivery,
        status,
      })
    }
    await prisma.shipment.createMany({ data: shipments, skipDuplicates: true })
    console.log(`    Shipments: ${(batch + 1) * 1000}/80000`)
  }

  const allShipments = await prisma.shipment.findMany({ take: 30000 })

  // Delivery Routes (10,000)
  console.log('  Creating delivery routes...')
  const routes = []
  for (let i = 0; i < 10000; i++) {
    routes.push({
      routeName: `Route ${faker.location.city()}-${faker.location.city()}`,
      driverName: faker.person.fullName(),
      vehicle: `${faker.vehicle.manufacturer()} ${faker.vehicle.model()}`,
      startWarehouseId: faker.helpers.arrayElement(allWarehouses).id,
      routeDate: randomPastDate(365),
      distanceKm: randomDecimal(10, 500),
      estimatedDurationHours: randomDecimal(0.5, 12),
    })
  }
  await prisma.deliveryRoute.createMany({ data: routes })

  // Inventory Movements (250,000)
  console.log('  Creating inventory movements...')
  for (let batch = 0; batch < 250; batch++) {
    const movements = []
    for (let i = 0; i < 1000; i++) {
      const movementType = randomEnum(MOVEMENT_TYPES)
      movements.push({
        warehouseId: faker.helpers.arrayElement(allWarehouses).id,
        movementType,
        packageId: maybe(faker.helpers.arrayElement(allPackages).id, 0.5),
        shipmentId: maybe(faker.helpers.arrayElement(allShipments).id, 0.4),
        quantity: faker.number.int({ min: 1, max: 1000 }),
        movementDate: randomPastDate(365),
        notes: maybe(faker.lorem.sentence(), 0.5),
      })
    }
    await prisma.inventoryMovement.createMany({ data: movements })
    console.log(`    Inventory movements: ${(batch + 1) * 1000}/250000`)
  }

  console.log('✅ Logistics domain seeded')
}

