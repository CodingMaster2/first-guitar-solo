'use client'

import { useState } from 'react'

interface ReferralClientProps {
  initialCode: string | null
  initialCount: number
}

export default function ReferralClient({ initialCode, initialCount }: ReferralClientProps) {
  const [code, setCode] = useState<string | null>(initialCode)
  const [count] = useState(initialCount)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const generateCode = async () => {
    setGenerating(true)
    setError('')
    try {
      const res = await fetch('/api/referral', { method: 'POST' })
      const data = await res.json() as { code?: string; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Failed to generate code')
      setCode(data.code ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate code')
    } finally {
      setGenerating(false)
    }
  }

  const copyCode = async () => {
    if (!code) return
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      /* ignore */
    }
  }

  const shareText = code
    ? `I'm learning guitar with First Guitar Solo — use code ${code} for a discount! https://firstguitarsolo.com`
    : ''

  const copyShareText = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      /* ignore */
    }
  }

  if (!code) {
    return (
      <div className="text-center py-8">
        <p style={{ color: '#a3a3a3' }} className="text-sm mb-4">
          You don&apos;t have a referral code yet. Generate one to start sharing.
        </p>
        {error && (
          <p
            style={{ color: '#ef4444', backgroundColor: '#1a0000', border: '1px solid #7f1d1d' }}
            className="text-xs px-3 py-2 rounded-lg mb-4 inline-block"
          >
            {error}
          </p>
        )}
        <button
          onClick={generateCode}
          disabled={generating}
          style={{ backgroundColor: '#f59e0b', color: '#000' }}
          className="px-8 py-3 rounded-lg text-sm font-black uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {generating ? 'Generating...' : 'Generate My Code'}
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Code display */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div
          style={{
            backgroundColor: '#0a0a0a',
            border: '2px solid #f59e0b',
            borderRadius: 12,
            padding: '14px 24px',
            flex: 1,
            minWidth: 160,
          }}
        >
          <p style={{ color: '#525252' }} className="text-xs uppercase tracking-wider mb-1">
            Your Code
          </p>
          <p
            style={{ color: '#f59e0b', letterSpacing: '0.25em', fontWeight: 900, fontSize: '1.75rem' }}
          >
            {code}
          </p>
        </div>
        <button
          onClick={copyCode}
          style={{
            backgroundColor: copied ? '#14532d' : '#1a1a1a',
            border: `1px solid ${copied ? '#22c55e' : '#262626'}`,
            color: copied ? '#86efac' : '#d4d4d4',
          }}
          className="px-5 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
        >
          {copied ? '✓ Copied!' : 'Copy Code'}
        </button>
      </div>

      {/* Count */}
      <div
        style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }}
        className="rounded-xl px-5 py-4 mb-6 flex items-center gap-3"
      >
        <span style={{ color: '#f59e0b' }} className="text-2xl">👥</span>
        <div>
          <p className="text-white font-bold text-sm">
            {count === 0
              ? 'No one has used your code yet'
              : `${count} ${count === 1 ? 'person' : 'people'} signed up with your link`}
          </p>
          <p style={{ color: '#525252' }} className="text-xs mt-0.5">
            {count === 0
              ? 'Share your code to start earning referrals'
              : 'Keep sharing to grow your referrals'}
          </p>
        </div>
      </div>

      {/* Share text */}
      <div
        style={{ backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f' }}
        className="rounded-xl p-4 mb-4"
      >
        <p style={{ color: '#525252' }} className="text-xs uppercase tracking-wider mb-2">
          Share message
        </p>
        <p style={{ color: '#a3a3a3' }} className="text-sm leading-relaxed mb-3">
          &ldquo;{shareText}&rdquo;
        </p>
        <button
          onClick={copyShareText}
          style={{ border: '1px solid #262626', color: '#a3a3a3' }}
          className="text-xs px-4 py-2 rounded-lg hover:text-white hover:border-amber-600 transition-colors"
        >
          Copy message
        </button>
      </div>

      {/* Share via links */}
      <div className="flex gap-3 flex-wrap">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#d4d4d4' }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm hover:border-amber-600 transition-colors"
        >
          <span>𝕏</span> Share on X
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://firstguitarsolo.com')}&quote=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#d4d4d4' }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm hover:border-amber-600 transition-colors"
        >
          Share on Facebook
        </a>
      </div>
    </div>
  )
}
