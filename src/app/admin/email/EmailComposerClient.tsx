'use client'

import { useState } from 'react'

type Segment = 'all' | 'paid' | 'free' | 'churn'

interface Props {
  totalCount: number
  paidCount: number
  freeCount: number
  churnCount: number
}

export default function EmailComposerClient({
  totalCount,
  paidCount,
  freeCount,
  churnCount,
}: Props) {
  const [segment, setSegment] = useState<Segment>('all')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ sent: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)

  const segmentOptions: Array<{ key: Segment; label: string; count: number }> = [
    { key: 'all', label: 'All users', count: totalCount },
    { key: 'paid', label: 'Paid only', count: paidCount },
    { key: 'free', label: 'Free only', count: freeCount },
    { key: 'churn', label: 'Churn risk', count: churnCount },
  ]

  const selectedCount = segmentOptions.find((s) => s.key === segment)?.count ?? 0

  function resetState() {
    setResult(null)
    setError(null)
    setConfirming(false)
  }

  async function handleSend() {
    if (!subject.trim() || !message.trim()) {
      setError('Subject and message are required.')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    setConfirming(false)
    try {
      const res = await fetch('/api/admin/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ segment, subject, message }),
      })
      const data = (await res.json()) as { sent?: number; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Failed to send')
      setResult({ sent: data.sent ?? 0 })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const canSend = subject.trim().length > 0 && message.trim().length > 0 && !loading

  return (
    <div style={{ maxWidth: '680px' }}>
      {/* Segment picker */}
      <div
        style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }}
        className="rounded-xl p-5 mb-4"
      >
        <p style={{ color: '#737373' }} className="text-xs uppercase tracking-wider mb-3">
          Recipient Segment
        </p>
        <div className="flex flex-wrap gap-2">
          {segmentOptions.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => {
                setSegment(s.key)
                resetState()
              }}
              style={{
                backgroundColor: segment === s.key ? '#f59e0b' : '#1a1a1a',
                color: segment === s.key ? '#000000' : '#737373',
                border:
                  segment === s.key ? '1px solid #f59e0b' : '1px solid #262626',
                borderRadius: 8,
                padding: '8px 16px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {s.label} ({s.count.toLocaleString()})
            </button>
          ))}
        </div>
      </div>

      {/* Composer */}
      <div
        style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }}
        className="rounded-xl p-5 mb-4"
      >
        <p style={{ color: '#737373' }} className="text-xs uppercase tracking-wider mb-3">
          Compose
        </p>
        <div className="mb-4">
          <label
            style={{
              color: '#525252',
              fontSize: '0.75rem',
              display: 'block',
              marginBottom: 6,
            }}
          >
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value)
              resetState()
            }}
            placeholder="Email subject..."
            style={{
              width: '100%',
              backgroundColor: '#0a0a0a',
              border: '1px solid #262626',
              borderRadius: 8,
              padding: '10px 14px',
              color: '#ffffff',
              fontSize: '0.875rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div>
          <label
            style={{
              color: '#525252',
              fontSize: '0.75rem',
              display: 'block',
              marginBottom: 6,
            }}
          >
            Message (plain text)
          </label>
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              resetState()
            }}
            placeholder="Write your message here..."
            rows={8}
            style={{
              width: '100%',
              backgroundColor: '#0a0a0a',
              border: '1px solid #262626',
              borderRadius: 8,
              padding: '10px 14px',
              color: '#ffffff',
              fontSize: '0.875rem',
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Preview */}
      {(subject.length > 0 || message.length > 0) && (
        <div
          style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }}
          className="rounded-xl p-5 mb-4"
        >
          <p style={{ color: '#737373' }} className="text-xs uppercase tracking-wider mb-3">
            Preview
          </p>
          <div
            style={{
              backgroundColor: '#0d0d0d',
              border: '1px solid #262626',
              borderRadius: 8,
              padding: '20px',
            }}
          >
            <p style={{ color: '#525252', fontSize: '0.7rem', marginBottom: 4 }}>
              SUBJECT
            </p>
            <p
              style={{
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.95rem',
                marginBottom: 16,
              }}
            >
              {subject || '(no subject)'}
            </p>
            <div style={{ borderTop: '1px solid #1f1f1f', paddingTop: 16 }}>
              <p
                style={{
                  color: '#d4d4d4',
                  fontSize: '0.875rem',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {message || '(no message)'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Send area */}
      <div
        style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }}
        className="rounded-xl p-5"
      >
        {result ? (
          <div
            style={{
              backgroundColor: '#052e16',
              border: '1px solid #166534',
              borderRadius: 8,
              padding: '12px 16px',
            }}
          >
            <p style={{ color: '#86efac', fontSize: '0.875rem', fontWeight: 700 }}>
              ✓ Sent to {result.sent.toLocaleString()} users
            </p>
          </div>
        ) : confirming ? (
          <div>
            <div
              style={{
                backgroundColor: '#1a0800',
                border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: 8,
                padding: '12px 16px',
                marginBottom: 12,
              }}
            >
              <p style={{ color: '#f59e0b', fontSize: '0.875rem', fontWeight: 700 }}>
                ⚠ Are you sure? This sends to {selectedCount.toLocaleString()} real email
                addresses.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="button"
                onClick={handleSend}
                disabled={loading}
                style={{
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 20px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading
                  ? 'Sending…'
                  : `Yes, send to ${selectedCount.toLocaleString()} users`}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={loading}
                style={{
                  backgroundColor: 'transparent',
                  color: '#737373',
                  border: '1px solid #262626',
                  borderRadius: 8,
                  padding: '10px 20px',
                  fontSize: '0.875rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            disabled={!canSend}
            style={{
              backgroundColor: '#f59e0b',
              color: '#000000',
              border: 'none',
              borderRadius: 8,
              padding: '12px 24px',
              fontSize: '0.875rem',
              fontWeight: 900,
              cursor: !canSend ? 'not-allowed' : 'pointer',
              opacity: !canSend ? 0.5 : 1,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Send to {selectedCount.toLocaleString()} users &rarr;
          </button>
        )}

        {error && (
          <div
            style={{
              backgroundColor: '#1a0000',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 8,
              padding: '12px 16px',
              marginTop: 12,
            }}
          >
            <p style={{ color: '#fca5a5', fontSize: '0.875rem' }}>{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
