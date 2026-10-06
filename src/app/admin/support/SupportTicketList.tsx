'use client'

import { useState } from 'react'

interface Ticket {
  id: string
  subject: string
  message: string
  status: string
  reply: string | null
  repliedAt: string | null
  createdAt: string
  user: { email: string; name: string | null }
}

const statusColors: Record<string, { bg: string; border: string; text: string }> = {
  open: { bg: '#1e3a5f', border: '#1e4a7f', text: '#93c5fd' },
  resolved: { bg: '#052e16', border: '#14532d', text: '#86efac' },
  closed: { bg: '#1a1a1a', border: '#262626', text: '#525252' },
}

export default function SupportTicketList({ tickets }: { tickets: Ticket[] }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [replyText, setReplyText] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [localTickets, setLocalTickets] = useState(tickets)

  async function handleReply(id: string, status: string) {
    setSaving(id)
    const res = await fetch(`/api/admin/support/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: replyText[id] ?? '', status }),
    })
    if (res.ok) {
      const data = await res.json() as { ticket: Ticket }
      setLocalTickets((prev) => prev.map((t) => t.id === id ? { ...t, ...data.ticket } : t))
      setReplyText((prev) => ({ ...prev, [id]: '' }))
    }
    setSaving(null)
  }

  async function handleStatusOnly(id: string, status: string) {
    setSaving(id)
    const res = await fetch(`/api/admin/support/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      const data = await res.json() as { ticket: Ticket }
      setLocalTickets((prev) => prev.map((t) => t.id === id ? { ...t, ...data.ticket } : t))
    }
    setSaving(null)
  }

  if (localTickets.length === 0) {
    return (
      <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl px-5 py-8 text-center">
        <p style={{ color: '#525252' }} className="text-sm">No tickets.</p>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl overflow-hidden divide-y">
      {localTickets.map((ticket) => {
        const sc = statusColors[ticket.status] ?? statusColors.open
        const isExpanded = expanded === ticket.id
        return (
          <div key={ticket.id} style={{ borderBottom: '1px solid #161616' }}>
            <button
              onClick={() => setExpanded(isExpanded ? null : ticket.id)}
              className="w-full text-left px-5 py-4 hover:bg-neutral-900 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      style={{ backgroundColor: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}
                      className="text-xs px-2 py-0.5 rounded font-medium capitalize"
                    >
                      {ticket.status}
                    </span>
                    <span className="text-white text-sm font-medium">{ticket.subject}</span>
                  </div>
                  <p style={{ color: '#737373' }} className="text-xs">{ticket.user.email}</p>
                  <p style={{ color: '#525252' }} className="text-xs mt-1 truncate">{ticket.message}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p style={{ color: '#404040' }} className="text-xs">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                  <p style={{ color: '#404040' }} className="text-xs mt-1">{isExpanded ? '▲' : '▼'}</p>
                </div>
              </div>
            </button>

            {isExpanded && (
              <div style={{ backgroundColor: '#0d0d0d', borderTop: '1px solid #161616' }} className="px-5 py-4 space-y-3">
                <div>
                  <p style={{ color: '#525252' }} className="text-xs uppercase tracking-wider mb-1">Message</p>
                  <p style={{ color: '#d4d4d4' }} className="text-sm whitespace-pre-wrap">{ticket.message}</p>
                </div>
                {ticket.reply && (
                  <div>
                    <p style={{ color: '#525252' }} className="text-xs uppercase tracking-wider mb-1">
                      Reply {ticket.repliedAt ? `· ${new Date(ticket.repliedAt).toLocaleDateString()}` : ''}
                    </p>
                    <p style={{ color: '#86efac', backgroundColor: '#052e16', border: '1px solid #14532d' }} className="text-sm p-3 rounded-lg whitespace-pre-wrap">{ticket.reply}</p>
                  </div>
                )}
                <div>
                  <p style={{ color: '#525252' }} className="text-xs uppercase tracking-wider mb-1">Reply</p>
                  <textarea
                    value={replyText[ticket.id] ?? ''}
                    onChange={(e) => setReplyText((prev) => ({ ...prev, [ticket.id]: e.target.value }))}
                    rows={3}
                    placeholder="Type a reply..."
                    style={{ backgroundColor: '#111111', border: '1px solid #262626', color: '#fff' }}
                    className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-amber-700 placeholder-neutral-600 resize-none"
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    disabled={saving === ticket.id || !replyText[ticket.id]?.trim()}
                    onClick={() => { void handleReply(ticket.id, 'resolved') }}
                    style={{ backgroundColor: '#f59e0b', color: '#000' }}
                    className="text-xs px-3 py-1.5 rounded font-bold disabled:opacity-50"
                  >
                    {saving === ticket.id ? 'Saving...' : 'Reply & Resolve'}
                  </button>
                  {ticket.status === 'open' && (
                    <button
                      disabled={saving === ticket.id}
                      onClick={() => { void handleStatusOnly(ticket.id, 'closed') }}
                      style={{ border: '1px solid #262626', color: '#737373' }}
                      className="text-xs px-3 py-1.5 rounded hover:text-white transition-colors disabled:opacity-50"
                    >
                      Close without reply
                    </button>
                  )}
                  {ticket.status !== 'open' && (
                    <button
                      disabled={saving === ticket.id}
                      onClick={() => { void handleStatusOnly(ticket.id, 'open') }}
                      style={{ border: '1px solid #1e4a7f', color: '#93c5fd' }}
                      className="text-xs px-3 py-1.5 rounded hover:opacity-80 transition-opacity disabled:opacity-50"
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
