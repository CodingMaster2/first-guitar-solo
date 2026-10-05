'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export default function PracticeReminder() {
  const { data: session } = useSession()
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [reminderTime, setReminderTime] = useState('19:00')
  const [enabled, setEnabled] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!('Notification' in window)) return
    setPermission(Notification.permission)
    try {
      const saved = localStorage.getItem('practice-reminder')
      if (saved) {
        const { time, on } = JSON.parse(saved) as { time: string; on: boolean }
        setReminderTime(time)
        setEnabled(on)
      }
    } catch {}
  }, [])

  const requestAndEnable = async () => {
    if (!('Notification' in window)) return
    const perm = await Notification.requestPermission()
    setPermission(perm)
    if (perm === 'granted') {
      setEnabled(true)
      save(true, reminderTime)
    }
  }

  const save = (on: boolean, time: string) => {
    try {
      localStorage.setItem('practice-reminder', JSON.stringify({ time, on }))
    } catch {}
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)

    // Schedule next notification
    if (on && permission === 'granted') {
      scheduleNotification(time)
    }
  }

  const scheduleNotification = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    const now = new Date()
    const next = new Date()
    next.setHours(hours, minutes, 0, 0)
    if (next <= now) next.setDate(next.getDate() + 1)
    const msUntil = next.getTime() - now.getTime()
    setTimeout(() => {
      new Notification('First Guitar Solo — Time to Practice 🎸', {
        body: 'Your daily guitar practice is waiting. Keep the streak alive!',
        icon: '/icon-192.png',
      })
    }, msUntil)
  }

  if (!session?.user || session.user.purchaseStatus !== 'PAID') return null
  if (!('Notification' in window)) return null

  return (
    <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-5">
      <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-3">Practice Reminder</h3>
      {permission === 'denied' ? (
        <p style={{ color: '#525252' }} className="text-xs">
          Notifications blocked. Enable them in browser settings to use this feature.
        </p>
      ) : permission === 'default' ? (
        <div>
          <p style={{ color: '#a3a3a3' }} className="text-xs mb-3">
            Get a daily reminder to practice at a time you choose.
          </p>
          <button
            onClick={requestAndEnable}
            style={{ backgroundColor: '#f59e0b', color: '#000' }}
            className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Enable Reminders
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3 flex-wrap">
          <label style={{ color: '#a3a3a3' }} className="text-xs">Remind me at:</label>
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#ffffff' }}
            className="rounded px-2 py-1 text-xs focus:outline-none focus:border-amber-500"
          />
          <label style={{ color: '#a3a3a3' }} className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => { setEnabled(e.target.checked); save(e.target.checked, reminderTime) }}
              className="accent-amber-500"
            />
            Enabled
          </label>
          {enabled && (
            <button
              onClick={() => save(enabled, reminderTime)}
              style={{ color: saved ? '#86efac' : '#f59e0b' }}
              className="text-xs hover:opacity-80 transition-colors"
            >
              {saved ? '✓ Saved' : 'Save time'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
