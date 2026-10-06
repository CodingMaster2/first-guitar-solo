'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PartnerInfo {
  id: string
  name: string | null
  email: string
  streak: number
  lastPracticeDate: string | null
  currentDay: number
  connectedAt: string | null
}

interface PendingRequest {
  id: string
  userId: string
  name: string | null
  email: string
}

interface Props {
  hasPartner: boolean
  partner: PartnerInfo | null
  partnershipId: string | null
  pendingRequests: PendingRequest[]
}

function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null
  const ms = Date.now() - new Date(dateStr).getTime()
  return Math.floor(ms / 86400000)
}

export default function PartnerPageClient({ hasPartner, partner, partnershipId, pendingRequests }: Props) {
  const router = useRouter()
  const [matching, setMatching] = useState(false)
  const [matchResult, setMatchResult] = useState<'matched' | 'pending' | 'error' | null>(null)
  const [disconnecting, setDisconnecting] = useState(false)

  const findPartner = async () => {
    setMatching(true)
    setMatchResult(null)
    try {
      const res = await fetch('/api/partners/match', { method: 'POST' })
      const data = await res.json() as { matched?: boolean; pending?: boolean; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      if (data.matched) {
        setMatchResult('matched')
        setTimeout(() => router.refresh(), 1500)
      } else if (data.pending) {
        setMatchResult('pending')
      }
    } catch {
      setMatchResult('error')
    } finally {
      setMatching(false)
    }
  }

  const disconnect = async () => {
    if (!partnershipId) return
    setDisconnecting(true)
    try {
      await fetch(`/api/partners/${partnershipId}`, { method: 'DELETE' })
      router.refresh()
    } catch {
      // ignore
    } finally {
      setDisconnecting(false)
    }
  }

  // Partner connected view
  if (hasPartner && partner) {
    const lastActive = daysSince(partner.lastPracticeDate)
    const displayName = partner.name ?? partner.email.split('@')[0]
    const initial = displayName[0]?.toUpperCase() ?? '?'

    let activityColor = '#86efac'
    let activityLabel = 'Active today'
    if (lastActive === null) { activityColor = '#737373'; activityLabel = 'Never practiced' }
    else if (lastActive > 2) { activityColor = '#ef4444'; activityLabel = `${lastActive} days ago` }
    else if (lastActive > 0) { activityColor = '#f59e0b'; activityLabel = `${lastActive} day${lastActive === 1 ? '' : 's'} ago` }

    const connectedDate = partner.connectedAt
      ? new Date(partner.connectedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : null

    return (
      <div className="space-y-5">
        {/* Partner card */}
        <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6">
          <p style={{ color: '#737373' }} className="text-xs uppercase tracking-wider mb-4">Your Practice Partner</p>
          <div className="flex items-center gap-4 mb-5">
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: '#1f1f1f',
                border: '2px solid #f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f59e0b',
                fontWeight: 700,
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              {initial}
            </div>
            <div>
              <p className="text-white font-bold text-lg">{displayName}</p>
              <p style={{ color: activityColor }} className="text-sm">
                Last active: {activityLabel}
              </p>
              {connectedDate && (
                <p style={{ color: '#525252' }} className="text-xs mt-0.5">
                  Partners since {connectedDate}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div style={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a' }} className="rounded-lg p-3 text-center">
              <p style={{ color: '#f59e0b' }} className="text-2xl font-black">🔥 {partner.streak}</p>
              <p style={{ color: '#525252' }} className="text-xs mt-1">Day Streak</p>
            </div>
            <div style={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a' }} className="rounded-lg p-3 text-center">
              <p style={{ color: '#f59e0b' }} className="text-2xl font-black">Day {partner.currentDay}</p>
              <p style={{ color: '#525252' }} className="text-xs mt-1">Current Lesson</p>
            </div>
          </div>

          {/* Encouragement */}
          <div style={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a' }} className="rounded-lg p-3 mb-5">
            <p style={{ color: '#a3a3a3' }} className="text-xs leading-relaxed">
              {lastActive === 0
                ? `${displayName} practiced today. Keep the momentum going — practice together!`
                : lastActive !== null && lastActive <= 2
                  ? `${displayName} practiced recently. Don't let them get ahead — open today's lesson.`
                  : `${displayName} hasn't practiced in a while. Be the one to restart the chain — they'll follow.`}
            </p>
          </div>

          <button
            onClick={disconnect}
            disabled={disconnecting}
            style={{ color: '#737373', fontSize: 12, border: '1px solid #262626', borderRadius: 8, padding: '6px 14px' }}
            className="hover:text-white hover:border-white transition-colors disabled:opacity-50"
          >
            {disconnecting ? 'Disconnecting...' : 'Disconnect Partner'}
          </button>
        </div>

        {/* Motivational copy */}
        <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-5">
          <p style={{ color: '#737373' }} className="text-xs leading-relaxed">
            Research on habit formation shows that social accountability increases follow-through by up to 3x. Knowing someone else sees your practice streak makes you far more likely to maintain it. That is why this feature exists.
          </p>
        </div>
      </div>
    )
  }

  // No partner view
  return (
    <div className="space-y-5">
      {/* Explanation card */}
      <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6">
        <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-3">How It Works</h2>
        <div className="space-y-3 mb-6">
          {[
            { num: 1, text: 'Click "Find My Partner" and we match you with a student at a similar level.' },
            { num: 2, text: "You'll each see the other's practice streak and last active date on your dashboards." },
            { num: 3, text: 'Knowing someone else is watching makes you 3x more likely to practice every day.' },
          ].map((step) => (
            <div key={step.num} className="flex gap-3 items-start">
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  backgroundColor: '#1f1f1f',
                  border: '1px solid #f59e0b',
                  color: '#f59e0b',
                  fontSize: 11,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {step.num}
              </div>
              <p style={{ color: '#a3a3a3' }} className="text-sm">{step.text}</p>
            </div>
          ))}
        </div>

        {matchResult === 'matched' && (
          <div style={{ backgroundColor: '#052e16', border: '1px solid #166534', borderRadius: 8 }} className="px-4 py-3 mb-4">
            <p style={{ color: '#86efac' }} className="text-sm font-bold">Partner matched! Refreshing...</p>
          </div>
        )}
        {matchResult === 'pending' && (
          <div style={{ backgroundColor: '#1a1200', border: '1px solid #78350f', borderRadius: 8 }} className="px-4 py-3 mb-4">
            <p style={{ color: '#fde68a' }} className="text-sm">
              No match found right now. We have recorded your request — you will be matched automatically when a compatible student signs up.
            </p>
          </div>
        )}
        {matchResult === 'error' && (
          <div style={{ backgroundColor: '#1a0000', border: '1px solid #7f1d1d', borderRadius: 8 }} className="px-4 py-3 mb-4">
            <p style={{ color: '#ef4444' }} className="text-sm">Something went wrong. Please try again.</p>
          </div>
        )}

        <button
          onClick={findPartner}
          disabled={matching || matchResult === 'pending'}
          style={{ backgroundColor: '#f59e0b', color: '#000' }}
          className="px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {matching ? 'Searching...' : matchResult === 'pending' ? 'Request Sent' : 'Find My Partner'}
        </button>
      </div>

      {/* Pending requests sent to me */}
      {pendingRequests.length > 0 && (
        <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-5">
          <h2 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Partner Requests</h2>
          <div className="space-y-2">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                style={{ backgroundColor: '#1a1200', border: '1px solid #78350f', borderRadius: 8 }}
                className="px-4 py-3"
              >
                <p style={{ color: '#fde68a' }} className="text-sm">
                  {req.name ?? req.email} wants to be your accountability partner.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
