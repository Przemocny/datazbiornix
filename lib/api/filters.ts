export function buildWhereClause(searchParams: URLSearchParams, allowedFilters: string[]): any {
  const where: any = {}

  allowedFilters.forEach(filter => {
    const value = searchParams.get(filter)
    if (value) {
      // Handle different filter types
      if (filter.endsWith('_min') || filter.endsWith('_max')) {
        const field = filter.replace(/_min$|_max$/, '')
        if (!where[field]) where[field] = {}
        
        if (filter.endsWith('_min')) {
          where[field].gte = parseFloat(value)
        } else {
          where[field].lte = parseFloat(value)
        }
      } else if (filter.includes('_date')) {
        // Date filters
        where[filter] = new Date(value)
      } else {
        // Exact match
        where[filter] = value
      }
    }
  })

  return where
}

export function getSortParams(searchParams: URLSearchParams) {
  const sort = searchParams.get('sort') || 'id'
  const order = searchParams.get('order') || 'asc'

  return {
    [sort]: order === 'desc' ? 'desc' : 'asc',
  }
}

