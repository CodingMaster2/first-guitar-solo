'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const SESSION_KEY = 'exit-intent-shown-v2'

export default function ExitIntentModal() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Guard: already shown this session
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return
    } catch {
      return
    }

    const fire = () => {
      try {
        if (sessionStorage.getItem(SESSION_KEY)) return
        sessionStorage.setItem(SESSION_KEY, '1')
      } catch {
        // sessionStorage unavailable — show once but don't persist
      }
      setVisible(true)
    }

    // Fire after 5 seconds OR on exit intent (whichever first)
    const timer = setTimeout(fire, 5000)

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5) {
        clearTimeout(timer)
        fire()
      }
    }
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={() => setVisible(false)}
    >
      <div
        style={{
          backgroundColor: '#111111',
          border: '2px solid #f59e0b',
          borderRadius: '1rem',
          padding: '2.5rem 2rem',
          maxWidth: 420,
          width: '100%',
          textAlign: 'center',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setVisible(false)}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            color: '#525252',
            background: 'none',
            border: 'none',
            fontSize: '1.375rem',
            cursor: 'pointer',
            lineHeight: 1,
            padding: '0.25rem',
          }}
        >
          &times;
        </button>

        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎸</div>

        <h3
          id="exit-modal-title"
          style={{
            color: '#ffffff',
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '1.75rem',
            letterSpacing: '0.05em',
            marginBottom: '0.75rem',
          }}
        >
          Before you go...
        </h3>

        <p
          style={{
            color: '#a3a3a3',
            fontSize: '0.9rem',
            lineHeight: 1.65,
            marginBottom: '1.75rem',
          }}
        >
          Use code{' '}
          <strong style={{ color: '#f59e0b', fontWeight: 900 }}>SOLO10</strong>{' '}
          at checkout for 10% off.
        </p>

        <Link
          href="/register"
          onClick={() => setVisible(false)}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#000000',
            fontWeight: 900,
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '0.9375rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          Claim Discount
        </Link>

        <button
          onClick={() => setVisible(false)}
          style={{
            color: '#525252',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.8rem',
            transition: 'color 0.2s',
          }}
        >
          No thanks
        </button>
      </div>
    </div>
  )
}
