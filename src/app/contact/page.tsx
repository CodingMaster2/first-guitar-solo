'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'

const SUBJECTS = [
  'Pre-purchase question',
  'Technical issue',
  'Billing question',
  'Other',
]

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState(SUBJECTS[0])
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      })
      const data = await res.json() as { success?: boolean; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStatus('error')
    }
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <main className="max-w-lg mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-black text-white uppercase mb-2">Contact Us</h1>
        <p style={{ color: '#a3a3a3' }} className="text-sm mb-8">
          Questions about the program? Reach out and we&apos;ll get back to you within 24 hours.
        </p>

        {status === 'success' ? (
          <div
            style={{ backgroundColor: '#051005', border: '1px solid #166534', color: '#86efac' }}
            className="rounded-xl p-6 text-center"
          >
            <p className="text-sm font-bold">Thanks, we&apos;ll get back to you within 24 hours.</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ backgroundColor: '#111111', border: '1px solid #262626' }}
            className="rounded-xl p-6 space-y-5"
          >
            <div>
              <label style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider block mb-2">
                Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#ffffff' }}
                className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider block mb-2">
                Email <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#ffffff' }}
                className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider block mb-2">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#ffffff' }}
                className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider block mb-2">
                Message <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                minLength={20}
                rows={5}
                placeholder="Tell us how we can help (min 20 characters)..."
                style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#ffffff', resize: 'vertical' }}
                className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {error && (
              <p
                style={{ color: '#ef4444', backgroundColor: '#1a0000', border: '1px solid #7f1d1d' }}
                className="text-xs px-3 py-2 rounded-lg"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              style={{ backgroundColor: '#f59e0b', color: '#000000' }}
              className="w-full py-3 rounded-lg text-sm font-black uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </main>
    </div>
  )
}
