import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { createResourceHandler } from '@/lib/api/route-handler'

export async function GET(request: NextRequest) {
  return createResourceHandler(request, {
    resource: 'supplier_orders',
    domain: 'production',
    fetchData: (skip, take, orderBy, where) =>
      prisma.supplierOrder.findMany({ skip, take, orderBy, where }),
    countData: (where) => prisma.supplierOrder.count({ where }),
    allowedFilters: ['status'],
  })
}

