import { faker } from '@faker-js/faker'
import { prisma } from '../db/prisma'
import {
  randomEnum,
  randomDecimal,
  randomPastDate,
  randomFutureDate,
  randomPercentage,
  maybe,
  LEAD_SOURCES,
  LEAD_STATUSES,
  DEAL_STAGES,
  ACTIVITY_TYPES,
} from './generators/faker-helpers'

export async function seedSales() {
  console.log('💼 Seeding Sales domain...')

  // Leads (200,000)
  console.log('  Creating leads...')
  const batchSize = 1000
  for (let batch = 0; batch < 200; batch++) {
    const leads = []
    for (let i = 0; i < batchSize; i++) {
      leads.push({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: maybe(faker.phone.number(), 0.8),
        company: maybe(faker.company.name(), 0.9),
        source: randomEnum(LEAD_SOURCES),
        status: randomEnum(LEAD_STATUSES),
        createdAt: randomPastDate(365),
        assignedTo: maybe(faker.person.fullName(), 0.8),
      })
    }
    await prisma.lead.createMany({ data: leads })
    console.log(`    Leads: ${(batch + 1) * batchSize}/200000`)
  }

  const allLeads = await prisma.lead.findMany({
    where: { status: 'qualified' },
    take: 50000,
  })

  // Qualified Leads (50,000)
  console.log('  Creating qualified leads...')
  for (let batch = 0; batch < 50; batch++) {
    const qualifiedLeads = []
    for (let i = 0; i < 1000; i++) {
      const lead = allLeads[batch * 1000 + i]
      if (!lead) break
      qualifiedLeads.push({
        leadId: lead.id,
        qualificationDate: randomPastDate(300),
        budget: maybe(randomDecimal(5000, 500000), 0.8),
        decisionMaker: maybe(faker.person.fullName(), 0.7),
        timeline: maybe(faker.helpers.arrayElement(['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'H1 2025']), 0.8),
        needs: maybe(faker.lorem.paragraph(), 0.9),
        score: faker.number.int({ min: 1, max: 100 }),
      })
    }
    await prisma.qualifiedLead.createMany({ data: qualifiedLeads, skipDuplicates: true })
    console.log(`    Qualified leads: ${(batch + 1) * 1000}/50000`)
  }

  const allQualifiedLeads = await prisma.qualifiedLead.findMany({ take: 30000 })

  // Deals (30,000)
  console.log('  Creating deals...')
  for (let batch = 0; batch < 30; batch++) {
    const deals = []
    for (let i = 0; i < 1000; i++) {
      const ql = allQualifiedLeads[batch * 1000 + i]
      if (!ql) break
      const expectedClose = randomFutureDate(180)
      const stage = randomEnum(DEAL_STAGES)
      const actualClose = stage.startsWith('closed') ? randomPastDate(90) : null

      deals.push({
        qualifiedLeadId: ql.id,
        dealName: faker.company.catchPhrase(),
        amount: randomDecimal(10000, 1000000),
        probability: randomPercentage(),
        stage,
        expectedCloseDate: expectedClose,
        actualCloseDate: actualClose,
        owner: faker.person.fullName(),
      })
    }
    await prisma.deal.createMany({ data: deals })
    console.log(`    Deals: ${(batch + 1) * 1000}/30000`)
  }

  const allDeals = await prisma.deal.findMany({ take: 30000 })

  // Opportunities (40,000)
  console.log('  Creating opportunities...')
  for (let batch = 0; batch < 40; batch++) {
    const opportunities = []
    for (let i = 0; i < 1000; i++) {
      const deal = faker.helpers.arrayElement(allDeals)
      const quantity = faker.number.int({ min: 1, max: 100 })
      const unitPrice = randomDecimal(100, 50000)
      opportunities.push({
        dealId: deal.id,
        productName: faker.commerce.productName(),
        quantity,
        unitPrice,
        totalValue: quantity * unitPrice,
        notes: maybe(faker.lorem.sentence(), 0.6),
      })
    }
    await prisma.opportunity.createMany({ data: opportunities })
    console.log(`    Opportunities: ${(batch + 1) * 1000}/40000`)
  }

  // Sales Activities (150,000)
  console.log('  Creating sales activities...')
  const someLeads = await prisma.lead.findMany({ take: 50000 })
  for (let batch = 0; batch < 150; batch++) {
    const activities = []
    for (let i = 0; i < 1000; i++) {
      const hasLead = faker.datatype.boolean({ probability: 0.6 })
      const hasDeal = faker.datatype.boolean({ probability: 0.4 })
      activities.push({
        leadId: hasLead ? faker.helpers.arrayElement(someLeads).id : null,
        dealId: hasDeal ? faker.helpers.arrayElement(allDeals).id : null,
        activityType: randomEnum(ACTIVITY_TYPES),
        activityDate: randomPastDate(365),
        durationMinutes: maybe(faker.number.int({ min: 15, max: 180 }), 0.8),
        notes: maybe(faker.lorem.paragraph(), 0.7),
        outcome: maybe(faker.helpers.arrayElement(['positive', 'neutral', 'negative', 'follow-up needed']), 0.8),
      })
    }
    await prisma.salesActivity.createMany({ data: activities })
    console.log(`    Sales activities: ${(batch + 1) * 1000}/150000`)
  }

  console.log('✅ Sales domain seeded')
}

