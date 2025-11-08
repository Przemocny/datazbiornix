import { NextRequest } from 'next/server'
import { validateApiKey, createUnauthorizedResponse } from '@/lib/auth/api-key'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  // Validate API key
  if (!validateApiKey(request)) {
    return createUnauthorizedResponse()
  }

  try {
    const stats = await Promise.all([
      // Finance
      prisma.invoice.count(),
      prisma.transaction.count(),
      prisma.budgetEntry.count(),
      prisma.costCenter.count(),
      
      // Sales
      prisma.lead.count(),
      prisma.qualifiedLead.count(),
      prisma.deal.count(),
      prisma.opportunity.count(),
      prisma.salesActivity.count(),
      
      // Marketing
      prisma.campaign.count(),
      prisma.adGroup.count(),
      prisma.ad.count(),
      prisma.campaignMetric.count(),
      
      // Logistics
      prisma.warehouse.count(),
      prisma.package.count(),
      prisma.shipment.count(),
      prisma.deliveryRoute.count(),
      prisma.inventoryMovement.count(),
      
      // Ecommerce
      prisma.customer.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.orderItem.count(),
      prisma.payment.count(),
      
      // Production
      prisma.supplier.count(),
      prisma.supplierOrder.count(),
      prisma.productionBatch.count(),
      prisma.qualityCheck.count(),
      prisma.warehouseStock.count(),
      
      // Time Tracking
      prisma.employee.count(),
      prisma.project.count(),
      prisma.task.count(),
      prisma.timeEntry.count(),
    ])

    return Response.json({
      finance: {
        invoices: stats[0],
        transactions: stats[1],
        budgetEntries: stats[2],
        costCenters: stats[3],
      },
      sales: {
        leads: stats[4],
        qualifiedLeads: stats[5],
        deals: stats[6],
        opportunities: stats[7],
        salesActivities: stats[8],
      },
      marketing: {
        campaigns: stats[9],
        adGroups: stats[10],
        ads: stats[11],
        campaignMetrics: stats[12],
      },
      logistics: {
        warehouses: stats[13],
        packages: stats[14],
        shipments: stats[15],
        deliveryRoutes: stats[16],
        inventoryMovements: stats[17],
      },
      ecommerce: {
        customers: stats[18],
        products: stats[19],
        orders: stats[20],
        orderItems: stats[21],
        payments: stats[22],
      },
      production: {
        suppliers: stats[23],
        supplierOrders: stats[24],
        productionBatches: stats[25],
        qualityChecks: stats[26],
        warehouseStock: stats[27],
      },
      timeTracking: {
        employees: stats[28],
        projects: stats[29],
        tasks: stats[30],
        timeEntries: stats[31],
      },
      total: stats.reduce((a, b) => a + b, 0),
    })
  } catch (error) {
    console.error('Stats error:', error)
    return Response.json(
      { error: 'Failed to get stats', message: (error as Error).message },
      { status: 500 }
    )
  }
}

