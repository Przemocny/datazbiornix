import { faker } from '@faker-js/faker'
import { prisma } from '../db/prisma'
import {
  randomEnum,
  randomDecimal,
  randomPastDate,
  randomFutureDate,
  maybe,
  CAMPAIGN_PLATFORMS,
  CAMPAIGN_STATUSES,
} from './generators/faker-helpers'

export async function seedMarketing() {
  console.log('📢 Seeding Marketing domain...')

  // Campaigns (5,000)
  console.log('  Creating campaigns...')
  const campaigns = []
  for (let i = 0; i < 5000; i++) {
    const startDate = randomPastDate(730)
    const status = randomEnum(CAMPAIGN_STATUSES)
    const endDate = status === 'completed' ? randomPastDate(365) : maybe(randomFutureDate(180), 0.3)

    campaigns.push({
      name: faker.company.catchPhrase(),
      platform: randomEnum(CAMPAIGN_PLATFORMS),
      startDate,
      endDate,
      budget: randomDecimal(1000, 100000),
      status,
      objective: faker.helpers.arrayElement(['awareness', 'leads', 'sales']),
    })
  }
  await prisma.campaign.createMany({ data: campaigns })
  const allCampaigns = await prisma.campaign.findMany()

  // Ad Groups (15,000)
  console.log('  Creating ad groups...')
  const adGroups = []
  for (let i = 0; i < 15000; i++) {
    adGroups.push({
      campaignId: faker.helpers.arrayElement(allCampaigns).id,
      name: faker.lorem.words(3),
      targetAudience: maybe(faker.lorem.words(5), 0.8),
      dailyBudget: randomDecimal(50, 5000),
    })
  }
  await prisma.adGroup.createMany({ data: adGroups })
  const allAdGroups = await prisma.adGroup.findMany()

  // Ads (50,000)
  console.log('  Creating ads...')
  const batchSize = 1000
  for (let batch = 0; batch < 50; batch++) {
    const ads = []
    for (let i = 0; i < batchSize; i++) {
      ads.push({
        adGroupId: faker.helpers.arrayElement(allAdGroups).id,
        headline: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        cta: faker.helpers.arrayElement(['Learn More', 'Sign Up', 'Buy Now', 'Get Started', 'Contact Us']),
        imageUrl: maybe(faker.image.url(), 0.9),
        status: faker.helpers.arrayElement(['active', 'paused', 'rejected']),
      })
    }
    await prisma.ad.createMany({ data: ads })
    console.log(`    Ads: ${(batch + 1) * batchSize}/50000`)
  }

  // Campaign Metrics (150,000 - daily metrics)
  console.log('  Creating campaign metrics...')
  for (let batch = 0; batch < 150; batch++) {
    const metrics = []
    for (let i = 0; i < 1000; i++) {
      const impressions = faker.number.int({ min: 100, max: 100000 })
      const clicks = faker.number.int({ min: 10, max: impressions * 0.1 })
      const conversions = faker.number.int({ min: 0, max: clicks * 0.1 })
      const cost = randomDecimal(10, 5000)

      metrics.push({
        campaignId: faker.helpers.arrayElement(allCampaigns).id,
        date: randomPastDate(365),
        impressions,
        clicks,
        conversions,
        cost,
        ctr: clicks / impressions,
        cpc: clicks > 0 ? cost / clicks : 0,
        conversionRate: clicks > 0 ? conversions / clicks : 0,
      })
    }
    await prisma.campaignMetric.createMany({ data: metrics })
    console.log(`    Campaign metrics: ${(batch + 1) * 1000}/150000`)
  }

  console.log('✅ Marketing domain seeded')
}

