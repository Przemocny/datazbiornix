import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { createResourceHandler } from '@/lib/api/route-handler'

export async function GET(request: NextRequest) {
  return createResourceHandler(request, {
    resource: 'warehouses',
    domain: 'logistics',
    fetchData: (skip, take, orderBy, where) =>
      prisma.warehouse.findMany({ skip, take, orderBy, where }),
    countData: (where) => prisma.warehouse.count({ where }),
    allowedFilters: ['city', 'country'],
  })
}

