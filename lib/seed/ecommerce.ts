import { faker } from '@faker-js/faker'
import { prisma } from '../db/prisma'
import {
  randomEnum,
  randomDecimal,
  randomPastDate,
  maybe,
  CUSTOMER_TYPES,
  ORDER_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  CATEGORIES,
} from './generators/faker-helpers'

export async function seedEcommerce() {
  console.log('🛒 Seeding E-commerce domain...')

  // Get suppliers for products (from production domain - will be created later)
  // We'll create products without suppliers for now

  // Customers (50,000)
  console.log('  Creating customers...')
  const batchSize = 1000
  for (let batch = 0; batch < 50; batch++) {
    const customers = []
    for (let i = 0; i < batchSize; i++) {
      customers.push({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: maybe(faker.phone.number(), 0.8),
        address: maybe(faker.location.streetAddress(), 0.9),
        city: maybe(faker.location.city(), 0.9),
        country: maybe(faker.location.country(), 0.9),
        postalCode: maybe(faker.location.zipCode(), 0.9),
        registrationDate: randomPastDate(1095), // 3 years
        customerType: randomEnum(CUSTOMER_TYPES),
      })
    }
    await prisma.customer.createMany({ data: customers, skipDuplicates: true })
    console.log(`    Customers: ${(batch + 1) * batchSize}/50000`)
  }

  const allCustomers = await prisma.customer.findMany()

  // Products (10,000)
  console.log('  Creating products...')
  const products = []
  for (let i = 0; i < 10000; i++) {
    products.push({
      sku: `SKU-${faker.string.alphanumeric(8).toUpperCase()}`,
      name: faker.commerce.productName(),
      description: maybe(faker.commerce.productDescription(), 0.8),
      category: randomEnum(CATEGORIES),
      price: randomDecimal(5, 5000),
      stockQuantity: faker.number.int({ min: 0, max: 10000 }),
      supplierId: null, // Will be linked later
      active: faker.datatype.boolean({ probability: 0.95 }),
    })
  }
  await prisma.product.createMany({ data: products, skipDuplicates: true })
  const allProducts = await prisma.product.findMany()

  // Orders (100,000)
  console.log('  Creating orders...')
  for (let batch = 0; batch < 100; batch++) {
    const orders = []
    for (let i = 0; i < 1000; i++) {
      orders.push({
        orderNumber: `ORD-${faker.string.alphanumeric(10).toUpperCase()}`,
        customerId: faker.helpers.arrayElement(allCustomers).id,
        orderDate: randomPastDate(730),
        totalAmount: randomDecimal(20, 10000),
        status: randomEnum(ORDER_STATUSES),
        shippingAddress: faker.location.streetAddress(),
        billingAddress: faker.location.streetAddress(),
      })
    }
    await prisma.order.createMany({ data: orders, skipDuplicates: true })
    console.log(`    Orders: ${(batch + 1) * 1000}/100000`)
  }

  const allOrders = await prisma.order.findMany()

  // Order Items (250,000)
  console.log('  Creating order items...')
  for (let batch = 0; batch < 250; batch++) {
    const orderItems = []
    for (let i = 0; i < 1000; i++) {
      const product = faker.helpers.arrayElement(allProducts)
      const quantity = faker.number.int({ min: 1, max: 10 })
      const unitPrice = randomDecimal(5, 1000)
      const discount = maybe(randomDecimal(0, unitPrice * 0.3), 0.3)

      orderItems.push({
        orderId: faker.helpers.arrayElement(allOrders).id,
        productId: product.id,
        quantity,
        unitPrice,
        subtotal: quantity * unitPrice,
        discount: discount || 0,
      })
    }
    await prisma.orderItem.createMany({ data: orderItems })
    console.log(`    Order items: ${(batch + 1) * 1000}/250000`)
  }

  // Payments (100,000)
  console.log('  Creating payments...')
  for (let batch = 0; batch < 100; batch++) {
    const payments = []
    for (let i = 0; i < 1000; i++) {
      const order = allOrders[batch * 1000 + i]
      if (!order) break
      payments.push({
        orderId: order.id,
        paymentDate: new Date(order.orderDate.getTime() + faker.number.int({ min: 0, max: 3600000 })),
        amount: order.totalAmount,
        paymentMethod: randomEnum(PAYMENT_METHODS),
        transactionId: `TXN-${faker.string.alphanumeric(16).toUpperCase()}`,
        status: randomEnum(PAYMENT_STATUSES),
      })
    }
    await prisma.payment.createMany({ data: payments })
    console.log(`    Payments: ${(batch + 1) * 1000}/100000`)
  }

  console.log('✅ E-commerce domain seeded')
}

