import { DomainCard } from '@/components/DomainCard'
import { DOMAINS } from '@/lib/constants/domains'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">DataContainer</h1>
          <p className="text-sm text-gray-600">Platforma do Nauki Pracy z Danymi</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-4 text-gray-900">
            Ucz się pracy z danymi na realistycznych przykładach
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Ponad milion rekordów danych biznesowych z 7 różnych działów. 
            Trzy poziomy jakości: idealne, ładne i realistyczne.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="#domains" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Rozpocznij Naukę
            </Link>
            <Link 
              href="/guide" 
              className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Jak korzystać?
            </Link>
          </div>
        </div>
      </section>

      {/* Quality Levels */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12">Poziomy Jakości Danych</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">✨</div>
              <h4 className="text-xl font-bold mb-2">Idealne</h4>
              <p className="text-gray-600 mb-2">100% kompletności</p>
              <p className="text-sm text-gray-500">
                Dane perfekcyjne, bez błędów. Idealne do nauki podstaw.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🧹</div>
              <h4 className="text-xl font-bold mb-2">Ładne</h4>
              <p className="text-gray-600 mb-2">5-10% problemów</p>
              <p className="text-sm text-gray-500">
                Drobne błędy i brakujące wartości. Realistyczne, ale nie trudne.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🌍</div>
              <h4 className="text-xl font-bold mb-2">Realistyczne</h4>
              <p className="text-gray-600 mb-2">10-20% błędów</p>
              <p className="text-sm text-gray-500">
                Jak w prawdziwej firmie. Wymaga czyszczenia i walidacji.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Domains */}
      <section id="domains" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-4">Działy Biznesowe</h3>
          <p className="text-center text-gray-600 mb-12">
            Wybierz dział, aby zobaczyć dostępne zasoby danych
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {DOMAINS.map(domain => (
              <DomainCard key={domain.key} domain={domain} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12">Co oferujemy?</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">📊</div>
              <h4 className="font-bold mb-2">REST API</h4>
              <p className="text-sm text-gray-600">
                Paginacja, filtry, sortowanie i eksport CSV
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📖</div>
              <h4 className="font-bold mb-2">Dokumentacja</h4>
              <p className="text-sm text-gray-600">
                Interaktywna dokumentacja Swagger dla każdego endpointa
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🎓</div>
              <h4 className="font-bold mb-2">Tutorial</h4>
              <p className="text-sm text-gray-600">
                Krok po kroku dla osób zaczynających
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💾</div>
              <h4 className="font-bold mb-2">~1M rekordów</h4>
              <p className="text-sm text-gray-600">
                Wystarczająco dużo danych do realnej nauki
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold mb-4">DataContainer</h4>
              <p className="text-gray-400 text-sm">
                Platforma edukacyjna do nauki pracy z danymi i API.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Linki</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/guide" className="text-gray-400 hover:text-white">Jak korzystać</Link></li>
                <li><Link href="/api-docs" className="text-gray-400 hover:text-white">Dokumentacja API</Link></li>
                <li><Link href="#domains" className="text-gray-400 hover:text-white">Działy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Dane</h4>
              <p className="text-gray-400 text-sm">
                Wszystkie dane są w 100% fikcyjne i wygenerowane. 
                Możesz ich używać do nauki bez ograniczeń.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 DataContainer. Stworzono dla celów edukacyjnych.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
