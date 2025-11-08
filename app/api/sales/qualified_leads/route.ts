import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { createResourceHandler } from '@/lib/api/route-handler'

export async function GET(request: NextRequest) {
  return createResourceHandler(request, {
    resource: 'qualified_leads',
    domain: 'sales',
    fetchData: (skip, take, orderBy, where) =>
      prisma.qualifiedLead.findMany({ skip, take, orderBy, where }),
    countData: (where) => prisma.qualifiedLead.count({ where }),
  })
}

