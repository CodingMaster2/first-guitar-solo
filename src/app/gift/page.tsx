'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function GiftPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    fromName: '',
    fromEmail: '',
    toEmail: '',
    message: '',
  })
  const [redeemCode, setRedeemCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [redeemLoading, setRedeemLoading] = useState(false)
  const [error, setError] = useState('')
  const [redeemError, setRedeemError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/gift/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create checkout')
      if (data.url) window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault()
    setRedeemLoading(true)
    setRedeemError('')
    try {
      const res = await fetch('/api/gift/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: redeemCode }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to redeem code')
      router.push('/dashboard')
    } catch (err) {
      setRedeemError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setRedeemLoading(false)
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
      {/* Main gift card */}
      <div
        style={{
          width: '100%',
          maxWidth: '32rem',
          backgroundColor: '#111111',
          border: '1px solid #262626',
          borderRadius: '1rem',
          padding: '2.5rem',
          marginBottom: '1.5rem',
          boxSizing: 'border-box',
        }}
      >
        <h1
          style={{
            color: '#f59e0b',
            fontSize: '1.75rem',
            fontWeight: 900,
            marginBottom: '0.5rem',
            textAlign: 'center',
          }}
        >
          Give the Gift of Guitar 🎸
        </h1>
        <p
          style={{
            color: '#737373',
            fontSize: '0.875rem',
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          Buy First Guitar Solo as a gift — $25 one-time payment.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
        >
          {/* Your name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <label
              htmlFor="fromName"
              style={{ color: '#a3a3a3', fontSize: '0.875rem', fontWeight: 600 }}
            >
              Your name <span style={{ color: '#f59e0b' }}>*</span>
            </label>
            <input
              id="fromName"
              type="text"
              required
              value={form.fromName}
              onChange={(e) => setForm({ ...form, fromName: e.target.value })}
              placeholder="Jane Smith"
              style={{
                backgroundColor: '#0a0a0a',
                border: '1px solid #262626',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Your email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <label
              htmlFor="fromEmail"
              style={{ color: '#a3a3a3', fontSize: '0.875rem', fontWeight: 600 }}
            >
              Your email <span style={{ color: '#f59e0b' }}>*</span>
            </label>
            <input
              id="fromEmail"
              type="email"
              required
              value={form.fromEmail}
              onChange={(e) => setForm({ ...form, fromEmail: e.target.value })}
              placeholder="jane@example.com"
              style={{
                backgroundColor: '#0a0a0a',
                border: '1px solid #262626',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Recipient email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <label
              htmlFor="toEmail"
              style={{ color: '#a3a3a3', fontSize: '0.875rem', fontWeight: 600 }}
            >
              Recipient&apos;s email{' '}
              <span style={{ color: '#525252', fontWeight: 400 }}>(optional)</span>
            </label>
            <p style={{ color: '#525252', fontSize: '0.75rem', margin: 0 }}>
              We&apos;ll email them the gift code
            </p>
            <input
              id="toEmail"
              type="email"
              value={form.toEmail}
              onChange={(e) => setForm({ ...form, toEmail: e.target.value })}
              placeholder="friend@example.com"
              style={{
                backgroundColor: '#0a0a0a',
                border: '1px solid #262626',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Personal message */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <label
              htmlFor="message"
              style={{ color: '#a3a3a3', fontSize: '0.875rem', fontWeight: 600 }}
            >
              Personal message{' '}
              <span style={{ color: '#525252', fontWeight: 400 }}>(optional, max 200 chars)</span>
            </label>
            <textarea
              id="message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value.slice(0, 200) })}
              placeholder="Happy birthday! I thought you'd love this..."
              rows={3}
              style={{
                backgroundColor: '#0a0a0a',
                border: '1px solid #262626',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
                resize: 'vertical',
                width: '100%',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
            <p
              style={{
                color: '#404040',
                fontSize: '0.75rem',
                textAlign: 'right',
                margin: 0,
              }}
            >
              {form.message.length}/200
            </p>
          </div>

          {error && (
            <p style={{ color: '#f87171', fontSize: '0.875rem', margin: 0 }}>{error}</p>
          )}

          <button
            type="submit"
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
            }}
          >
            {loading ? 'Processing...' : 'Buy Gift — $25'}
          </button>
        </form>
      </div>

      {/* Redeem card */}
      <div
        style={{
          width: '100%',
          maxWidth: '32rem',
          backgroundColor: '#111111',
          border: '1px solid #1f1f1f',
          borderRadius: '1rem',
          padding: '1.75rem',
          boxSizing: 'border-box',
        }}
      >
        <p
          style={{
            color: '#737373',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginBottom: '1rem',
            textAlign: 'center',
          }}
        >
          Already have a gift code?
        </p>
        <form
          onSubmit={handleRedeem}
          style={{ display: 'flex', gap: '0.75rem' }}
        >
          <input
            type="text"
            value={redeemCode}
            onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
            placeholder="GIFT-XXXXXX"
            style={{
              flex: 1,
              backgroundColor: '#0a0a0a',
              border: '1px solid #262626',
              borderRadius: '0.5rem',
              padding: '0.75rem 1rem',
              color: '#ffffff',
              fontSize: '0.875rem',
              outline: 'none',
              fontFamily: 'monospace',
              minWidth: 0,
            }}
          />
          <button
            type="submit"
            disabled={redeemLoading || !redeemCode.trim()}
            style={{
              backgroundColor: '#1f1f1f',
              border: '1px solid #262626',
              color: '#f59e0b',
              fontWeight: 700,
              fontSize: '0.875rem',
              padding: '0.75rem 1.25rem',
              borderRadius: '0.5rem',
              cursor: redeemLoading || !redeemCode.trim() ? 'not-allowed' : 'pointer',
              opacity: redeemLoading || !redeemCode.trim() ? 0.5 : 1,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {redeemLoading ? '...' : 'Redeem'}
          </button>
        </form>
        {redeemError && (
          <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.5rem' }}>
            {redeemError}
          </p>
        )}
      </div>
    </div>
  )
}
