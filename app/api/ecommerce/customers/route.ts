import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { createResourceHandler } from '@/lib/api/route-handler'

export async function GET(request: NextRequest) {
  return createResourceHandler(request, {
    resource: 'customers',
    domain: 'ecommerce',
    fetchData: (skip, take, orderBy, where) =>
      prisma.customer.findMany({ skip, take, orderBy, where }),
    countData: (where) => prisma.customer.count({ where }),
    allowedFilters: ['customerType', 'country'],
  })
}

