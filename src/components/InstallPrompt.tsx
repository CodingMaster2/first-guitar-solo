'use client'

import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem('hasSeenInstallPrompt')) return
    } catch {
      // localStorage blocked (private mode etc.) — don't show
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    dismiss()
  }

  const dismiss = () => {
    setShow(false)
    setDeferredPrompt(null)
    try {
      localStorage.setItem('hasSeenInstallPrompt', '1')
    } catch {}
  }

  if (!show) return null

  return (
    <div
      role="banner"
      aria-label="Add to home screen prompt"
      style={{
        backgroundColor: '#1a0f00',
        borderBottom: '1px solid rgba(245,158,11,0.4)',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
        zIndex: 55,
      }}
    >
      <span style={{ color: '#fde68a', fontSize: '0.85rem', flex: 1, minWidth: 200 }}>
        📱 Add First Guitar Solo to your home screen for offline access
      </span>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button
          onClick={handleInstall}
          aria-label="Install app"
          style={{
            backgroundColor: '#f59e0b',
            color: '#000',
            border: 'none',
            borderRadius: 6,
            padding: '6px 16px',
            fontSize: '0.8rem',
            fontWeight: 900,
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Install
        </button>
        <button
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          style={{
            backgroundColor: 'transparent',
            color: '#a3a3a3',
            border: '1px solid #262626',
            borderRadius: 6,
            padding: '6px 12px',
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
        >
          Not now
        </button>
      </div>
    </div>
  )
}
