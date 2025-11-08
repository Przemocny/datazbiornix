import { faker } from '@faker-js/faker'
import { prisma } from '../db/prisma'
import {
  randomEnum,
  randomDecimal,
  randomPastDate,
  maybe,
  INVOICE_STATUSES,
  TRANSACTION_TYPES,
  CURRENCIES,
  DEPARTMENTS,
} from './generators/faker-helpers'

export async function seedFinance() {
  console.log('🏦 Seeding Finance domain...')

  // Cost Centers (500)
  console.log('  Creating cost centers...')
  const costCenters = []
  for (let i = 0; i < 500; i++) {
    costCenters.push({
      code: `CC-${faker.string.alphanumeric(6).toUpperCase()}`,
      name: faker.company.buzzPhrase(),
      department: randomEnum(DEPARTMENTS),
      manager: faker.person.fullName(),
      active: faker.datatype.boolean({ probability: 0.9 }),
    })
  }
  await prisma.costCenter.createMany({ data: costCenters })
  const allCostCenters = await prisma.costCenter.findMany()

  // Invoices (150,000)
  console.log('  Creating invoices...')
  const batchSize = 1000
  for (let batch = 0; batch < 150; batch++) {
    const invoices = []
    for (let i = 0; i < batchSize; i++) {
      const issueDate = randomPastDate(730) // 2 years
      const dueDate = new Date(issueDate)
      dueDate.setDate(dueDate.getDate() + faker.number.int({ min: 15, max: 90 }))

      invoices.push({
        invoiceNumber: `INV-${faker.string.alphanumeric(8).toUpperCase()}`,
        issueDate,
        dueDate,
        amount: randomDecimal(100, 50000),
        currency: randomEnum(CURRENCIES),
        status: randomEnum(INVOICE_STATUSES),
        customerName: faker.company.name(),
        customerEmail: maybe(faker.internet.email(), 0.9),
        costCenterId: faker.helpers.arrayElement(allCostCenters).id,
      })
    }
    await prisma.invoice.createMany({ data: invoices, skipDuplicates: true })
    console.log(`    Invoices: ${(batch + 1) * batchSize}/150000`)
  }

  const allInvoices = await prisma.invoice.findMany({ take: 50000 })

  // Budget Entries (20,000)
  console.log('  Creating budget entries...')
  const budgetEntries = []
  for (let i = 0; i < 20000; i++) {
    const planned = randomDecimal(10000, 500000)
    const actual = randomDecimal(planned * 0.7, planned * 1.3)
    budgetEntries.push({
      fiscalYear: faker.number.int({ min: 2022, max: 2024 }),
      quarter: faker.number.int({ min: 1, max: 4 }),
      department: randomEnum(DEPARTMENTS),
      category: faker.helpers.arrayElement(['Personnel', 'Equipment', 'Services', 'Marketing', 'R&D']),
      plannedAmount: planned,
      actualAmount: actual,
      variance: actual - planned,
      costCenterId: faker.helpers.arrayElement(allCostCenters).id,
    })
  }
  await prisma.budgetEntry.createMany({ data: budgetEntries })
  const allBudgetEntries = await prisma.budgetEntry.findMany({ take: 10000 })

  // Transactions (200,000)
  console.log('  Creating transactions...')
  for (let batch = 0; batch < 200; batch++) {
    const transactions = []
    for (let i = 0; i < 1000; i++) {
      transactions.push({
        transactionDate: randomPastDate(730),
        amount: randomDecimal(10, 10000),
        type: randomEnum(TRANSACTION_TYPES),
        category: faker.helpers.arrayElement(['salary', 'rent', 'supplies', 'revenue', 'utilities']),
        description: maybe(faker.lorem.sentence(), 0.7),
        invoiceId: maybe(faker.helpers.arrayElement(allInvoices).id, 0.3),
        budgetEntryId: maybe(faker.helpers.arrayElement(allBudgetEntries).id, 0.3),
      })
    }
    await prisma.transaction.createMany({ data: transactions })
    console.log(`    Transactions: ${(batch + 1) * 1000}/200000`)
  }

  console.log('✅ Finance domain seeded')
}

