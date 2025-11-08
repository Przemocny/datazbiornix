import Link from 'next/link'
import { Domain } from '@/lib/constants/domains'

interface DomainCardProps {
  domain: Domain
}

export function DomainCard({ domain }: DomainCardProps) {
  return (
    <Link 
      href={`/${domain.key}`}
      className="block p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow bg-white"
    >
      <div className="text-4xl mb-3">{domain.icon}</div>
      <h3 className="text-xl font-bold mb-2">{domain.name}</h3>
      <p className="text-gray-600 text-sm mb-4">{domain.description}</p>
      <div className="text-sm text-gray-500">
        {domain.resources.length} zasobów danych
      </div>
    </Link>
  )
}

