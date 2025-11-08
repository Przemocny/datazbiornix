import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { createResourceHandler } from '@/lib/api/route-handler'

export async function GET(request: NextRequest) {
  return createResourceHandler(request, {
    resource: 'suppliers',
    domain: 'production',
    fetchData: (skip, take, orderBy, where) =>
      prisma.supplier.findMany({ skip, take, orderBy, where }),
    countData: (where) => prisma.supplier.count({ where }),
    allowedFilters: ['active', 'country'],
  })
}

