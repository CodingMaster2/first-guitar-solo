'use client'

import { useEffect, useState } from 'react'

interface Shortcut {
  keys: string
  action: string
}

const SHORTCUTS: Shortcut[] = [
  { keys: 'Cmd / Ctrl + K', action: 'Open command palette' },
  { keys: '?', action: 'Show keyboard shortcuts' },
  { keys: 'Esc', action: 'Close overlay' },
  { keys: 'J / K', action: '(on /lessons) Next / previous lesson' },
]

export default function KeyboardShortcutsOverlay() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !open) {
        const tag = (e.target as HTMLElement).tagName.toLowerCase()
        if (tag !== 'input' && tag !== 'textarea' && tag !== 'select') {
          e.preventDefault()
          setOpen(true)
          return
        }
      }
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setOpen(false)
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      <div
        style={{
          backgroundColor: '#111111',
          border: '1px solid #1f1f1f',
          borderRadius: 16,
          width: '100%',
          maxWidth: 480,
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #1f1f1f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '1.25rem',
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: '0.05em',
              color: '#f59e0b',
            }}
          >
            Keyboard Shortcuts
          </h2>
          <button
            onClick={() => setOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#525252',
              fontSize: '1.4rem',
              cursor: 'pointer',
              lineHeight: 1,
              padding: 4,
            }}
            aria-label="Close keyboard shortcuts"
          >
            ×
          </button>
        </div>

        {/* Shortcuts table */}
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  padding: '10px 20px',
                  textAlign: 'left',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#525252',
                  borderBottom: '1px solid #1f1f1f',
                }}
              >
                Keys
              </th>
              <th
                style={{
                  padding: '10px 20px',
                  textAlign: 'left',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#525252',
                  borderBottom: '1px solid #1f1f1f',
                }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {SHORTCUTS.map((s, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: i < SHORTCUTS.length - 1 ? '1px solid #1a1a1a' : 'none',
                }}
              >
                <td style={{ padding: '12px 20px', whiteSpace: 'nowrap' }}>
                  <kbd
                    style={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #262626',
                      borderRadius: 6,
                      padding: '3px 8px',
                      fontSize: '0.78rem',
                      fontFamily: 'monospace',
                      color: '#f59e0b',
                      fontWeight: 600,
                    }}
                  >
                    {s.keys}
                  </kbd>
                </td>
                <td
                  style={{
                    padding: '12px 20px',
                    fontSize: '0.875rem',
                    color: '#a3a3a3',
                  }}
                >
                  {s.action}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer hint */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid #1f1f1f',
            textAlign: 'center',
          }}
        >
          <span style={{ color: '#525252', fontSize: '0.7rem', fontFamily: 'monospace' }}>
            Press <strong style={{ color: '#737373' }}>Esc</strong> to close
          </span>
        </div>
      </div>
    </div>
  )
}
