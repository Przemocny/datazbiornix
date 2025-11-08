import { stringify } from 'csv-stringify/sync'

export function convertToCSV<T extends Record<string, any>>(data: T[]): string {
  if (data.length === 0) {
    return ''
  }

  // Get all unique keys from all records
  const allKeys = new Set<string>()
  data.forEach(record => {
    Object.keys(record).forEach(key => allKeys.add(key))
  })

  const columns = Array.from(allKeys)

  // Convert data to CSV
  return stringify(data, {
    header: true,
    columns,
    cast: {
      date: (value) => value instanceof Date ? value.toISOString() : value,
      boolean: (value) => value ? 'true' : 'false',
      object: (value) => JSON.stringify(value),
    },
  })
}

export function createCSVResponse(csv: string, filename: string): Response {
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}

