'use client'

import { useState } from 'react'

interface NpsSurveyModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (score: number, comment: string) => void
}

export default function NpsSurveyModal({ isOpen, onClose, onSubmit }: NpsSurveyModalProps) {
  const [score, setScore] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (score === null || submitting) return
    setSubmitting(true)
    await onSubmit(score, comment)
    setSubmitting(false)
  }

  const getScoreColor = (n: number) => {
    if (n <= 6) return { bg: '#1a0a0a', border: '#7f1d1d', text: '#f87171', active: '#ef4444' }
    if (n <= 8) return { bg: '#1a1200', border: '#78350f', text: '#fbbf24', active: '#f59e0b' }
    return { bg: '#0a1a0a', border: '#14532d', text: '#86efac', active: '#22c55e' }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        style={{
          backgroundColor: '#111111',
          border: '1px solid #262626',
          borderRadius: '1rem',
          padding: '1.75rem',
          maxWidth: 480,
          width: '100%',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <p style={{ color: '#f59e0b', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>
              Quick Question
            </p>
            <h2 style={{ color: '#ffffff', fontWeight: 800, fontSize: '1rem', lineHeight: 1.4 }}>
              How likely are you to recommend First Guitar Solo to a friend?
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ color: '#525252', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', lineHeight: 1, marginLeft: 12, flexShrink: 0 }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Score labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ color: '#525252', fontSize: '0.65rem' }}>Not at all likely</span>
          <span style={{ color: '#525252', fontSize: '0.65rem' }}>Extremely likely</span>
        </div>

        {/* Score buttons */}
        <div style={{ display: 'flex', gap: 4, marginBottom: '1.25rem' }}>
          {Array.from({ length: 11 }, (_, i) => {
            const colors = getScoreColor(i)
            const isSelected = score === i
            return (
              <button
                key={i}
                onClick={() => setScore(i)}
                style={{
                  flex: 1,
                  padding: '0.5rem 0',
                  borderRadius: '0.375rem',
                  fontSize: '0.75rem',
                  fontWeight: isSelected ? 800 : 500,
                  backgroundColor: isSelected ? colors.active : colors.bg,
                  border: `1px solid ${isSelected ? colors.active : colors.border}`,
                  color: isSelected ? '#000' : colors.text,
                  cursor: 'pointer',
                  transition: 'all 0.1s ease',
                  minWidth: 0,
                }}
              >
                {i}
              </button>
            )
          })}
        </div>

        {/* Comment */}
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          <span style={{ color: '#a3a3a3', fontSize: '0.8rem', fontWeight: 600 }}>
            What&apos;s the main reason for your score?
          </span>
          <span style={{ color: '#525252', fontSize: '0.75rem' }}> (optional)</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us what you think..."
          rows={3}
          style={{
            backgroundColor: '#0a0a0a',
            border: '1px solid #262626',
            color: '#d4d4d4',
            borderRadius: '0.5rem',
            padding: '0.625rem 0.75rem',
            width: '100%',
            fontSize: '0.875rem',
            lineHeight: '1.6',
            resize: 'vertical',
            outline: 'none',
            marginBottom: '1rem',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#f59e0b' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = '#262626' }}
        />

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleSubmit}
            disabled={score === null || submitting}
            style={{
              flex: 1,
              backgroundColor: score !== null && !submitting ? '#f59e0b' : '#262626',
              color: score !== null && !submitting ? '#000' : '#525252',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              fontWeight: 800,
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              cursor: score !== null && !submitting ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s ease',
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 1rem',
              border: '1px solid #262626',
              borderRadius: '0.5rem',
              color: '#525252',
              background: 'none',
              cursor: 'pointer',
              fontSize: '0.8rem',
              transition: 'color 0.15s',
            }}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  )
}
