import { QualityLevel } from '@/types/quality'

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  quality: QualityLevel
}

export interface PaginationLinks {
  first: string
  prev: string | null
  next: string | null
  last: string
}

export interface ApiResponse<T> {
  data: T[]
  meta: PaginationMeta
  links: PaginationLinks
}

export function createApiResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  quality: QualityLevel,
  baseUrl: string
): ApiResponse<T> {
  const totalPages = Math.ceil(total / limit)

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      quality,
    },
    links: {
      first: `${baseUrl}?page=1&limit=${limit}&quality=${quality}`,
      prev: page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}&quality=${quality}` : null,
      next: page < totalPages ? `${baseUrl}?page=${page + 1}&limit=${limit}&quality=${quality}` : null,
      last: `${baseUrl}?page=${totalPages}&limit=${limit}&quality=${quality}`,
    },
  }
}

