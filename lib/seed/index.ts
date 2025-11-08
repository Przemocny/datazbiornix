#!/usr/bin/env tsx

import { prisma } from '../db/prisma'
import { seedFinance } from './finance'
import { seedSales } from './sales'
import { seedMarketing } from './marketing'
import { seedLogistics } from './logistics'
import { seedEcommerce } from './ecommerce'
import { seedProduction } from './production'
import { seedTimeTracking } from './timetracking'

async function main() {
  console.log('🌱 Starting database seed...\n')
  
  const startTime = Date.now()

  try {
    // Seed in order to respect foreign key constraints
    await seedFinance()
    await seedSales()
    await seedMarketing()
    await seedLogistics()
    await seedEcommerce()
    await seedProduction() // Must come after ecommerce (products)
    await seedTimeTracking()

    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(2)
    console.log(`\n✨ Database seeded successfully in ${duration} minutes!`)
    
    // Print statistics
    console.log('\n📊 Statistics:')
    const stats = await Promise.all([
      prisma.invoice.count(),
      prisma.lead.count(),
      prisma.campaign.count(),
      prisma.package.count(),
      prisma.order.count(),
      prisma.productionBatch.count(),
      prisma.timeEntry.count(),
    ])
    
    console.log(`   Invoices: ${stats[0].toLocaleString()}`)
    console.log(`   Leads: ${stats[1].toLocaleString()}`)
    console.log(`   Campaigns: ${stats[2].toLocaleString()}`)
    console.log(`   Packages: ${stats[3].toLocaleString()}`)
    console.log(`   Orders: ${stats[4].toLocaleString()}`)
    console.log(`   Production Batches: ${stats[5].toLocaleString()}`)
    console.log(`   Time Entries: ${stats[6].toLocaleString()}`)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

