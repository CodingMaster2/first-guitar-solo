'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminGrantButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const grant = async () => {
    setLoading(true)
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'grant-access' }),
      })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={grant}
      disabled={loading}
      style={{ color: '#86efac' }}
      className="text-xs hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? '...' : 'Grant'}
    </button>
  )
}
