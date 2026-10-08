'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

const BENEFITS = [
  'All 30 structured lesson days',
  'AI Guitar Coach — unlimited messages',
  'Solo Forge — unlimited AI solo generation',
  'Fretboard Explorer — interactive tool',
  'Graduation certificate on completion',
]

export default function AnnualSubscribePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleStart = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/annual-subscription', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create checkout session')
      if (data.url) {
        window.location.href = data.url
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <main id="main-content" className="max-w-2xl mx-auto px-4 py-16">
        {/* Best value badge */}
        <div className="flex justify-center mb-6">
          <span
            style={{ backgroundColor: '#451a03', color: '#f59e0b', border: '1px solid #92400e' }}
            className="text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest"
          >
            Best Value
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-center text-4xl font-black text-white uppercase tracking-tight mb-2">
          Annual Plan
        </h1>
        <p style={{ color: '#a3a3a3' }} className="text-center text-sm mb-10">
          Everything you need to play your first guitar solo — one year of full access
        </p>

        {/* Pricing card */}
        <div
          style={{
            backgroundColor: '#111111',
            border: '1px solid #f59e0b',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 0 40px rgba(245,158,11,0.08)',
          }}
        >
          {/* Price display */}
          <div className="text-center mb-8">
            <div className="flex items-end justify-center gap-2 mb-2">
              <span style={{ color: '#f59e0b' }} className="text-6xl font-black leading-none">
                $79
              </span>
              <span style={{ color: '#737373' }} className="text-lg mb-2">
                /year
              </span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span
                style={{ color: '#525252', textDecoration: 'line-through' }}
                className="text-sm"
              >
                $108/year (monthly × 12)
              </span>
              <span
                style={{
                  backgroundColor: '#14532d',
                  color: '#4ade80',
                  border: '1px solid #166534',
                }}
                className="text-xs font-bold px-2 py-0.5 rounded"
              >
                Save 27%
              </span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid #1f1f1f' }} className="mb-6" />

          {/* Benefits list */}
          <ul className="space-y-3 mb-8">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ flexShrink: 0, marginTop: 1 }}
                >
                  <circle cx="12" cy="12" r="10" fill="#451a03" stroke="#f59e0b" strokeWidth="1.5" />
                  <path
                    d="M8 12l3 3 5-5"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span style={{ color: '#d4d4d4' }} className="text-sm">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>

          {/* CTA button */}
          <button
            onClick={handleStart}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#92400e' : '#f59e0b',
              color: '#000000',
              width: '100%',
              padding: '14px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 900,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.15s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeOpacity="0.3"
                  />
                  <path
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                Processing…
              </>
            ) : (
              'Start Annual Plan'
            )}
          </button>

          {error && (
            <p style={{ color: '#fca5a5' }} className="text-sm text-center mt-3">
              {error}
            </p>
          )}
        </div>

        {/* Reassurance line */}
        <p style={{ color: '#525252' }} className="text-xs text-center">
          Secure checkout via Stripe · Cancel anytime · No hidden fees
        </p>
      </main>
    </div>
  )
}
