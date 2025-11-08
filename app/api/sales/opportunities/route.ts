import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { createResourceHandler } from '@/lib/api/route-handler'

export async function GET(request: NextRequest) {
  return createResourceHandler(request, {
    resource: 'opportunities',
    domain: 'sales',
    fetchData: (skip, take, orderBy, where) =>
      prisma.opportunity.findMany({ skip, take, orderBy, where }),
    countData: (where) => prisma.opportunity.count({ where }),
  })
}

