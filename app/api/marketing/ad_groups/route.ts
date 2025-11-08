import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { createResourceHandler } from '@/lib/api/route-handler'

export async function GET(request: NextRequest) {
  return createResourceHandler(request, {
    resource: 'ad_groups',
    domain: 'marketing',
    fetchData: (skip, take, orderBy, where) =>
      prisma.adGroup.findMany({ skip, take, orderBy, where }),
    countData: (where) => prisma.adGroup.count({ where }),
  })
}

