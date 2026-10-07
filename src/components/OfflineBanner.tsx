'use client'

import { useEffect, useState } from 'react'

export default function OfflineBanner() {
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    const on = () => setOffline(true)
    const off = () => setOffline(false)
    window.addEventListener('offline', on)
    window.addEventListener('online', off)
    return () => {
      window.removeEventListener('offline', on)
      window.removeEventListener('online', off)
    }
  }, [])

  if (!offline) return null

  return (
    <div className="offline-banner">
      You&apos;re offline — some features may be unavailable
    </div>
  )
}
