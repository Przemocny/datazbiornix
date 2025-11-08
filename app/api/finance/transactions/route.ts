import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { createResourceHandler } from '@/lib/api/route-handler'

export async function GET(request: NextRequest) {
  return createResourceHandler(request, {
    resource: 'transactions',
    domain: 'finance',
    fetchData: (skip, take, orderBy, where) =>
      prisma.transaction.findMany({ skip, take, orderBy, where }),
    countData: (where) => prisma.transaction.count({ where }),
    allowedFilters: ['type', 'category'],
  })
}

