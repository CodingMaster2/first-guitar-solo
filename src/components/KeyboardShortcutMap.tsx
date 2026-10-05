'use client'

import { useState, useEffect, useCallback } from 'react'

const SHORTCUTS = [
  { key: '← / →', description: 'Previous / next lesson' },
  { key: '?', description: 'Show this help' },
  { key: 'Enter', description: 'Start / pause timer (when focus is not in a form)' },
  { key: 'Esc', description: 'Close modals' },
]

export default function KeyboardShortcutMap() {
  const [open, setOpen] = useState(false)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      const inForm = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON' || tag === 'SELECT'
      if (e.key === '?' && !inForm) {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <div
        style={{
          backgroundColor: '#111111',
          border: '1px solid #262626',
          borderRadius: '12px',
          padding: '24px',
          minWidth: '320px',
          maxWidth: '420px',
          width: '90vw',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-sm uppercase tracking-wider">Keyboard Shortcuts</h2>
          <button
            onClick={close}
            style={{ color: '#525252', lineHeight: 1 }}
            className="text-xl hover:text-white transition-colors"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <table className="w-full border-collapse">
          <tbody>
            {SHORTCUTS.map(({ key, description }) => (
              <tr key={key} style={{ borderBottom: '1px solid #1f1f1f' }}>
                <td className="py-2.5 pr-4" style={{ width: '40%', verticalAlign: 'top' }}>
                  <kbd
                    style={{
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                      color: '#f59e0b',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #2a2a2a',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {key}
                  </kbd>
                </td>
                <td className="py-2.5" style={{ color: '#a3a3a3', fontSize: '0.8rem', verticalAlign: 'top' }}>
                  {description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p style={{ color: '#404040', fontSize: '0.7rem' }} className="mt-4 text-center">
          Press <kbd style={{ color: '#f59e0b', fontFamily: 'monospace' }}>?</kbd> or <kbd style={{ color: '#f59e0b', fontFamily: 'monospace' }}>Esc</kbd> to close
        </p>
      </div>
    </div>
  )
}
