'use client'

import { useEffect } from 'react'

interface XPLevelUpProps {
  fromLevel: string
  toLevel: string
  onClose: () => void
}

export default function XPLevelUp({ fromLevel, toLevel, onClose }: XPLevelUpProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9998 }}
      className="fixed inset-0 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        style={{ backgroundColor: '#111111', border: '2px solid #f59e0b', maxWidth: 400, width: '100%' }}
        className="rounded-2xl p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ color: '#f59e0b', fontSize: '2.5rem' }} className="mb-3">&#9650;</div>

        <h2 className="text-white text-xl font-black uppercase tracking-wider mb-4">Level Up!</h2>

        <div className="flex items-center justify-center gap-4 mb-4">
          <div style={{ color: '#525252', border: '1px solid #262626', backgroundColor: '#1a1a1a' }}
            className="px-4 py-2 rounded-lg text-sm font-bold">
            {fromLevel}
          </div>
          <div style={{ color: '#f59e0b', fontSize: '1.25rem' }}>&#8594;</div>
          <div style={{ color: '#f59e0b', border: '1px solid #f59e0b', backgroundColor: '#1a0f00' }}
            className="px-4 py-2 rounded-lg text-sm font-black">
            {toLevel}
          </div>
        </div>

        <p style={{ color: '#a3a3a3' }} className="text-xs">Auto-closing in 3 seconds&hellip;</p>
      </div>
    </div>
  )
}
