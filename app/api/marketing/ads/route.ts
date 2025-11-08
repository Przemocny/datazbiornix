import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { createResourceHandler } from '@/lib/api/route-handler'

export async function GET(request: NextRequest) {
  return createResourceHandler(request, {
    resource: 'ads',
    domain: 'marketing',
    fetchData: (skip, take, orderBy, where) =>
      prisma.ad.findMany({ skip, take, orderBy, where }),
    countData: (where) => prisma.ad.count({ where }),
    allowedFilters: ['status'],
  })
}

