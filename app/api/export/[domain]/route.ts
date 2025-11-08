import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getDomain } from '@/lib/constants/domains'
import { degradeRecord } from '@/lib/data-degradation'

// Dynamiczny import XLSX
const XLSX = require('xlsx')

// Mapa nazw modeli na rzeczywiste modele Prisma
const MODEL_MAP: Record<string, any> = {
  costCenter: prisma.costCenter,
  invoice: prisma.invoice,
  transaction: prisma.transaction,
  budgetEntry: prisma.budgetEntry,
  lead: prisma.lead,
  qualifiedLead: prisma.qualifiedLead,
  deal: prisma.deal,
  opportunity: prisma.opportunity,
  salesActivity: prisma.salesActivity,
  campaign: prisma.campaign,
  adGroup: prisma.adGroup,
  ad: prisma.ad,
  campaignMetric: prisma.campaignMetric,
  warehouse: prisma.warehouse,
  package: prisma.package,
  shipment: prisma.shipment,
  deliveryRoute: prisma.deliveryRoute,
  inventoryMovement: prisma.inventoryMovement,
  customer: prisma.customer,
  product: prisma.product,
  order: prisma.order,
  orderItem: prisma.orderItem,
  payment: prisma.payment,
  supplier: prisma.supplier,
  supplierOrder: prisma.supplierOrder,
  productionBatch: prisma.productionBatch,
  qualityCheck: prisma.qualityCheck,
  warehouseStock: prisma.warehouseStock,
  employee: prisma.employee,
  project: prisma.project,
  task: prisma.task,
  timeEntry: prisma.timeEntry,
}

export async function GET(
  request: NextRequest,
  { params }: { params: { domain: string } }
) {
  try {
    const domain = getDomain(params.domain)
    
    if (!domain) {
      return NextResponse.json(
        { error: 'Domain not found' },
        { status: 404 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const quality = (searchParams.get('quality') || 'ideal') as 'ideal' | 'clean' | 'realistic'

    // Utworzenie workbooka
    const workbook = XLSX.utils.book_new()

    // Dla każdego zasobu w dziale
    for (const resource of domain.resources) {
      try {
        // Pobranie modelu z mapy
        const model = MODEL_MAP[resource.model]

        if (!model) {
          console.error(`Model ${resource.model} not found in MODEL_MAP`)
          continue
        }

        // Pobranie wszystkich rekordów
        let data = await model.findMany({
          take: 10000, // Limit 10k rekordów na zasób
        })

        // Zastosowanie degradacji jakości
        if (quality !== 'ideal') {
          data = data.map((record: any) => 
            degradeRecord(record, quality, data)
          )
        }

        // Konwersja dat na stringi
        const processedData = data.map((record: any) => {
          const processed: any = {}
          for (const [key, value] of Object.entries(record)) {
            if (value instanceof Date) {
              processed[key] = value.toISOString()
            } else if (typeof value === 'object' && value !== null) {
              processed[key] = JSON.stringify(value)
            } else {
              processed[key] = value
            }
          }
          return processed
        })

        // Utworzenie arkusza
        const worksheet = XLSX.utils.json_to_sheet(processedData)
        
        // Dodanie arkusza do workbooka
        const sheetName = resource.namePlural.substring(0, 31) // Excel ma limit 31 znaków
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

      } catch (error) {
        console.error(`Error processing resource ${resource.key}:`, error)
        // Kontynuuj z następnym zasobem
      }
    }

    // Wygenerowanie bufora Excel
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx',
      compression: true 
    })

    // Zwrócenie pliku
    return new NextResponse(Buffer.from(excelBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${domain.key}_export_${quality}_${Date.now()}.xlsx"`,
        'Content-Length': excelBuffer.length.toString(),
      },
    })

  } catch (error: any) {
    console.error('Excel export error:', error)
    console.error('Error stack:', error?.stack)
    return NextResponse.json(
      { error: 'Failed to generate Excel export', message: error?.message || 'Unknown error' },
      { status: 500 }
    )
  }
}

