export interface PaginationParams {
  page: number
  limit: number
}

export function getPaginationParams(searchParams: URLSearchParams): PaginationParams {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const limit = Math.min(1000, Math.max(1, parseInt(searchParams.get('limit') || '100', 10)))

  return { page, limit }
}

export function getSkipTake(page: number, limit: number) {
  return {
    skip: (page - 1) * limit,
    take: limit,
  }
}

