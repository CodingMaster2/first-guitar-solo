'use client'
import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem('pwa-dismissed')) return
    } catch { }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!visible || !deferredPrompt) return null

  const install = async () => {
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setVisible(false)
  }

  const dismiss = () => {
    try { localStorage.setItem('pwa-dismissed', '1') } catch { }
    setVisible(false)
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#111111',
        borderTop: '1px solid #262626',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        zIndex: 60,
        boxShadow: '0 -4px 24px rgba(0,0,0,0.5)',
      }}
    >
      <p style={{ color: '#d4d4d4', fontSize: '0.875rem', margin: 0, flex: 1 }}>
        Add First Guitar Solo to your home screen for the best experience
      </p>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        <button
          onClick={install}
          style={{
            backgroundColor: '#f59e0b',
            color: '#000',
            fontWeight: 700,
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: '0.8rem',
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Install App
        </button>
        <button
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          style={{
            color: '#737373',
            fontSize: '1.25rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            lineHeight: 1,
            padding: '4px 6px',
          }}
        >
          ×
        </button>
      </div>
    </div>
  )
}
