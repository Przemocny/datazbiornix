'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminPage() {
  const [apiKey, setApiKey] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [seeding, setSeeding] = useState(false)
  const [seedResult, setSeedResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const authenticate = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'X-API-Key': apiKey,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
        setIsAuthenticated(true)
        setError(null)
        localStorage.setItem('admin_api_key', apiKey)
      } else {
        setError('Nieprawidłowy klucz API')
        setIsAuthenticated(false)
      }
    } catch (err) {
      setError('Błąd połączenia')
    }
  }

  const runSeed = async () => {
    setSeeding(true)
    setSeedResult(null)
    setError(null)

    try {
      const response = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({ domain: 'all' }),
      })

      const data = await response.json()

      if (response.ok) {
        setSeedResult('Seed zakończony sukcesem!')
        // Refresh stats
        authenticate()
      } else {
        setError(data.message || 'Błąd podczas seedowania')
      }
    } catch (err) {
      setError('Błąd połączenia')
    } finally {
      setSeeding(false)
    }
  }

  useEffect(() => {
    // Try to load API key from localStorage
    const savedKey = localStorage.getItem('admin_api_key')
    if (savedKey) {
      setApiKey(savedKey)
    }
  }, [])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Panel</h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && authenticate()}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Wprowadź klucz API"
            />
          </div>

          <button
            onClick={authenticate}
            className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700"
          >
            Zaloguj
          </button>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-600 hover:underline">
              ← Powrót do strony głównej
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-sm text-gray-600">Zarządzanie platformą DataZbiornix</p>
          </div>
          <button
            onClick={() => {
              setIsAuthenticated(false)
              setApiKey('')
              localStorage.removeItem('admin_api_key')
            }}
            className="text-sm text-gray-600 hover:underline"
          >
            Wyloguj
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Seed Section */}
        <section className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Seed Bazy Danych</h2>
          <p className="text-gray-600 mb-4">
            Regeneruj wszystkie dane w bazie. Ten proces może zająć kilka minut.
          </p>

          {seedResult && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded p-3 mb-4">
              {seedResult}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded p-3 mb-4">
              {error}
            </div>
          )}

          <button
            onClick={runSeed}
            disabled={seeding}
            className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {seeding ? 'Seedowanie...' : '🌱 Uruchom Seed'}
          </button>
        </section>

        {/* Stats Section */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-6">Statystyki Bazy Danych</h2>
          
          {stats && (
            <div className="space-y-6">
              {/* Total */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-3xl font-bold text-blue-600">
                  {stats.total.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Łączna liczba rekordów</div>
              </div>

              {/* Finance */}
              <div>
                <h3 className="font-bold text-lg mb-3">🏦 Finanse</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard label="Faktury" value={stats.finance.invoices} />
                  <StatCard label="Transakcje" value={stats.finance.transactions} />
                  <StatCard label="Wpisy budżetowe" value={stats.finance.budgetEntries} />
                  <StatCard label="Centra kosztów" value={stats.finance.costCenters} />
                </div>
              </div>

              {/* Sales */}
              <div>
                <h3 className="font-bold text-lg mb-3">💼 Sprzedaż</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard label="Leady" value={stats.sales.leads} />
                  <StatCard label="Qualified Leads" value={stats.sales.qualifiedLeads} />
                  <StatCard label="Deale" value={stats.sales.deals} />
                  <StatCard label="Szanse" value={stats.sales.opportunities} />
                </div>
              </div>

              {/* Marketing */}
              <div>
                <h3 className="font-bold text-lg mb-3">📢 Marketing</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard label="Kampanie" value={stats.marketing.campaigns} />
                  <StatCard label="Grupy reklam" value={stats.marketing.adGroups} />
                  <StatCard label="Reklamy" value={stats.marketing.ads} />
                  <StatCard label="Metryki" value={stats.marketing.campaignMetrics} />
                </div>
              </div>

              {/* Logistics */}
              <div>
                <h3 className="font-bold text-lg mb-3">🚚 Logistyka</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard label="Magazyny" value={stats.logistics.warehouses} />
                  <StatCard label="Paczki" value={stats.logistics.packages} />
                  <StatCard label="Wysyłki" value={stats.logistics.shipments} />
                  <StatCard label="Trasy" value={stats.logistics.deliveryRoutes} />
                </div>
              </div>

              {/* Ecommerce */}
              <div>
                <h3 className="font-bold text-lg mb-3">🛒 E-commerce</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard label="Klienci" value={stats.ecommerce.customers} />
                  <StatCard label="Produkty" value={stats.ecommerce.products} />
                  <StatCard label="Zamówienia" value={stats.ecommerce.orders} />
                  <StatCard label="Płatności" value={stats.ecommerce.payments} />
                </div>
              </div>

              {/* Production */}
              <div>
                <h3 className="font-bold text-lg mb-3">🏭 Produkcja</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard label="Dostawcy" value={stats.production.suppliers} />
                  <StatCard label="Zamówienia" value={stats.production.supplierOrders} />
                  <StatCard label="Partie" value={stats.production.productionBatches} />
                  <StatCard label="Kontrole" value={stats.production.qualityChecks} />
                </div>
              </div>

              {/* Time Tracking */}
              <div>
                <h3 className="font-bold text-lg mb-3">⏱️ Time Tracking</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard label="Pracownicy" value={stats.timeTracking.employees} />
                  <StatCard label="Projekty" value={stats.timeTracking.projects} />
                  <StatCard label="Taski" value={stats.timeTracking.tasks} />
                  <StatCard label="Wpisy czasu" value={stats.timeTracking.timeEntries} />
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded p-3">
      <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  )
}

