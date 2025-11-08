import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { createResourceHandler } from '@/lib/api/route-handler'

export async function GET(request: NextRequest) {
  return createResourceHandler(request, {
    resource: 'payments',
    domain: 'ecommerce',
    fetchData: (skip, take, orderBy, where) =>
      prisma.payment.findMany({ skip, take, orderBy, where }),
    countData: (where) => prisma.payment.count({ where }),
    allowedFilters: ['status', 'paymentMethod'],
  })
}

