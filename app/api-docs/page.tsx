'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { DOMAINS } from '@/lib/constants/domains'

export default function ApiDocsPage() {
  const [baseUrl, setBaseUrl] = useState(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005')
  
  useEffect(() => {
    setBaseUrl(window.location.origin)
  }, [])
  
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Dokumentacja API</h1>

        {/* Overview */}
        <section className="mb-12 bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Przegląd</h2>
          <p className="text-gray-700 mb-4">
            DataContainer API dostarcza REST endpoints dla wszystkich zasobów danych. 
            Każdy endpoint wspiera paginację, filtry, sortowanie i eksport CSV.
          </p>
          <div className="bg-gray-900 text-gray-100 rounded p-4">
            <code className="text-sm">Base URL: {baseUrl}/api</code>
          </div>
        </section>

        {/* Common Parameters */}
        <section className="mb-12 bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Parametry wspólne</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Parametr</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Typ</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Domyślna</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Opis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 font-mono text-sm">quality</td>
                <td className="px-4 py-2 text-sm">string</td>
                <td className="px-4 py-2 text-sm">ideal</td>
                <td className="px-4 py-2 text-sm">ideal | clean | realistic</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-sm">page</td>
                <td className="px-4 py-2 text-sm">integer</td>
                <td className="px-4 py-2 text-sm">1</td>
                <td className="px-4 py-2 text-sm">Numer strony (≥ 1)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-sm">limit</td>
                <td className="px-4 py-2 text-sm">integer</td>
                <td className="px-4 py-2 text-sm">100</td>
                <td className="px-4 py-2 text-sm">Rekordów na stronę (1-1000)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-sm">format</td>
                <td className="px-4 py-2 text-sm">string</td>
                <td className="px-4 py-2 text-sm">json</td>
                <td className="px-4 py-2 text-sm">json | csv</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-sm">sort</td>
                <td className="px-4 py-2 text-sm">string</td>
                <td className="px-4 py-2 text-sm">id</td>
                <td className="px-4 py-2 text-sm">Pole sortowania</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-sm">order</td>
                <td className="px-4 py-2 text-sm">string</td>
                <td className="px-4 py-2 text-sm">asc</td>
                <td className="px-4 py-2 text-sm">asc | desc</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Endpoints by Domain */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Endpointy według działów</h2>
          <div className="space-y-6">
            {DOMAINS.map(domain => (
              <div key={domain.key} className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">
                  {domain.icon} {domain.name}
                </h3>
                <div className="space-y-2">
                  {domain.resources.map(resource => (
                    <div key={resource.key} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          GET /api/{domain.key}/{resource.key}
                        </code>
                        <span className="ml-3 text-sm text-gray-600">{resource.description}</span>
                      </div>
                      <Link
                        href={`/${domain.key}/${resource.key}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Testuj →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Example Response */}
        <section className="mb-12 bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Przykładowa odpowiedź JSON</h2>
          <div className="bg-gray-900 text-gray-100 rounded p-4 overflow-x-auto">
            <pre className="text-sm">{`{
  "data": [
    {
      "id": "uuid-1",
      "invoiceNumber": "INV-001",
      "amount": 1250.00,
      "status": "paid",
      ...
    },
    ...
  ],
  "meta": {
    "page": 1,
    "limit": 100,
    "total": 150000,
    "totalPages": 1500,
    "quality": "ideal"
  },
  "links": {
    "first": "/api/finance/invoices?page=1&limit=100",
    "prev": null,
    "next": "/api/finance/invoices?page=2&limit=100",
    "last": "/api/finance/invoices?page=1500&limit=100"
  }
}`}</pre>
          </div>
        </section>

        {/* Admin Endpoints */}
        <section className="mb-12 bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Admin Endpoints</h2>
          <p className="text-gray-700 mb-4">
            Wymagają nagłówka <code className="bg-gray-100 px-2 py-1 rounded">X-API-Key</code>
          </p>
          <div className="space-y-3">
            <div className="border-b pb-3">
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                POST /api/admin/seed
              </code>
              <p className="text-sm text-gray-600 mt-2">Regeneruj dane w bazie</p>
            </div>
            <div>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                GET /api/admin/stats
              </code>
              <p className="text-sm text-gray-600 mt-2">Pobierz statystyki bazy danych</p>
            </div>
          </div>
        </section>

        {/* Examples */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Przykłady użycia</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-bold mb-2">cURL</h3>
              <div className="bg-gray-900 text-gray-100 rounded p-3 overflow-x-auto">
                <pre className="text-sm">{`curl "${baseUrl}/api/finance/invoices?quality=realistic&limit=50"`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-2">Python</h3>
              <div className="bg-gray-900 text-gray-100 rounded p-3 overflow-x-auto">
                <pre className="text-sm">{`import requests

response = requests.get(
    "${baseUrl}/api/finance/invoices",
    params={"quality": "realistic", "limit": 50}
)

data = response.json()`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-2">JavaScript/TypeScript</h3>
              <div className="bg-gray-900 text-gray-100 rounded p-3 overflow-x-auto">
                <pre className="text-sm">{`const response = await fetch(
  "${baseUrl}/api/finance/invoices?quality=realistic&limit=50"
);

const data = await response.json();`}</pre>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

