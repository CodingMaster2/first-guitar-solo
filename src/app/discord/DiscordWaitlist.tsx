'use client'

import { useState } from 'react'

export default function DiscordWaitlist() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json() as { success?: boolean; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Failed to join waitlist')
      setStatus('success')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div
        style={{
          backgroundColor: '#0a1a0a',
          border: '1px solid #166534',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✅</p>
        <p style={{ color: '#86efac', fontWeight: 700, marginBottom: '0.25rem' }}>You&apos;re on the list!</p>
        <p style={{ color: '#525252', fontSize: '0.8rem' }}>We&apos;ll notify you when the Discord goes live.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading'}
          style={{
            flex: 1,
            minWidth: 220,
            backgroundColor: '#0a0a0a',
            border: '1px solid #262626',
            borderRadius: '0.5rem',
            padding: '0.625rem 1rem',
            color: '#ffffff',
            fontSize: '0.875rem',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          style={{
            backgroundColor: '#f59e0b',
            color: '#000000',
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.625rem 1.5rem',
            fontWeight: 800,
            fontSize: '0.875rem',
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            opacity: status === 'loading' ? 0.7 : 1,
            whiteSpace: 'nowrap',
          }}
        >
          {status === 'loading' ? 'Joining...' : 'Notify Me'}
        </button>
      </div>
      {status === 'error' && (
        <p style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errorMsg}</p>
      )}
    </form>
  )
}
