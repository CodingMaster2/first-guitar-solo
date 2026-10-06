'use client'

import { useState, useEffect } from 'react'

interface Announcement {
  id: string
  title: string
  message: string
  type: string
}

const typeStyles: Record<string, { bg: string; border: string; text: string; titleColor: string }> = {
  info: {
    bg: '#0f2035',
    border: '#1e4a7f',
    text: '#bfdbfe',
    titleColor: '#93c5fd',
  },
  warning: {
    bg: '#221800',
    border: '#7c4a00',
    text: '#fde68a',
    titleColor: '#fcd34d',
  },
  success: {
    bg: '#031a0d',
    border: '#14532d',
    text: '#bbf7d0',
    titleColor: '#86efac',
  },
}

export default function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    fetch('/api/admin/announcements?active=true')
      .then((r) => r.json())
      .then((data: { announcements?: Announcement[] }) => {
        if (data.announcements && data.announcements.length > 0) {
          const latest = data.announcements[0]
          // Check session storage for dismiss
          const key = `announcement-dismissed-${latest.id}`
          if (!sessionStorage.getItem(key)) {
            setAnnouncement(latest)
          }
        }
      })
      .catch(() => {/* silently fail */})
  }, [])

  function dismiss() {
    if (announcement) {
      sessionStorage.setItem(`announcement-dismissed-${announcement.id}`, '1')
    }
    setDismissed(true)
  }

  if (!announcement || dismissed) return null

  const styles = typeStyles[announcement.type] ?? typeStyles.info

  return (
    <div
      style={{
        backgroundColor: styles.bg,
        borderBottom: `1px solid ${styles.border}`,
        padding: '10px 16px',
      }}
      className="flex items-center justify-between gap-3"
      role="alert"
    >
      <div className="flex items-start gap-2 flex-1 min-w-0">
        <div className="flex-1 min-w-0">
          <span style={{ color: styles.titleColor }} className="text-xs font-bold mr-2">
            {announcement.title}
          </span>
          <span style={{ color: styles.text }} className="text-xs">
            {announcement.message}
          </span>
        </div>
      </div>
      <button
        onClick={dismiss}
        style={{ color: styles.text, flexShrink: 0 }}
        className="text-xs opacity-60 hover:opacity-100 transition-opacity px-1"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  )
}
