'use client'

import { useState } from 'react'
import Link from 'next/link'

const INCLUDED = [
  '30 structured lessons',
  'AI Guitar Coach — unlimited access',
  'Progress tracking',
  'Original blues-rock solo + backing tracks',
  'AI-personalized 8-bar solo on Day 30',
]

export default function SubscribePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubscribe = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/subscription', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create subscription')
      if (data.url) window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '28rem',
          backgroundColor: '#111111',
          border: '1px solid #262626',
          borderRadius: '1rem',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {/* Card header */}
        <div
          style={{
            backgroundColor: '#0d0a00',
            borderBottom: '1px solid #2a1f00',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: '#f59e0b',
              fontSize: '0.7rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              marginBottom: '0.5rem',
            }}
          >
            Monthly Access
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              gap: '0.25rem',
            }}
          >
            <span
              style={{ color: '#ffffff', fontSize: '3.5rem', fontWeight: 900, lineHeight: 1 }}
            >
              $9
            </span>
            <span style={{ color: '#737373', fontSize: '1rem' }}>/month</span>
          </div>
        </div>

        {/* Card body */}
        <div style={{ padding: '2rem' }}>
          <p
            style={{
              color: '#a3a3a3',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
              lineHeight: 1.65,
            }}
          >
            Everything in the program, billed monthly. Cancel anytime — no questions asked.
          </p>

          <ul
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              marginBottom: '2rem',
              padding: 0,
              listStyle: 'none',
            }}
          >
            {INCLUDED.map((item) => (
              <li
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  color: '#a3a3a3',
                  fontSize: '0.875rem',
                }}
              >
                <span style={{ color: '#f59e0b', flexShrink: 0 }} aria-hidden="true">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>

          {/* Cancel anytime callout */}
          <div
            style={{
              backgroundColor: '#0a0a0a',
              border: '1px solid #1f1f1f',
              borderRadius: '0.5rem',
              padding: '0.875rem 1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span style={{ fontSize: '1rem' }} aria-hidden="true">
              🔓
            </span>
            <p style={{ color: '#737373', fontSize: '0.8rem', margin: 0 }}>
              Cancel anytime from your account settings — no fees, no hassle.
            </p>
          </div>

          {error && (
            <p style={{ color: '#f87171', fontSize: '0.875rem', marginBottom: '1rem' }}>
              {error}
            </p>
          )}

          <button
            onClick={handleSubscribe}
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000000',
              fontWeight: 900,
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              width: '100%',
              marginBottom: '1rem',
            }}
          >
            {loading ? 'Processing...' : 'Subscribe — $9/month'}
          </button>

          <p style={{ textAlign: 'center', color: '#525252', fontSize: '0.875rem' }}>
            Prefer to own it forever?{' '}
            <Link href="/register" style={{ color: '#f59e0b', textDecoration: 'none' }}>
              Get lifetime access for $25 →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
