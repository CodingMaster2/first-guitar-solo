'use client'

import { useState, useEffect, useCallback } from 'react'

interface Comment {
  id: string
  content: string
  likes: number
  createdAt: string
  user: {
    name: string | null
  }
}

interface LessonCommentsProps {
  day: number
  userId: string
}

export default function LessonComments({ day, userId }: LessonCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [liking, setLiking] = useState<string | null>(null)

  const fetchComments = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/lessons/${day}/comments`)
      if (res.ok) {
        const data = await res.json() as Comment[]
        setComments(data)
      }
    } catch {
      // silently ignore
    } finally {
      setLoading(false)
    }
  }, [day])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const handleSubmit = async () => {
    if (!text.trim() || submitting || !userId) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`/api/lessons/${day}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text.trim() }),
      })
      if (res.ok) {
        setText('')
        await fetchComments()
      } else {
        setError('Could not post comment. Please try again.')
      }
    } catch {
      setError('Could not post comment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLike = async (commentId: string) => {
    if (liking === commentId) return
    setLiking(commentId)
    try {
      const res = await fetch(`/api/lessons/${day}/comments`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: commentId }),
      })
      if (res.ok) {
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c))
        )
      }
    } catch {
      // silently ignore
    } finally {
      setLiking(null)
    }
  }

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return iso
    }
  }

  const displayName = (c: Comment) => c.user.name ?? 'Student'

  return (
    <section
      style={{
        backgroundColor: '#111111',
        border: '1px solid #262626',
        borderRadius: '0.75rem',
        padding: '1.25rem',
      }}
    >
      <h2 className="text-white text-xs font-bold uppercase tracking-widest mb-1">
        Student Notes
      </h2>
      <p style={{ color: '#525252', fontSize: '0.75rem', marginBottom: '1rem' }}>
        {loading
          ? 'Loading...'
          : `${comments.length} student${comments.length !== 1 ? 's' : ''} left notes on Day ${day}`}
      </p>

      {loading ? (
        <div style={{ color: '#525252' }} className="text-sm py-4 text-center">
          Loading comments...
        </div>
      ) : comments.length === 0 ? (
        <p style={{ color: '#525252' }} className="text-sm mb-4">
          Be the first to share what you found hard or helpful!
        </p>
      ) : (
        <div className="flex flex-col gap-3 mb-5">
          {comments.map((c) => (
            <div
              key={c.id}
              style={{
                backgroundColor: '#0a0a0a',
                border: '1px solid #1f1f1f',
                borderRadius: '0.5rem',
                padding: '0.75rem',
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  style={{
                    backgroundColor: '#1a0f00',
                    color: '#f59e0b',
                    borderRadius: '50%',
                    width: 28,
                    height: 28,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {displayName(c).charAt(0).toUpperCase()}
                </span>
                <span className="text-white text-xs font-bold">{displayName(c)}</span>
                <span style={{ color: '#404040' }} className="text-xs">
                  {formatDate(c.createdAt)}
                </span>
              </div>
              <p
                style={{ color: '#d4d4d4' }}
                className="text-sm leading-relaxed whitespace-pre-wrap mb-2"
              >
                {c.content}
              </p>
              <button
                onClick={() => handleLike(c.id)}
                disabled={liking === c.id}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #262626',
                  borderRadius: '0.375rem',
                  padding: '2px 8px',
                  color: '#737373',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'color 0.15s, border-color 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#f59e0b'
                  e.currentTarget.style.borderColor = '#f59e0b'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#737373'
                  e.currentTarget.style.borderColor = '#262626'
                }}
              >
                ♥ {c.likes}
              </button>
            </div>
          ))}
        </div>
      )}

      {userId ? (
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share a tip, ask a question, or describe what you found challenging..."
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
              marginBottom: '0.75rem',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#f59e0b'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#262626'
            }}
          />
          {error && (
            <p style={{ color: '#fca5a5' }} className="text-xs mb-2">
              {error}
            </p>
          )}
          <button
            onClick={handleSubmit}
            disabled={submitting || !text.trim()}
            style={{
              backgroundColor: text.trim() && !submitting ? '#f59e0b' : '#262626',
              color: text.trim() && !submitting ? '#000' : '#525252',
            }}
            className="px-5 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-colors disabled:cursor-not-allowed"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      ) : (
        <p style={{ color: '#525252' }} className="text-sm">
          <a href="/login" style={{ color: '#f59e0b' }} className="font-bold hover:underline">
            Sign in
          </a>{' '}
          to join the discussion and share your experience.
        </p>
      )}
    </section>
  )
}
