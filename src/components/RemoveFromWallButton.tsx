'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface RemoveFromWallButtonProps {
  profileId: string
}

export default function RemoveFromWallButton({ profileId }: RemoveFromWallButtonProps) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()

  const handleRemove = async () => {
    if (!confirm('Remove this graduate from the public wall?')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/graduates/${profileId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove-from-wall' }),
      })
      if (res.ok) {
        setDone(true)
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return <span style={{ color: '#525252', fontSize: '0.7rem' }}>Removed</span>
  }

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      style={{
        backgroundColor: 'transparent',
        border: '1px solid #ef444440',
        color: '#ef4444',
        borderRadius: 4,
        padding: '2px 8px',
        fontSize: '0.7rem',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.5 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      {loading ? '…' : 'Remove'}
    </button>
  )
}
