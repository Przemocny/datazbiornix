import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { createResourceHandler } from '@/lib/api/route-handler'

export async function GET(request: NextRequest) {
  return createResourceHandler(request, {
    resource: 'inventory_movements',
    domain: 'logistics',
    fetchData: (skip, take, orderBy, where) =>
      prisma.inventoryMovement.findMany({ skip, take, orderBy, where }),
    countData: (where) => prisma.inventoryMovement.count({ where }),
    allowedFilters: ['movementType'],
  })
}

