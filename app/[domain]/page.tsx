'use client'

import Link from 'next/link'
import { useState } from 'react'
import { getDomain } from '@/lib/constants/domains'
import { MermaidDiagram } from '@/components/MermaidDiagram'
import { ERD_DIAGRAMS } from '@/lib/constants/erd-diagrams'
import { notFound } from 'next/navigation'

export default function DomainPage({ params }: { params: { domain: string } }) {
  const domain = getDomain(params.domain)
  const [isExporting, setIsExporting] = useState(false)
  const [selectedQuality, setSelectedQuality] = useState<'ideal' | 'clean' | 'realistic'>('ideal')
  
  if (!domain) {
    notFound()
  }

  const erdDiagram = ERD_DIAGRAMS[params.domain]

  const handleExportExcel = async () => {
    setIsExporting(true)
    try {
      const response = await fetch(`/api/export/${params.domain}?quality=${selectedQuality}`)
      
      if (!response.ok) {
        throw new Error('Export failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${domain.key}_export_${selectedQuality}_${Date.now()}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Export error:', error)
      alert('Nie udało się wyeksportować danych. Spróbuj ponownie.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            ← Powrót do strony głównej
          </Link>
        </div>
      </header>

      {/* Domain Header */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-start gap-4">
            <div className="text-6xl">{domain.icon}</div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{domain.name}</h1>
              <p className="text-lg text-gray-600">{domain.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ERD Diagram */}
      {erdDiagram && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Struktura Danych i Relacje</h2>
                <p className="text-gray-600">
                  Poniższy diagram przedstawia strukturę tabel, typy pól oraz relacje między danymi w dziale {domain.name}.
                </p>
              </div>
              
              {/* Export Excel Button */}
              <div className="flex flex-col gap-3 min-w-[280px]">
                <div className="flex gap-2">
                  <select
                    value={selectedQuality}
                    onChange={(e) => setSelectedQuality(e.target.value as 'ideal' | 'clean' | 'realistic')}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isExporting}
                  >
                    <option value="ideal">Idealne dane</option>
                    <option value="clean">Ładne dane</option>
                    <option value="realistic">Realistyczne dane</option>
                  </select>
                  
                  <button
                    onClick={handleExportExcel}
                    disabled={isExporting}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium whitespace-nowrap flex items-center gap-2"
                  >
                    {isExporting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generowanie...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Pobierz Excel
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Eksport wszystkich zasobów z działu {domain.name} (każdy zasób = osobny arkusz)
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <MermaidDiagram chart={erdDiagram} id={`erd-${params.domain}`} />
            </div>
          </div>
        </section>
      )}

      {/* Resources List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6">Dostępne zasoby</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domain.resources.map(resource => (
              <Link
                key={resource.key}
                href={`/${domain.key}/${resource.key}`}
                className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-bold mb-2">{resource.namePlural}</h3>
                <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                <div className="text-blue-600 text-sm font-medium">
                  Zobacz dane →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

