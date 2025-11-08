import { NextRequest } from 'next/server'
import { QualityLevel } from '@/types/quality'
import { degradeRecords } from '../data-degradation'
import { getPaginationParams, getSkipTake } from './pagination'
import { createApiResponse } from './response'
import { convertToCSV, createCSVResponse } from './csv-export'
import { getSortParams } from './filters'

interface RouteHandlerOptions {
  resource: string
  domain: string
  fetchData: (skip: number, take: number, orderBy: any, where?: any) => Promise<any[]>
  countData: (where?: any) => Promise<number>
  allowedFilters?: string[]
}

export async function createResourceHandler(
  request: NextRequest,
  options: RouteHandlerOptions
) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Get parameters
    const { page, limit } = getPaginationParams(searchParams)
    const quality = (searchParams.get('quality') || 'ideal') as QualityLevel
    const format = searchParams.get('format') || 'json'
    const orderBy = getSortParams(searchParams)
    
    // Build where clause if filters provided
    const where = options.allowedFilters 
      ? buildWhereFromFilters(searchParams, options.allowedFilters)
      : undefined
    
    // Fetch data
    const { skip, take } = getSkipTake(page, limit)
    const [data, total] = await Promise.all([
      options.fetchData(skip, take, orderBy, where),
      options.countData(where),
    ])
    
    // Apply degradation
    const degradedData = degradeRecords(data, quality)
    
    // Return based on format
    if (format === 'csv') {
      const csv = convertToCSV(degradedData)
      return createCSVResponse(csv, `${options.resource}.csv`)
    }
    
    // JSON response
    const baseUrl = `/api/${options.domain}/${options.resource}`
    const response = createApiResponse(degradedData, total, page, limit, quality, baseUrl)
    
    return Response.json(response)
  } catch (error) {
    console.error(`Error in ${options.resource} handler:`, error)
    return Response.json(
      { error: 'Internal Server Error', message: (error as Error).message },
      { status: 500 }
    )
  }
}

function buildWhereFromFilters(searchParams: URLSearchParams, allowedFilters: string[]): any {
  const where: any = {}
  
  allowedFilters.forEach(filter => {
    const value = searchParams.get(filter)
    if (value) {
      where[filter] = value
    }
  })
  
  return Object.keys(where).length > 0 ? where : undefined
}

