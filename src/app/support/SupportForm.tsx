'use client'

import { useState } from 'react'
import Link from 'next/link'

const SUBJECTS = [
  'Technical Issue',
  'Payment',
  'Lesson Question',
  'Other',
]

interface SupportFormProps {
  defaultEmail?: string
  isLoggedIn: boolean
}

export default function SupportForm({ defaultEmail, isLoggedIn }: SupportFormProps) {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState(defaultEmail ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!subject) { setError('Please select a subject.'); return }
    if (!message.trim()) { setError('Please enter a message.'); return }
    if (!isLoggedIn && !email.trim()) { setError('Please enter your email.'); return }

    setSubmitting(true)
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message: message.trim(), email: email.trim() || undefined }),
      })
      const data = await res.json() as { success?: boolean; error?: string }
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
      } else {
        setSuccess(true)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div
        style={{
          backgroundColor: '#052e16',
          border: '1px solid #166534',
          borderRadius: 12,
          padding: '32px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>&#10003;</div>
        <h2 style={{ color: '#86efac', fontWeight: 900, fontSize: '1.25rem', marginBottom: 8 }}>
          Message received!
        </h2>
        <p style={{ color: '#4ade80', fontSize: '0.9rem' }}>
          We&apos;ll respond within 24 hours.
        </p>
        <p style={{ color: '#a3a3a3', fontSize: '0.8rem', marginTop: 16 }}>
          Check your spam folder if you don&apos;t hear from us.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Support request form">
      {/* Check FAQ first */}
      <div
        style={{
          backgroundColor: '#1a1000',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 60 72" fill="#f59e0b" aria-hidden="true">
          <path d="M30 0 C50 0 60 12 60 24 C60 48 30 72 30 72 C30 72 0 48 0 24 C0 12 10 0 30 0Z"/>
        </svg>
        <p style={{ color: '#fde68a', fontSize: '0.82rem', margin: 0 }}>
          Check our{' '}
          <Link href="/#faq" style={{ color: '#f59e0b', fontWeight: 700 }}>
            FAQ first &rarr;
          </Link>{' '}
          — your question might already be answered.
        </p>
      </div>

      {/* Email (guest only) */}
      {!isLoggedIn && (
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="support-email"
            style={{ color: '#a3a3a3', fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: 6 }}
          >
            Your Email
          </label>
          <input
            id="support-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            style={{
              width: '100%',
              backgroundColor: '#0a0a0a',
              border: '1px solid #262626',
              borderRadius: 8,
              padding: '10px 12px',
              color: '#ffffff',
              fontSize: '0.875rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#f59e0b' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#262626' }}
          />
        </div>
      )}

      {/* Subject */}
      <div style={{ marginBottom: 20 }}>
        <label
          htmlFor="support-subject"
          style={{ color: '#a3a3a3', fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: 6 }}
        >
          Subject
        </label>
        <select
          id="support-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          style={{
            width: '100%',
            backgroundColor: '#0a0a0a',
            border: '1px solid #262626',
            borderRadius: 8,
            padding: '10px 12px',
            color: subject ? '#ffffff' : '#525252',
            fontSize: '0.875rem',
            outline: 'none',
            boxSizing: 'border-box',
            appearance: 'none',
            cursor: 'pointer',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#f59e0b' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = '#262626' }}
        >
          <option value="" disabled>Select a subject…</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div style={{ marginBottom: 24 }}>
        <label
          htmlFor="support-message"
          style={{ color: '#a3a3a3', fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: 6 }}
        >
          Message
        </label>
        <textarea
          id="support-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          placeholder="Describe your issue or question in detail…"
          style={{
            width: '100%',
            backgroundColor: '#0a0a0a',
            border: '1px solid #262626',
            borderRadius: 8,
            padding: '10px 12px',
            color: '#d4d4d4',
            fontSize: '0.875rem',
            lineHeight: 1.65,
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#f59e0b' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = '#262626' }}
        />
      </div>

      {error && (
        <p
          role="alert"
          style={{
            color: '#f87171',
            fontSize: '0.82rem',
            marginBottom: 16,
            backgroundColor: '#1f0000',
            border: '1px solid #991b1b',
            borderRadius: 6,
            padding: '8px 12px',
          }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        aria-label="Submit support request"
        style={{
          width: '100%',
          backgroundColor: submitting ? '#262626' : '#f59e0b',
          color: submitting ? '#a3a3a3' : '#000',
          border: 'none',
          borderRadius: 8,
          padding: '12px 24px',
          fontSize: '0.9rem',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          cursor: submitting ? 'not-allowed' : 'pointer',
          transition: 'background 0.15s ease',
        }}
      >
        {submitting ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
