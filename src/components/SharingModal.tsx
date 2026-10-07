'use client'

import { useState, useEffect } from 'react'

interface SharingModalProps {
  isOpen: boolean
  onClose: () => void
  day: number
  userName: string
  xp: number
  userId?: string
}

type Tab = 'twitter' | 'link' | 'instagram'

export default function SharingModal({
  isOpen,
  onClose,
  day,
  userName,
  xp,
  userId,
}: SharingModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('twitter')
  const [tweetText, setTweetText] = useState(() =>
    `Just completed Day ${day} of my 30-day guitar journey on @firstguitarsolo! 🎸 ${
      day === 30 ? 'I just played my first solo!' : `${30 - day} days to go!`
    } #guitar #learning`,
  )
  const [copied, setCopied] = useState(false)
  const [captionCopied, setCaptionCopied] = useState(false)

  const profileUrl = userId
    ? `https://firstguitarsolo.com/profile/${userId}`
    : 'https://firstguitarsolo.com'

  const instagramCaption = `Day ${day}/30 of my guitar journey! 🎸\n\nI'm learning my first guitar solo on @firstguitarsolo and I'm${
    day === 30 ? ' done!' : ` ${30 - day} days away!`
  } The progress is real 💪\n\n${
    day === 30 ? '🎓 Graduated! I played my first guitar solo!' : `${xp} XP earned so far`
  }\n\n#guitar #guitarlearning #firstguitarsolo #leadguitar #guitarjourney #practice`

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
    } catch {
      const el = document.createElement('textarea')
      el.value = profileUrl
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(instagramCaption)
    } catch {
      const el = document.createElement('textarea')
      el.value = instagramCaption
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCaptionCopied(true)
    setTimeout(() => setCaptionCopied(false), 2000)
  }

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    borderRadius: 6,
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    backgroundColor: active ? '#f59e0b' : 'transparent',
    color: active ? '#000000' : '#737373',
    transition: 'all 0.15s ease',
  })

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#111111',
          border: '1px solid #262626',
          borderRadius: 16,
          padding: 28,
          maxWidth: 480,
          width: '100%',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            color: '#525252',
            cursor: 'pointer',
            fontSize: '1.2rem',
            lineHeight: 1,
            padding: 4,
          }}
        >
          ✕
        </button>

        <h2
          style={{
            color: '#ffffff',
            fontSize: '1.1rem',
            fontWeight: 900,
            marginBottom: 4,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Share Your Progress
        </h2>
        <p style={{ color: '#525252', fontSize: '0.8rem', marginBottom: 20 }}>
          {userName} · Day {day} of 30 · {xp.toLocaleString()} XP
        </p>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            backgroundColor: '#0a0a0a',
            borderRadius: 8,
            padding: 4,
            marginBottom: 20,
          }}
        >
          <button style={tabStyle(activeTab === 'twitter')} onClick={() => setActiveTab('twitter')}>
            Twitter/X
          </button>
          <button style={tabStyle(activeTab === 'link')} onClick={() => setActiveTab('link')}>
            Copy Link
          </button>
          <button style={tabStyle(activeTab === 'instagram')} onClick={() => setActiveTab('instagram')}>
            Instagram
          </button>
        </div>

        {/* Twitter/X Tab */}
        {activeTab === 'twitter' && (
          <div>
            <label
              style={{
                color: '#737373',
                fontSize: '0.75rem',
                display: 'block',
                marginBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Edit your tweet
            </label>
            <textarea
              value={tweetText}
              onChange={(e) => setTweetText(e.target.value)}
              maxLength={280}
              rows={4}
              style={{
                width: '100%',
                backgroundColor: '#0a0a0a',
                border: '1px solid #1f1f1f',
                borderRadius: 8,
                padding: 12,
                color: '#ffffff',
                fontSize: '0.875rem',
                resize: 'vertical',
                fontFamily: 'inherit',
                lineHeight: 1.6,
                marginBottom: 8,
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  color: tweetText.length > 260 ? '#ef4444' : '#525252',
                  fontSize: '0.75rem',
                }}
              >
                {280 - tweetText.length} characters remaining
              </span>
              <a
                href={tweetUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  padding: '10px 20px',
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.763l7.633-8.722L2.25 2.25h6.07l4.188 5.539zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share on X →
              </a>
            </div>
          </div>
        )}

        {/* Copy Link Tab */}
        {activeTab === 'link' && (
          <div>
            <p style={{ color: '#a3a3a3', fontSize: '0.875rem', marginBottom: 16, lineHeight: 1.6 }}>
              Share your progress page with friends and fellow guitarists.
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: '#0a0a0a',
                border: '1px solid #1f1f1f',
                borderRadius: 8,
                padding: '8px 12px',
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  color: '#737373',
                  fontSize: '0.75rem',
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontFamily: '"Courier New", monospace',
                }}
              >
                {profileUrl}
              </span>
            </div>
            <button
              onClick={handleCopyLink}
              style={{
                width: '100%',
                backgroundColor: copied ? '#1a3300' : '#f59e0b',
                color: copied ? '#86efac' : '#000000',
                border: 'none',
                borderRadius: 8,
                padding: '10px 20px',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>
        )}

        {/* Instagram Caption Tab */}
        {activeTab === 'instagram' && (
          <div>
            <p
              style={{
                color: '#737373',
                fontSize: '0.75rem',
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Ready-to-post Instagram caption
            </p>
            <div
              style={{
                backgroundColor: '#0a0a0a',
                border: '1px solid #1f1f1f',
                borderRadius: 8,
                padding: 12,
                color: '#a3a3a3',
                fontSize: '0.875rem',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                marginBottom: 12,
                maxHeight: 180,
                overflowY: 'auto',
              }}
            >
              {instagramCaption}
            </div>
            <button
              onClick={handleCopyCaption}
              style={{
                width: '100%',
                backgroundColor: captionCopied ? '#1a3300' : '#f59e0b',
                color: captionCopied ? '#86efac' : '#000000',
                border: 'none',
                borderRadius: 8,
                padding: '10px 20px',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {captionCopied ? '✓ Copied!' : 'Copy Caption'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
