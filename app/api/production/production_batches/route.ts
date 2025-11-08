import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { createResourceHandler } from '@/lib/api/route-handler'

export async function GET(request: NextRequest) {
  return createResourceHandler(request, {
    resource: 'production_batches',
    domain: 'production',
    fetchData: (skip, take, orderBy, where) =>
      prisma.productionBatch.findMany({ skip, take, orderBy, where }),
    countData: (where) => prisma.productionBatch.count({ where }),
    allowedFilters: ['status'],
  })
}

