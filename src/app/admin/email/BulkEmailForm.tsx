'use client'

import { useState } from 'react'

type Segment = 'paid' | 'unpaid' | 'inactive'

interface SegmentOption {
  key: Segment
  label: string
  count: number
}

interface Props {
  paidCount: number
  unpaidCount: number
  inactiveCount: number
}

interface SendResult {
  success: boolean
  recipientCount: number
  preview: { subject: string; to: string[]; body: string }
  note: string
}

export default function BulkEmailForm({ paidCount, unpaidCount, inactiveCount }: Props) {
  const [segment, setSegment] = useState<Segment>('paid')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SendResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)

  const segmentOptions: SegmentOption[] = [
    { key: 'paid', label: 'All Paid Users', count: paidCount },
    { key: 'unpaid', label: 'All Unpaid/Free', count: unpaidCount },
    { key: 'inactive', label: 'Inactive 7+ days', count: inactiveCount },
  ]

  const selectedOption = segmentOptions.find((s) => s.key === segment)!

  function resetResult() {
    setResult(null)
    setError(null)
    setConfirming(false)
  }

  async function handleSend() {
    if (!subject.trim() || !body.trim()) {
      setError('Subject and body are required.')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    setConfirming(false)
    try {
      const res = await fetch('/api/admin/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ segment, subject, body }),
      })
      const data = (await res.json()) as SendResult & { error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Request failed')
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const canSend = subject.trim().length > 0 && body.trim().length > 0 && !loading

  return (
    <div style={{ maxWidth: 720 }}>
      {/* Segment selector */}
      <div
        style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }}
        className="rounded-xl p-5 mb-4"
      >
        <p style={{ color: '#737373' }} className="text-xs uppercase tracking-wider mb-3">
          Recipient Segment
        </p>
        <div className="flex flex-wrap gap-3">
          {segmentOptions.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => {
                setSegment(s.key)
                resetResult()
              }}
              style={{
                backgroundColor: segment === s.key ? '#f59e0b' : '#1a1a1a',
                color: segment === s.key ? '#000000' : '#737373',
                border: segment === s.key ? '1px solid #f59e0b' : '1px solid #262626',
                borderRadius: 8,
                padding: '10px 18px',
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

      {/* Compose */}
      <div
        style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }}
        className="rounded-xl p-5 mb-4"
      >
        <p style={{ color: '#737373' }} className="text-xs uppercase tracking-wider mb-3">
          Compose
        </p>

        {/* Subject */}
        <div className="mb-4">
          <label style={{ color: '#525252', fontSize: '0.75rem', display: 'block', marginBottom: 6 }}>
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => { setSubject(e.target.value); resetResult() }}
            placeholder="Email subject..."
            required
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

        {/* Body */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label style={{ color: '#525252', fontSize: '0.75rem' }}>
              Body
            </label>
            <span style={{ color: '#404040', fontSize: '0.7rem' }}>
              {body.length.toLocaleString()} chars
            </span>
          </div>
          <textarea
            value={body}
            onChange={(e) => { setBody(e.target.value); resetResult() }}
            placeholder="Write your message here..."
            rows={10}
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
      {(subject.length > 0 || body.length > 0) && (
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
            <p style={{ color: '#525252', fontSize: '0.7rem', marginBottom: 4 }}>SUBJECT</p>
            <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem', marginBottom: 16 }}>
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
                {body || '(no body)'}
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
          <div>
            <div
              style={{
                backgroundColor: '#052e16',
                border: '1px solid #166534',
                borderRadius: 8,
                padding: '12px 16px',
                marginBottom: 12,
              }}
            >
              <p style={{ color: '#86efac', fontSize: '0.875rem', fontWeight: 700 }}>
                ✓ Logged for {result.recipientCount.toLocaleString()} recipients
              </p>
              <p style={{ color: '#4ade80', fontSize: '0.75rem', marginTop: 4 }}>
                {result.note}
              </p>
            </div>
            <div
              style={{
                backgroundColor: '#0d0d0d',
                border: '1px solid #262626',
                borderRadius: 8,
                padding: '12px 16px',
              }}
            >
              <p style={{ color: '#525252', fontSize: '0.7rem', marginBottom: 6 }}>PREVIEW RECIPIENTS (first 3)</p>
              {result.preview.to.map((email) => (
                <p key={email} style={{ color: '#737373', fontSize: '0.8rem' }}>{email}</p>
              ))}
            </div>
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
                Send to {selectedOption.count.toLocaleString()} users?
              </p>
              <p style={{ color: '#a16207', fontSize: '0.75rem', marginTop: 4 }}>
                Segment: {selectedOption.label}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="button"
                onClick={handleSend}
                disabled={loading}
                style={{
                  backgroundColor: '#f59e0b',
                  color: '#000000',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 20px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Processing…' : `Send to ${selectedOption.count.toLocaleString()} users`}
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
            Send to {selectedOption.count.toLocaleString()} users &rarr;
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
