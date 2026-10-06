'use client'

import { useEffect } from 'react'
import React from 'react'

interface Props {
  children: React.ReactNode
  enabled: boolean
  onExit: () => void
}

export default function FocusModeWrapper({ children, enabled, onExit }: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && enabled) onExit()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [enabled, onExit])

  useEffect(() => {
    if (enabled) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [enabled])

  if (!enabled) return <>{children}</>

  return (
    <>
      <style>{`
        @keyframes focusFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#0a0a0a',
          zIndex: 50,
          overflowY: 'auto',
          animation: 'focusFadeIn 0.2s ease',
        }}
      >
        <button
          onClick={onExit}
          style={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 60,
            backgroundColor: '#1a1a1a',
            border: '1px solid #262626',
            color: '#a3a3a3',
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: '0.875rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Exit Focus Mode (ESC)
        </button>
        <div style={{ maxWidth: 896, margin: '0 auto', padding: '64px 16px 32px' }}>
          {children}
        </div>
      </div>
    </>
  )
}
