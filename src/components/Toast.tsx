'use client'

import { useEffect, useState } from 'react'

export interface ToastMessage { id: string; message: string; type?: 'success' | 'error' | 'info' }

let _setToasts: React.Dispatch<React.SetStateAction<ToastMessage[]>> | null = null

export function showToast(message: string, type: ToastMessage['type'] = 'success') {
  if (_setToasts) {
    const id = Math.random().toString(36).slice(2)
    _setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      _setToasts?.(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    _setToasts = setToasts
    return () => { _setToasts = null }
  }, [])

  if (toasts.length === 0) return null

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320 }}>
      <style>{`
        @keyframes toastSlide { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
        @keyframes toastFade { to { opacity: 0; transform: translateX(110%); } }
      `}</style>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            backgroundColor: toast.type === 'error' ? '#1a0000' : toast.type === 'info' ? '#0c1a3a' : '#052e16',
            border: `1px solid ${toast.type === 'error' ? '#7f1d1d' : toast.type === 'info' ? '#1e3a6e' : '#166534'}`,
            color: toast.type === 'error' ? '#fca5a5' : toast.type === 'info' ? '#93c5fd' : '#86efac',
            padding: '12px 16px',
            borderRadius: 10,
            fontSize: '0.875rem',
            fontWeight: 500,
            boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            animation: 'toastSlide 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span style={{ fontSize: '1rem' }}>
            {toast.type === 'error' ? '✗' : toast.type === 'info' ? 'ℹ' : '✓'}
          </span>
          {toast.message}
          <button
            onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            style={{ marginLeft: 'auto', color: 'inherit', opacity: 0.6, fontSize: '1rem', background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', lineHeight: 1 }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
