import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { createResourceHandler } from '@/lib/api/route-handler'

export async function GET(request: NextRequest) {
  return createResourceHandler(request, {
    resource: 'projects',
    domain: 'timetracking',
    fetchData: (skip, take, orderBy, where) =>
      prisma.project.findMany({ skip, take, orderBy, where }),
    countData: (where) => prisma.project.count({ where }),
    allowedFilters: ['status'],
  })
}

