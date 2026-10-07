'use client'

import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallBanner() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check localStorage to not show again if dismissed
    try {
      if (localStorage.getItem('pwa-dismissed')) return
    } catch {
      // localStorage may be unavailable in some environments
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!prompt || dismissed) return null

  const install = async () => {
    await prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') {
      try {
        localStorage.setItem('pwa-installed', '1')
      } catch {
        // ignore
      }
    }
    setPrompt(null)
  }

  const dismiss = () => {
    try {
      localStorage.setItem('pwa-dismissed', '1')
    } catch {
      // ignore
    }
    setDismissed(true)
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 72,
        left: 16,
        right: 16,
        backgroundColor: '#111111',
        border: '1px solid #f59e0b',
        borderRadius: 12,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        zIndex: 50,
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      }}
    >
      <div>
        <p className="text-white text-sm font-bold">Add to Home Screen</p>
        <p style={{ color: '#737373', fontSize: '0.75rem' }}>
          Install First Guitar Solo for quick access
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={install}
          style={{
            backgroundColor: '#f59e0b',
            color: '#000',
            borderRadius: 8,
            padding: '6px 14px',
            fontSize: '0.8rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Install
        </button>
        <button
          onClick={dismiss}
          style={{
            color: '#525252',
            fontSize: '1.2rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            lineHeight: 1,
          }}
          aria-label="Dismiss install banner"
        >
          ×
        </button>
      </div>
    </div>
  )
}
