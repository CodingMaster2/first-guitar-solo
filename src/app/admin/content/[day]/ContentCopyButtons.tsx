'use client'

import { useState } from 'react'

interface Field {
  key: string
  label: string
  value: string
}

export default function ContentCopyButtons({ fields }: { fields: Field[] }) {
  const [copied, setCopied] = useState<string | null>(null)

  async function copyToClipboard(key: string, value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(key)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <div className="space-y-3 mb-4">
      {fields.map((f) => (
        <div key={f.key} style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p style={{ color: '#525252' }} className="text-xs uppercase tracking-wider">{f.label}</p>
            <button
              onClick={() => { void copyToClipboard(f.key, f.value) }}
              style={{
                backgroundColor: copied === f.key ? '#052e16' : '#1a1a1a',
                border: `1px solid ${copied === f.key ? '#166534' : '#262626'}`,
                color: copied === f.key ? '#86efac' : '#737373',
              }}
              className="text-xs px-2 py-1 rounded transition-colors"
            >
              {copied === f.key ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p
            style={{ color: '#d4d4d4', whiteSpace: 'pre-wrap', fontFamily: f.key === 'mainContent' ? 'monospace' : 'inherit' }}
            className="text-xs max-h-48 overflow-y-auto"
          >
            {f.value}
          </p>
        </div>
      ))}
    </div>
  )
}
