'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getDomain, getResource } from '@/lib/constants/domains'

export default function ResourcePage({ 
  params 
}: { 
  params: { domain: string; resource: string } 
}) {
  const domain = getDomain(params.domain)
  const resource = getResource(params.domain, params.resource)
  
  const [data, setData] = useState<any[]>([])
  const [meta, setMeta] = useState<any>(null)
  const [quality, setQuality] = useState<'ideal' | 'clean' | 'realistic'>('ideal')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const limit = 50

  useEffect(() => {
    fetchData()
  }, [quality, page])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const url = `/api/${params.domain}/${params.resource}?quality=${quality}&page=${page}&limit=${limit}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      
      const json = await response.json()
      setData(json.data)
      setMeta(json.meta)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const downloadCSV = () => {
    const url = `/api/${params.domain}/${params.resource}?quality=${quality}&format=csv&limit=1000`
    window.open(url, '_blank')
  }

  if (!domain || !resource) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Nie znaleziono zasobu</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Powrót do strony głównej
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="text-sm text-gray-600 mb-2">
            <Link href="/" className="hover:underline">Home</Link>
            {' > '}
            <Link href={`/${params.domain}`} className="hover:underline">{domain.name}</Link>
            {' > '}
            <span className="text-gray-900">{resource.namePlural}</span>
          </div>
          <h1 className="text-2xl font-bold">{resource.namePlural}</h1>
          <p className="text-sm text-gray-600">{resource.description}</p>
        </div>
      </header>

      {/* Controls */}
      <section className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Jakość danych:</label>
              <select 
                value={quality}
                onChange={(e) => {
                  setQuality(e.target.value as any)
                  setPage(1)
                }}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="ideal">✨ Idealne</option>
                <option value="clean">🧹 Ładne</option>
                <option value="realistic">🌍 Realistyczne</option>
              </select>
            </div>
            
            <button
              onClick={downloadCSV}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700"
            >
              📥 Pobierz CSV
            </button>
          </div>
        </div>
      </section>

      {/* Data */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-6">
          {loading && (
            <div className="text-center py-12">
              <div className="text-gray-600">Ładowanie...</div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 text-red-800">
              Błąd: {error}
            </div>
          )}

          {!loading && !error && data.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-600">Brak danych</div>
            </div>
          )}

          {!loading && !error && data.length > 0 && (
            <>
              <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(data[0]).slice(0, 8).map(key => (
                        <th 
                          key={key}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        {Object.values(row).slice(0, 8).map((value: any, j) => (
                          <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {value === null || value === undefined || value === '' 
                              ? <span className="text-gray-400 italic">null</span>
                              : String(value).substring(0, 50)
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {meta && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Strona {meta.page} z {meta.totalPages} (łącznie {meta.total.toLocaleString()} rekordów)
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      ← Poprzednia
                    </button>
                    <button
                      onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                      disabled={page >= meta.totalPages}
                      className="px-4 py-2 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Następna →
                    </button>
                  </div>
                </div>
              )}

              {/* API Example */}
              <div className="mt-8 bg-gray-900 text-gray-100 rounded-lg p-6">
                <h3 className="text-sm font-bold mb-2">Przykładowe zapytanie API:</h3>
                <code className="text-sm">
                  GET /api/{params.domain}/{params.resource}?quality={quality}&page={page}&limit={limit}
                </code>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

