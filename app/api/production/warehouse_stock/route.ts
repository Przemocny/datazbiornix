import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { createResourceHandler } from '@/lib/api/route-handler'

export async function GET(request: NextRequest) {
  return createResourceHandler(request, {
    resource: 'warehouse_stock',
    domain: 'production',
    fetchData: (skip, take, orderBy, where) =>
      prisma.warehouseStock.findMany({ skip, take, orderBy, where }),
    countData: (where) => prisma.warehouseStock.count({ where }),
  })
}

