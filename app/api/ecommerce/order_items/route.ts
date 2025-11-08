import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { createResourceHandler } from '@/lib/api/route-handler'

export async function GET(request: NextRequest) {
  return createResourceHandler(request, {
    resource: 'order_items',
    domain: 'ecommerce',
    fetchData: (skip, take, orderBy, where) =>
      prisma.orderItem.findMany({ skip, take, orderBy, where }),
    countData: (where) => prisma.orderItem.count({ where }),
  })
}

