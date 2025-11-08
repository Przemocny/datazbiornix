'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'

interface MermaidDiagramProps {
  chart: string
  id?: string
}

declare global {
  interface Window {
    mermaid: any
  }
}

export function MermaidDiagram({ chart, id = 'mermaid-diagram' }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const renderDiagram = async () => {
      if (typeof window !== 'undefined' && window.mermaid && ref.current) {
        try {
          window.mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
            fontFamily: 'Inter, system-ui, sans-serif',
          })

          const uniqueId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          const { svg } = await window.mermaid.render(uniqueId, chart)
          
          if (ref.current) {
            ref.current.innerHTML = svg
          }
        } catch (error) {
          console.error('Mermaid rendering error:', error)
          if (ref.current) {
            ref.current.innerHTML = `<pre class="text-red-600 text-sm">${error}</pre>`
          }
        }
      }
    }

    const timer = setTimeout(renderDiagram, 100)
    return () => clearTimeout(timer)
  }, [chart])

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.mermaid) {
            window.mermaid.initialize({
              startOnLoad: false,
              theme: 'default',
              securityLevel: 'loose',
              fontFamily: 'Inter, system-ui, sans-serif',
            })
          }
        }}
      />
      <div 
        ref={ref} 
        className="bg-white p-6 rounded-lg border border-gray-200 overflow-x-auto min-h-[400px] flex items-center justify-center"
        id={id}
      >
        <div className="text-gray-400">Ładowanie diagramu...</div>
      </div>
    </>
  )
}

