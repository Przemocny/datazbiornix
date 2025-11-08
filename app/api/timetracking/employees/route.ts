import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { createResourceHandler } from '@/lib/api/route-handler'

export async function GET(request: NextRequest) {
  return createResourceHandler(request, {
    resource: 'employees',
    domain: 'timetracking',
    fetchData: (skip, take, orderBy, where) =>
      prisma.employee.findMany({ skip, take, orderBy, where }),
    countData: (where) => prisma.employee.count({ where }),
    allowedFilters: ['department', 'active'],
  })
}

