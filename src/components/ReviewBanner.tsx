'use client'

import { useState } from 'react'

interface ReviewBannerProps {
  day: number
  nextReviewAt: Date | string | null
}

export default function ReviewBanner({ day, nextReviewAt }: ReviewBannerProps) {
  const [submitted, setSubmitted] = useState(false)
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [loading, setLoading] = useState(false)
  const [xpEarned, setXpEarned] = useState<number | null>(null)

  const isDue =
    nextReviewAt != null && new Date(nextReviewAt).getTime() <= Date.now()

  if (!isDue) return null

  const handleRate = async (quality: number) => {
    setRating(quality)
    setLoading(true)
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day, quality }),
      })
      const data = await res.json() as { xpEarned?: number }
      setXpEarned(data.xpEarned ?? 10)
      setSubmitted(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div
        style={{
          background: 'linear-gradient(135deg, #052e16 0%, #022c22 100%)',
          border: '1px solid #166534',
        }}
        className="rounded-xl p-4 mb-6 flex items-center gap-3"
      >
        <span style={{ color: '#22c55e', fontSize: '1.5rem' }}>&#10003;</span>
        <div>
          <p className="text-white font-bold text-sm">Review logged!</p>
          <p style={{ color: '#a3a3a3' }} className="text-xs">
            {xpEarned != null ? `+${xpEarned} XP earned. ` : ''}
            Your next review date has been updated.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1a0f00 0%, #0f0800 100%)',
        border: '1px solid #92400e',
      }}
      className="rounded-xl p-4 mb-6"
    >
      <div className="flex items-start gap-3">
        <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>&#128214;</span>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">
            This lesson is due for a review!
          </p>
          <p style={{ color: '#a3a3a3' }} className="text-xs mt-0.5 mb-3">
            After reviewing, rate your recall below to update your schedule.
          </p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                disabled={loading}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => handleRate(star)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1.5rem',
                  lineHeight: 1,
                  color:
                    star <= (hovered || rating)
                      ? '#f59e0b'
                      : '#404040',
                  transition: 'color 0.1s',
                  padding: '2px 4px',
                }}
              >
                &#9733;
              </button>
            ))}
            <span style={{ color: '#525252', fontSize: '0.7rem', marginLeft: 6 }}>
              {hovered === 1 ? 'Forgot it'
                : hovered === 2 ? 'Hard'
                : hovered === 3 ? 'OK'
                : hovered === 4 ? 'Good'
                : hovered === 5 ? 'Perfect'
                : 'Rate your recall'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
