'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import Navbar from '@/components/Navbar'

interface Announcement {
  id: string
  title: string
  message: string
  type: string
  active: boolean
  createdAt: string
}

export default function AnnouncementsPage() {
  const router = useRouter()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', message: '', type: 'info', active: true })
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/announcements')
    if (res.status === 403) { router.push('/dashboard'); return }
    const data = await res.json() as { announcements: Announcement[] }
    setAnnouncements(data.announcements ?? [])
    setLoading(false)
  }, [router])

  useEffect(() => { void load() }, [load])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const res = await fetch('/api/admin/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ title: '', message: '', type: 'info', active: true })
      await load()
    } else {
      const d = await res.json() as { error?: string }
      setError(d.error ?? 'Failed to create')
    }
    setSaving(false)
  }

  async function toggleActive(id: string) {
    await fetch(`/api/admin/announcements/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
    await load()
  }

  async function deleteAnnouncement(id: string) {
    if (!confirm('Delete this announcement?')) return
    await fetch(`/api/admin/announcements/${id}`, { method: 'DELETE' })
    await load()
  }

  const typeColors: Record<string, { bg: string; border: string; text: string; label: string }> = {
    info: { bg: '#1e3a5f', border: '#1e4a7f', text: '#93c5fd', label: 'Info' },
    warning: { bg: '#3d2a00', border: '#7c4a00', text: '#fcd34d', label: 'Warning' },
    success: { bg: '#052e16', border: '#14532d', text: '#86efac', label: 'Success' },
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto max-w-4xl">
          <h1 className="text-2xl font-black text-white uppercase mb-1">Announcements</h1>
          <p style={{ color: '#525252' }} className="text-xs mb-6">Manage sitewide banners shown to all users</p>

          {/* Create form */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-5 mb-6">
            <h2 className="text-white font-bold text-xs uppercase tracking-wider mb-4">New Announcement</h2>
            <form onSubmit={(e) => { void handleCreate(e) }} className="space-y-3">
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Title..."
                required
                style={{ backgroundColor: '#0a0a0a', border: '1px solid #262626', color: '#fff' }}
                className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-amber-700 placeholder-neutral-600"
              />
              <textarea
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="Message..."
                required
                rows={3}
                style={{ backgroundColor: '#0a0a0a', border: '1px solid #262626', color: '#fff' }}
                className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-amber-700 placeholder-neutral-600 resize-none"
              />
              <div className="flex items-center gap-3 flex-wrap">
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  style={{ backgroundColor: '#0a0a0a', border: '1px solid #262626', color: '#fff' }}
                  className="px-3 py-2 rounded-lg text-sm focus:outline-none"
                >
                  <option value="info">Info (blue)</option>
                  <option value="warning">Warning (amber)</option>
                  <option value="success">Success (green)</option>
                </select>
                <label className="flex items-center gap-2 text-sm" style={{ color: '#a3a3a3' }}>
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                    className="accent-amber-500"
                  />
                  Active immediately
                </label>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ backgroundColor: '#f59e0b', color: '#000' }}
                  className="px-4 py-2 rounded-lg text-sm font-bold ml-auto disabled:opacity-50"
                >
                  {saving ? 'Creating...' : 'Create'}
                </button>
              </div>
              {error && <p style={{ color: '#ef4444' }} className="text-xs">{error}</p>}
            </form>
          </div>

          {/* List */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl overflow-hidden">
            <div style={{ borderBottom: '1px solid #1f1f1f', backgroundColor: '#0d0d0d' }} className="px-5 py-3">
              <p style={{ color: '#525252' }} className="text-xs uppercase tracking-wider font-medium">All Announcements ({announcements.length})</p>
            </div>
            {loading ? (
              <div className="px-5 py-8 text-center">
                <p style={{ color: '#525252' }} className="text-sm">Loading...</p>
              </div>
            ) : announcements.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p style={{ color: '#525252' }} className="text-sm">No announcements yet.</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: '#161616' }}>
                {announcements.map((a) => {
                  const tc = typeColors[a.type] ?? typeColors.info
                  return (
                    <div key={a.id} className="px-5 py-4 flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            style={{ backgroundColor: tc.bg, border: `1px solid ${tc.border}`, color: tc.text }}
                            className="text-xs px-2 py-0.5 rounded font-medium"
                          >
                            {tc.label}
                          </span>
                          <div
                            style={{ backgroundColor: a.active ? '#22c55e' : '#525252' }}
                            className="w-2 h-2 rounded-full"
                            title={a.active ? 'Active' : 'Inactive'}
                          />
                          <span style={{ color: a.active ? '#86efac' : '#525252' }} className="text-xs">
                            {a.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-white text-sm font-medium">{a.title}</p>
                        <p style={{ color: '#737373' }} className="text-xs mt-0.5 truncate">{a.message}</p>
                        <p style={{ color: '#404040' }} className="text-xs mt-1">{new Date(a.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => { void toggleActive(a.id) }}
                          style={{
                            backgroundColor: a.active ? '#1a1a1a' : '#052e16',
                            border: `1px solid ${a.active ? '#262626' : '#166534'}`,
                            color: a.active ? '#737373' : '#86efac',
                          }}
                          className="text-xs px-3 py-1.5 rounded font-medium hover:opacity-80 transition-opacity"
                        >
                          {a.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => { void deleteAnnouncement(a.id) }}
                          style={{ color: '#ef4444', border: '1px solid #450a0a' }}
                          className="text-xs px-3 py-1.5 rounded hover:bg-red-950 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
