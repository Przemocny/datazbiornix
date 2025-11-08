import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { createResourceHandler } from '@/lib/api/route-handler'

export async function GET(request: NextRequest) {
  return createResourceHandler(request, {
    resource: 'shipments',
    domain: 'logistics',
    fetchData: (skip, take, orderBy, where) =>
      prisma.shipment.findMany({ skip, take, orderBy, where }),
    countData: (where) => prisma.shipment.count({ where }),
    allowedFilters: ['status', 'carrier'],
  })
}

