'use client'

import Link from 'next/link'

export default function GuidePage() {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005'
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            ← Powrót do strony głównej
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Jak korzystać z DataZbiornix?</h1>

        {/* Section 1 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">1. Czym jest API?</h2>
          <p className="text-gray-700 mb-4">
            API (Application Programming Interface) to sposób, w jaki programy komunikują się ze sobą. 
            Wyobraź sobie to jak menu w restauracji - pokazuje co możesz zamówić i jak to zamówić.
          </p>
          <p className="text-gray-700">
            W DataZbiornix, API pozwala Ci pobierać dane biznesowe w różnych formatach, 
            filtrować je i eksportować do dalszej analizy.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">2. Przeglądanie danych w przeglądarce</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Wybierz dział na stronie głównej (np. Finanse)</li>
              <li>Wybierz zasób danych (np. Faktury)</li>
              <li>Zmień poziom jakości danych (Idealne/Ładne/Realistyczne)</li>
              <li>Przeglądaj dane w tabeli lub pobierz CSV</li>
            </ol>
          </div>
        </section>

        {/* Section 3 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">3. Pobieranie danych przez API</h2>
          <p className="text-gray-700 mb-4">
            Możesz pobrać dane programowo używając dowolnego języka programowania:
          </p>
          
          <div className="bg-gray-900 text-gray-100 rounded-lg p-6 mb-4">
            <p className="text-sm text-gray-400 mb-2">Python:</p>
            <pre className="text-sm overflow-x-auto">
{`import requests

response = requests.get(
    '${baseUrl}/api/finance/invoices',
    params={'quality': 'realistic', 'limit': 100}
)

data = response.json()
print(f"Pobrano {len(data['data'])} faktur")`}
            </pre>
          </div>

          <div className="bg-gray-900 text-gray-100 rounded-lg p-6">
            <p className="text-sm text-gray-400 mb-2">JavaScript/TypeScript:</p>
            <pre className="text-sm overflow-x-auto">
{`const response = await fetch(
  '${baseUrl}/api/finance/invoices?quality=realistic&limit=100'
);

const data = await response.json();
console.log(\`Pobrano \${data.data.length} faktur\`);`}
            </pre>
          </div>
        </section>

        {/* Section 4 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">4. Parametry API</h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parametr</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wartości</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm font-mono">quality</td>
                  <td className="px-6 py-4 text-sm">ideal, clean, realistic</td>
                  <td className="px-6 py-4 text-sm">Poziom jakości danych</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-mono">page</td>
                  <td className="px-6 py-4 text-sm">liczba ≥ 1</td>
                  <td className="px-6 py-4 text-sm">Numer strony</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-mono">limit</td>
                  <td className="px-6 py-4 text-sm">1-1000</td>
                  <td className="px-6 py-4 text-sm">Liczba rekordów na stronę</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-mono">format</td>
                  <td className="px-6 py-4 text-sm">json, csv</td>
                  <td className="px-6 py-4 text-sm">Format odpowiedzi</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-mono">sort</td>
                  <td className="px-6 py-4 text-sm">nazwa pola</td>
                  <td className="px-6 py-4 text-sm">Sortowanie</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-mono">order</td>
                  <td className="px-6 py-4 text-sm">asc, desc</td>
                  <td className="px-6 py-4 text-sm">Kierunek sortowania</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">5. Eksport do CSV</h2>
          <p className="text-gray-700 mb-4">
            CSV to prosty format tabelaryczny, który możesz otworzyć w Excel lub Google Sheets.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Sposób 1:</strong> Kliknij przycisk "Pobierz CSV" na stronie zasobu
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Sposób 2:</strong> Dodaj parametr <code className="bg-gray-100 px-2 py-1 rounded">format=csv</code> do URL API
          </p>
          <div className="bg-gray-900 text-gray-100 rounded-lg p-6">
            <pre className="text-sm overflow-x-auto">
{`${baseUrl}/api/finance/invoices?quality=realistic&format=csv&limit=1000`}
            </pre>
          </div>
        </section>

        {/* Section 6 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">6. Przykładowe scenariusze użycia</h2>
          
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold mb-2">Scenariusz 1: Analiza faktur zaległych</h3>
              <p className="text-sm text-gray-700 mb-3">
                Pobierz faktury ze statusem "overdue" i przeanalizuj które klienci mają największe zaległości.
              </p>
              <code className="text-xs bg-white px-2 py-1 rounded">
                /api/finance/invoices?status=overdue&sort=amount&order=desc
              </code>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-bold mb-2">Scenariusz 2: Konwersja leadów</h3>
              <p className="text-sm text-gray-700 mb-3">
                Pobierz leady ze statusem "qualified" i sprawdź ile z nich przekształciło się w deale.
              </p>
              <code className="text-xs bg-white px-2 py-1 rounded">
                /api/sales/leads?status=qualified
              </code>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="font-bold mb-2">Scenariusz 3: Optymalizacja kampanii</h3>
              <p className="text-sm text-gray-700 mb-3">
                Pobierz metryki kampanii i oblicz ROI dla różnych platform reklamowych.
              </p>
              <code className="text-xs bg-white px-2 py-1 rounded">
                /api/marketing/campaign_metrics?format=csv
              </code>
            </div>
          </div>
        </section>

        {/* Section 7 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">7. Praca z brudnymi danymi</h2>
          <p className="text-gray-700 mb-4">
            W trybie "Realistyczne" znajdziesz różne typy błędów:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Brakujące wartości:</strong> NULL, puste stringi, "N/A"</li>
            <li><strong>Błędne formaty:</strong> email bez @, daty jako "TBD"</li>
            <li><strong>Wartości poza zakresem:</strong> ujemne ceny, przyszłe daty urodzenia</li>
            <li><strong>Duplikaty:</strong> te same rekordy z drobnymi zmianami</li>
            <li><strong>Niespójności:</strong> różne formaty tego samego pola</li>
          </ul>
          <p className="text-gray-700 mt-4">
            To świetna okazja do nauki technik czyszczenia danych!
          </p>
        </section>

        {/* CTA */}
        <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Gotowy do nauki?</h3>
          <p className="mb-6">Rozpocznij eksplorację danych już teraz!</p>
          <Link 
            href="/"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Powrót do strony głównej
          </Link>
        </div>
      </div>
    </div>
  )
}

