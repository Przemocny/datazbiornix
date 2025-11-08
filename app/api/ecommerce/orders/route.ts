import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { createResourceHandler } from '@/lib/api/route-handler'

export async function GET(request: NextRequest) {
  return createResourceHandler(request, {
    resource: 'orders',
    domain: 'ecommerce',
    fetchData: (skip, take, orderBy, where) =>
      prisma.order.findMany({ skip, take, orderBy, where }),
    countData: (where) => prisma.order.count({ where }),
    allowedFilters: ['status'],
  })
}

