'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const FAQ_PAIRS = [
  {
    q: 'How long does it take each day?',
    a: 'Lessons are 15-30 minutes. Consistent daily practice works better than long weekend sessions.',
  },
  {
    q: 'Do I need any experience?',
    a: 'Zero experience needed. We start from the very basics — how to hold the pick, how to read tabs.',
  },
  {
    q: 'What if I miss a day?',
    a: "Use your streak freeze! You get 1 free. Missing a day won't delete your progress.",
  },
  {
    q: 'What kind of guitar do I need?',
    a: 'Any electric guitar. Acoustic works but some techniques are harder.',
  },
  {
    q: 'Is this a subscription?',
    a: 'No — one payment of $25, lifetime access.',
  },
  {
    q: 'What happens after 30 days?',
    a: "You'll have your first real guitar solo down. Many students start their own songs from here.",
  },
  {
    q: 'Can I get a refund?',
    a: "30-day money-back guarantee. Email us and we'll refund immediately.",
  },
  {
    q: 'Is there an app?',
    a: 'Mobile-optimized web app. Works great on iOS and Android.',
  },
]

export default function FAQChatbot() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [activeQ, setActiveQ] = useState<number | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const filtered = FAQ_PAIRS.filter(
    (p) =>
      search === '' ||
      p.q.toLowerCase().includes(search.toLowerCase()) ||
      p.a.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    if (!open) return
    const handle = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open FAQ chatbot"
        aria-expanded={open}
        style={{
          position: 'fixed',
          bottom: '5rem',
          right: '1.5rem',
          zIndex: 60,
          backgroundColor: '#f59e0b',
          color: '#000',
          border: 'none',
          borderRadius: '9999px',
          padding: '12px 18px',
          fontWeight: 900,
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(245,158,11,0.4)',
          transition: 'opacity 0.2s ease',
        }}
      >
        <svg width="14" height="18" viewBox="0 0 60 72" fill="#000" aria-hidden="true">
          <path d="M30 0 C50 0 60 12 60 24 C60 48 30 72 30 72 C30 72 0 48 0 24 C0 12 10 0 30 0Z"/>
        </svg>
        FAQ
      </button>

      {/* Slide-up panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="FAQ Chatbot"
        aria-modal="true"
        aria-hidden={!open}
        style={{
          position: 'fixed',
          bottom: '8.5rem',
          right: '1.5rem',
          zIndex: 61,
          width: 340,
          maxWidth: 'calc(100vw - 3rem)',
          maxHeight: 480,
          backgroundColor: '#111111',
          border: '1px solid #262626',
          borderRadius: 16,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.7)',
          transform: open ? 'translateY(0)' : 'translateY(calc(100% + 4rem))',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'transform 0.3s ease, opacity 0.3s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: '#1a1a1a',
            borderBottom: '1px solid #262626',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <p
              style={{
                color: '#f59e0b',
                fontSize: '0.75rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                margin: 0,
              }}
            >
              Quick Answers
            </p>
            <p style={{ color: '#a3a3a3', fontSize: '0.7rem', margin: 0 }}>
              Click a question to see the answer
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close FAQ panel"
            style={{
              color: '#525252',
              background: 'none',
              border: 'none',
              fontSize: 22,
              cursor: 'pointer',
              lineHeight: 1,
              padding: '0 4px',
            }}
          >
            &times;
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '10px 12px', borderBottom: '1px solid #1a1a1a' }}>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setActiveQ(null)
            }}
            placeholder="Search questions..."
            aria-label="Search FAQ questions"
            style={{
              width: '100%',
              backgroundColor: '#0a0a0a',
              border: '1px solid #262626',
              borderRadius: 8,
              padding: '6px 10px',
              color: '#ffffff',
              fontSize: '0.8rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Q&A list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
          {filtered.length === 0 ? (
            <p
              style={{
                color: '#525252',
                fontSize: '0.8rem',
                padding: '16px',
                textAlign: 'center',
              }}
            >
              No matching questions found.
            </p>
          ) : (
            filtered.map((pair) => {
              const idx = FAQ_PAIRS.indexOf(pair)
              return (
                <div key={idx}>
                  <button
                    onClick={() => setActiveQ(activeQ === idx ? null : idx)}
                    aria-expanded={activeQ === idx}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      background: activeQ === idx ? '#0d0d0d' : 'none',
                      border: 'none',
                      borderBottom: '1px solid #1a1a1a',
                      padding: '10px 16px',
                      cursor: 'pointer',
                      color: activeQ === idx ? '#f59e0b' : '#d4d4d4',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 8,
                      transition: 'background 0.15s ease, color 0.15s ease',
                    }}
                  >
                    <span style={{ flex: 1 }}>{pair.q}</span>
                    <span
                      style={{ color: '#f59e0b', fontSize: 16, flexShrink: 0, marginTop: 1 }}
                    >
                      {activeQ === idx ? '−' : '+'}
                    </span>
                  </button>
                  {activeQ === idx && (
                    <div
                      style={{
                        padding: '8px 16px 12px',
                        backgroundColor: '#0d0d0d',
                        borderBottom: '1px solid #1a1a1a',
                      }}
                    >
                      <p
                        style={{
                          color: '#a3a3a3',
                          fontSize: '0.8rem',
                          lineHeight: 1.65,
                          margin: 0,
                        }}
                      >
                        {pair.a}
                      </p>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: '1px solid #1a1a1a',
            padding: '10px 16px',
            backgroundColor: '#0d0d0d',
          }}
        >
          <Link
            href="/support"
            style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 700 }}
          >
            Need more help? Contact us &rarr;
          </Link>
        </div>
      </div>
    </>
  )
}
