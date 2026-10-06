'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import Navbar from '@/components/Navbar'

interface CouponCode {
  id: string
  code: string
  discountPct: number
  usageLimit: number | null
  usedCount: number
  expiresAt: string | null
  active: boolean
  createdAt: string
  _count: { redemptions: number }
}

export default function CouponsPage() {
  const router = useRouter()
  const [coupons, setCoupons] = useState<CouponCode[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ code: '', discountPct: '20', usageLimit: '', expiresAt: '' })
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/coupons')
    if (res.status === 403) { router.push('/dashboard'); return }
    const data = await res.json() as { coupons: CouponCode[] }
    setCoupons(data.coupons ?? [])
    setLoading(false)
  }, [router])

  useEffect(() => { void load() }, [load])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const body: Record<string, unknown> = { discountPct: Number(form.discountPct) }
    if (form.code.trim()) body.code = form.code.trim()
    if (form.usageLimit) body.usageLimit = Number(form.usageLimit)
    if (form.expiresAt) body.expiresAt = form.expiresAt
    const res = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      setForm({ code: '', discountPct: '20', usageLimit: '', expiresAt: '' })
      await load()
    } else {
      const d = await res.json() as { error?: string }
      setError(d.error ?? 'Failed to create')
    }
    setSaving(false)
  }

  async function toggleActive(id: string) {
    await fetch(`/api/admin/coupons/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
    await load()
  }

  async function deleteCoupon(id: string) {
    if (!confirm('Delete this coupon?')) return
    const res = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const d = await res.json() as { error?: string }
      alert(d.error ?? 'Cannot delete')
      return
    }
    await load()
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto max-w-5xl">
          <h1 className="text-2xl font-black text-white uppercase mb-1">Coupon Codes</h1>
          <p style={{ color: '#525252' }} className="text-xs mb-6">Create and manage discount codes</p>

          {/* Create form */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-5 mb-6">
            <h2 className="text-white font-bold text-xs uppercase tracking-wider mb-4">New Coupon</h2>
            <form onSubmit={(e) => { void handleCreate(e) }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label style={{ color: '#737373' }} className="text-xs mb-1 block">Code (leave blank to auto-generate)</label>
                <input
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g. LAUNCH25"
                  style={{ backgroundColor: '#0a0a0a', border: '1px solid #262626', color: '#fff' }}
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-amber-700 placeholder-neutral-600 font-mono"
                />
              </div>
              <div>
                <label style={{ color: '#737373' }} className="text-xs mb-1 block">Discount %</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={form.discountPct}
                  onChange={(e) => setForm((f) => ({ ...f, discountPct: e.target.value }))}
                  required
                  style={{ backgroundColor: '#0a0a0a', border: '1px solid #262626', color: '#fff' }}
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-amber-700"
                />
              </div>
              <div>
                <label style={{ color: '#737373' }} className="text-xs mb-1 block">Usage Limit (optional)</label>
                <input
                  type="number"
                  min={1}
                  value={form.usageLimit}
                  onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value }))}
                  placeholder="Unlimited"
                  style={{ backgroundColor: '#0a0a0a', border: '1px solid #262626', color: '#fff' }}
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-amber-700 placeholder-neutral-600"
                />
              </div>
              <div>
                <label style={{ color: '#737373' }} className="text-xs mb-1 block">Expires (optional)</label>
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
                  style={{ backgroundColor: '#0a0a0a', border: '1px solid #262626', color: '#fff' }}
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-amber-700"
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-4 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  style={{ backgroundColor: '#f59e0b', color: '#000' }}
                  className="px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
                >
                  {saving ? 'Creating...' : 'Create Coupon'}
                </button>
                {error && <p style={{ color: '#ef4444' }} className="text-xs">{error}</p>}
              </div>
            </form>
          </div>

          {/* List */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid #1f1f1f', backgroundColor: '#0d0d0d' }}>
                    {['Code', 'Discount', 'Usage', 'Expires', 'Status', 'Actions'].map((h) => (
                      <th key={h} style={{ color: '#525252' }} className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center">
                        <p style={{ color: '#525252' }} className="text-sm">Loading...</p>
                      </td>
                    </tr>
                  ) : coupons.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center">
                        <p style={{ color: '#525252' }} className="text-sm">No coupons yet.</p>
                      </td>
                    </tr>
                  ) : (
                    coupons.map((c) => {
                      const expired = c.expiresAt && new Date(c.expiresAt) < new Date()
                      const limitReached = c.usageLimit != null && c.usedCount >= c.usageLimit
                      return (
                        <tr key={c.id} style={{ borderBottom: '1px solid #161616' }} className="hover:bg-neutral-900 transition-colors">
                          <td className="px-4 py-3">
                            <span style={{ color: '#f59e0b', fontFamily: 'monospace' }} className="text-sm font-bold">{c.code}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span style={{ color: '#86efac' }} className="text-sm font-bold">{c.discountPct}%</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-white text-xs">{c.usedCount}</span>
                            <span style={{ color: '#525252' }} className="text-xs"> / {c.usageLimit ?? '∞'}</span>
                          </td>
                          <td className="px-4 py-3">
                            {c.expiresAt ? (
                              <span style={{ color: expired ? '#ef4444' : '#a3a3a3' }} className="text-xs">
                                {new Date(c.expiresAt).toLocaleDateString()}
                                {expired && ' (expired)'}
                              </span>
                            ) : (
                              <span style={{ color: '#404040' }} className="text-xs">Never</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {limitReached || expired ? (
                              <span style={{ color: '#ef4444', border: '1px solid #450a0a' }} className="text-xs px-2 py-0.5 rounded">
                                {limitReached ? 'Limit reached' : 'Expired'}
                              </span>
                            ) : (
                              <span
                                style={{
                                  backgroundColor: c.active ? '#052e16' : '#1a1a1a',
                                  color: c.active ? '#86efac' : '#525252',
                                  border: `1px solid ${c.active ? '#166534' : '#262626'}`,
                                }}
                                className="text-xs px-2 py-0.5 rounded"
                              >
                                {c.active ? 'Active' : 'Inactive'}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => { void toggleActive(c.id) }}
                                style={{ color: '#f59e0b' }}
                                className="text-xs hover:underline font-medium"
                              >
                                {c.active ? 'Deactivate' : 'Activate'}
                              </button>
                              {c.usedCount === 0 && (
                                <button
                                  onClick={() => { void deleteCoupon(c.id) }}
                                  style={{ color: '#ef4444' }}
                                  className="text-xs hover:underline"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
