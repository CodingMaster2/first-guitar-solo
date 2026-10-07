'use client'

import { useState } from 'react'
import Link from 'next/link'
import AdminGrantButton from '@/components/AdminGrantButton'

interface UserRow {
  id: string
  email: string
  name: string | null
  createdAt: string
  purchaseStatus: string
  role: string
  profile: { currentDay: number; lastPracticeDate: string | null; streak: number; totalXP: number; bestStreak: number } | null
  completedCount: number
}

interface Props {
  users: UserRow[]
}

export default function BatchUsersTable({ users }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkLoading, setBulkLoading] = useState(false)
  const [bulkMsg, setBulkMsg] = useState('')

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (selected.size === users.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(users.map((u) => u.id)))
    }
  }

  async function bulkAction(action: 'grant-access' | 'revoke-access') {
    const ids = Array.from(selected)
    if (ids.length === 0) return
    setBulkLoading(true)
    setBulkMsg('')
    const res = await fetch('/api/admin/users/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids, action }),
    })
    if (res.ok) {
      const d = await res.json() as { affected: number }
      setBulkMsg(`Done: ${d.affected} users updated`)
      setSelected(new Set())
      // Reload after a moment
      setTimeout(() => { window.location.reload() }, 800)
    } else {
      setBulkMsg('Failed')
    }
    setBulkLoading(false)
  }

  function exportSelected() {
    const ids = Array.from(selected)
    if (ids.length === 0) return
    const selectedUsers = users.filter((u) => ids.includes(u.id))
    const header = 'id,email,name,purchaseStatus,currentDay,totalXP,streak\n'
    const rows = selectedUsers.map((u) =>
      [u.id, u.email, u.name ?? '', u.purchaseStatus, u.profile?.currentDay ?? '', u.profile?.totalXP ?? '', u.profile?.streak ?? ''].join(',')
    )
    const csv = header + rows.join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'selected-users.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* Bulk actions bar */}
      {selected.size > 0 && (
        <div
          style={{ backgroundColor: '#1a1200', border: '1px solid #d97706' }}
          className="rounded-xl p-3 mb-3 flex items-center gap-3 flex-wrap"
        >
          <span style={{ color: '#fbbf24' }} className="text-xs font-bold">{selected.size} selected</span>
          <button
            disabled={bulkLoading}
            onClick={() => { void bulkAction('grant-access') }}
            style={{ backgroundColor: '#052e16', border: '1px solid #166534', color: '#86efac' }}
            className="text-xs px-3 py-1.5 rounded font-medium disabled:opacity-50 hover:opacity-80 transition-opacity"
          >
            Grant all selected
          </button>
          <button
            disabled={bulkLoading}
            onClick={() => { void bulkAction('revoke-access') }}
            style={{ backgroundColor: '#450a0a', border: '1px solid #7f1d1d', color: '#fca5a5' }}
            className="text-xs px-3 py-1.5 rounded font-medium disabled:opacity-50 hover:opacity-80 transition-opacity"
          >
            Revoke all selected
          </button>
          <button
            onClick={exportSelected}
            style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#a3a3a3' }}
            className="text-xs px-3 py-1.5 rounded font-medium hover:text-white transition-colors"
          >
            Export selected CSV
          </button>
          <button
            onClick={() => setSelected(new Set())}
            style={{ color: '#737373' }}
            className="text-xs hover:text-white transition-colors ml-auto"
          >
            Clear
          </button>
          {bulkMsg && <p style={{ color: '#86efac' }} className="text-xs">{bulkMsg}</p>}
        </div>
      )}

      {users.length === 0 ? (
        <div
          className="rounded-xl p-12 text-center"
          style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }}
        >
          <p className="text-white font-bold mb-1">No users found</p>
          <p style={{ color: '#525252' }} className="text-sm">Try adjusting your filters or search term.</p>
        </div>
      ) : (
      <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #1f1f1f', backgroundColor: '#0d0d0d' }}>
                <th className="px-4 py-3 w-8">
                  <input
                    type="checkbox"
                    checked={users.length > 0 && selected.size === users.length}
                    onChange={toggleAll}
                    className="accent-amber-500"
                  />
                </th>
                {['User', 'Status', 'Progress', 'XP', 'Streak', 'Last Active', 'Actions'].map((h) => (
                  <th key={h} style={{ color: '#525252' }} className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const pct = Math.round((user.completedCount / 30) * 100)
                const daysSinceActive = user.profile?.lastPracticeDate
                  ? Math.floor((Date.now() - new Date(user.profile.lastPracticeDate).getTime()) / 86400000)
                  : null
                const isSelected = selected.has(user.id)
                return (
                  <tr
                    key={user.id}
                    title={`${user.email} · Day ${user.profile?.currentDay ?? 1} · ${user.purchaseStatus}`}
                    style={{
                      borderBottom: '1px solid #161616',
                      backgroundColor: isSelected ? '#1a1200' : 'transparent',
                    }}
                    className="hover:bg-neutral-900 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOne(user.id)}
                        className="accent-amber-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/users/${user.id}`} className="hover:underline">
                        <p className="text-white text-xs font-medium">{user.email}</p>
                        <p style={{ color: '#525252' }} className="text-xs">{user.name ?? '—'} · {new Date(user.createdAt).toLocaleDateString()}</p>
                        {user.role === 'ADMIN' && <span style={{ color: '#f59e0b' }} className="text-xs font-bold">ADMIN</span>}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        style={{
                          backgroundColor: user.purchaseStatus === 'PAID' ? '#052e16' : '#1a1a1a',
                          color: user.purchaseStatus === 'PAID' ? '#86efac' : '#525252',
                          border: `1px solid ${user.purchaseStatus === 'PAID' ? '#166534' : '#262626'}`,
                        }}
                        className="text-xs px-2 py-0.5 rounded"
                      >
                        {user.purchaseStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div style={{ backgroundColor: '#1a1a1a', width: '60px', height: '4px', borderRadius: '9999px' }}>
                          <div style={{ backgroundColor: '#f59e0b', width: `${pct}%`, height: '4px', borderRadius: '9999px' }} />
                        </div>
                        <span style={{ color: '#737373' }} className="text-xs">{user.completedCount}/30</span>
                      </div>
                      <p style={{ color: '#404040' }} className="text-xs mt-0.5">Day {user.profile?.currentDay ?? 1}</p>
                    </td>
                    <td style={{ color: '#f59e0b' }} className="px-4 py-3 text-xs font-bold">
                      {user.profile?.totalXP ?? 0}
                    </td>
                    <td style={{ color: '#a3a3a3' }} className="px-4 py-3 text-xs">
                      {user.profile?.streak ?? 0}d
                      {(user.profile?.bestStreak ?? 0) > 0 && (
                        <span style={{ color: '#525252' }} className="block text-xs">best: {user.profile?.bestStreak}d</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {daysSinceActive === null ? (
                        <span style={{ color: '#404040' }}>Never</span>
                      ) : daysSinceActive === 0 ? (
                        <span style={{ color: '#86efac' }}>Today</span>
                      ) : daysSinceActive === 1 ? (
                        <span style={{ color: '#86efac' }}>Yesterday</span>
                      ) : daysSinceActive <= 7 ? (
                        <span style={{ color: '#fbbf24' }}>{daysSinceActive}d ago</span>
                      ) : (
                        <span style={{ color: '#ef4444' }}>{daysSinceActive}d ago</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/users/${user.id}`}
                          style={{ color: '#f59e0b' }}
                          className="text-xs hover:underline font-medium"
                        >
                          View →
                        </Link>
                        {user.purchaseStatus === 'UNPAID' && (
                          <AdminGrantButton userId={user.id} />
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  )
}
