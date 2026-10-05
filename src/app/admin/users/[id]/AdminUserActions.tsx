'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  userId: string
  isPaid: boolean
  streakFreezes: number
  isSelf: boolean
}

export default function AdminUserActions({ userId, isPaid, streakFreezes, isSelf }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const run = async (action: string, confirm?: string) => {
    if (confirm && !window.confirm(confirm)) return
    setLoading(action)
    setMsg(null)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: action === 'delete' ? 'DELETE' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        ...(action !== 'delete' ? { body: JSON.stringify({ action }) } : {}),
      })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (!res.ok) {
        setMsg({ type: 'err', text: data.error ?? 'Something went wrong' })
        return
      }
      if (action === 'delete') {
        router.push('/admin/users')
        return
      }
      setMsg({ type: 'ok', text: action === 'add-freeze' ? 'Streak freeze added' : action === 'grant-access' ? 'Access granted' : action === 'revoke-access' ? 'Access revoked' : action === 'reset-progress' ? 'Progress reset' : 'Done' })
      router.refresh()
    } catch {
      setMsg({ type: 'err', text: 'Network error' })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {isPaid ? (
          <Btn
            label="Revoke Access"
            active={loading === 'revoke-access'}
            bg="#3b0000"
            color="#fca5a5"
            border="#7f1d1d"
            onClick={() => run('revoke-access', 'Revoke this user\'s paid access?')}
          />
        ) : (
          <Btn
            label="Grant Access"
            active={loading === 'grant-access'}
            bg="#052e16"
            color="#86efac"
            border="#166534"
            onClick={() => run('grant-access')}
          />
        )}
        <Btn
          label={`Add Streak Freeze (${streakFreezes} now)`}
          active={loading === 'add-freeze'}
          bg="#0c1a3a"
          color="#93c5fd"
          border="#1e3a6e"
          onClick={() => run('add-freeze')}
        />
        <Btn
          label="Reset Progress"
          active={loading === 'reset-progress'}
          bg="#1a0800"
          color="#fdba74"
          border="#7c2d12"
          onClick={() => run('reset-progress', 'Reset ALL progress, XP, sessions, and achievements for this user? This cannot be undone.')}
        />
        {!isSelf && (
          <Btn
            label="Delete User"
            active={loading === 'delete'}
            bg="#1a0000"
            color="#fca5a5"
            border="#7f1d1d"
            onClick={() => run('delete', 'Permanently DELETE this user and all their data? This cannot be undone.')}
          />
        )}
      </div>
      {msg && (
        <p
          className="text-xs mt-3 font-medium"
          style={{ color: msg.type === 'ok' ? '#86efac' : '#fca5a5' }}
        >
          {msg.type === 'ok' ? '✓ ' : '✗ '}{msg.text}
        </p>
      )}
    </div>
  )
}

function Btn({ label, active, bg, color, border, onClick }: { label: string; active: boolean; bg: string; color: string; border: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={active}
      style={{ backgroundColor: bg, color, border: `1px solid ${border}`, opacity: active ? 0.6 : 1 }}
      className="text-xs font-bold px-4 py-2 rounded-lg transition-opacity disabled:cursor-not-allowed hover:opacity-90"
    >
      {active ? 'Working...' : label}
    </button>
  )
}
