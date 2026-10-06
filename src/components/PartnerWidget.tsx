'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface PartnerProfile {
  streak: number | null
  lastPracticeDate: string | null
  currentDay: number | null
}

interface PartnerUser {
  id: string
  name: string | null
  email: string
  profile: PartnerProfile | null
}

interface PartnerResponse {
  partner: PartnerUser | null
  partnershipId?: string
  connectedAt?: string
  pendingRequests?: unknown[]
}

function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null
  const ms = Date.now() - new Date(dateStr).getTime()
  return Math.floor(ms / 86400000)
}

export default function PartnerWidget() {
  const [data, setData] = useState<PartnerResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/partners')
      .then((r) => r.json() as Promise<PartnerResponse>)
      .then(setData)
      .catch(() => setData({ partner: null }))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-5 animate-pulse">
        <div style={{ backgroundColor: '#1f1f1f', height: 14, width: 160, borderRadius: 4 }} className="mb-2" />
        <div style={{ backgroundColor: '#1f1f1f', height: 12, width: 120, borderRadius: 4 }} />
      </div>
    )
  }

  if (!data?.partner) {
    return (
      <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-5">
        <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Accountability Partner</h3>
        <p style={{ color: '#737373' }} className="text-xs mb-4 leading-relaxed">
          Students with partners practice 3x more. Get matched with someone at your level.
        </p>
        <Link
          href="/partners"
          style={{ backgroundColor: '#f59e0b', color: '#000' }}
          className="inline-block px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all"
        >
          Find an Accountability Partner
        </Link>
      </div>
    )
  }

  const partner = data.partner
  const profile = partner.profile
  const streak = profile?.streak ?? 0
  const lastActive = daysSince(profile?.lastPracticeDate ?? null)
  const displayName = partner.name ?? partner.email.split('@')[0]
  const initial = displayName[0]?.toUpperCase() ?? '?'

  let activityColor = '#86efac'
  if (lastActive === null || lastActive > 2) activityColor = '#ef4444'
  else if (lastActive > 0) activityColor = '#f59e0b'

  const lastActiveText = lastActive === null
    ? 'Never practiced'
    : lastActive === 0
      ? 'Active today'
      : `${lastActive} day${lastActive === 1 ? '' : 's'} ago`

  return (
    <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-5">
      <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Your Partner</h3>
      <div className="flex items-center gap-3 mb-4">
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: '#1f1f1f',
            border: '2px solid #f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f59e0b',
            fontWeight: 700,
            fontSize: 16,
            flexShrink: 0,
          }}
        >
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm truncate">{displayName}</p>
          <p style={{ color: activityColor }} className="text-xs">{lastActiveText}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p style={{ color: '#f59e0b' }} className="text-lg font-black leading-none">
            🔥 {streak}
          </p>
          <p style={{ color: '#525252' }} className="text-xs">streak</p>
        </div>
      </div>
      <Link
        href="/partners"
        style={{ color: '#f59e0b', fontSize: 12 }}
        className="hover:underline font-medium"
      >
        View Partner Page →
      </Link>
    </div>
  )
}
