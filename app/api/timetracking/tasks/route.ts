import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { createResourceHandler } from '@/lib/api/route-handler'

export async function GET(request: NextRequest) {
  return createResourceHandler(request, {
    resource: 'tasks',
    domain: 'timetracking',
    fetchData: (skip, take, orderBy, where) =>
      prisma.task.findMany({ skip, take, orderBy, where }),
    countData: (where) => prisma.task.count({ where }),
    allowedFilters: ['status', 'priority'],
  })
}

