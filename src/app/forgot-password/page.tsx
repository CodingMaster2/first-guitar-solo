'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [submittedEmail, setSubmittedEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json() as { error?: string }
        throw new Error(data.error ?? 'Something went wrong')
      }

      setSubmittedEmail(email)
      setStatus('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
      setStatus('error')
    }
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />

      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-8">

            {status === 'success' ? (
              <div className="text-center">
                <div style={{ color: '#f59e0b' }} className="text-4xl mb-4">✉️</div>
                <h1 className="text-2xl font-black text-white uppercase mb-4">Check Your Email</h1>
                <p style={{ color: '#d4d4d4' }} className="text-sm leading-relaxed mb-6">
                  We sent a reset link to <span style={{ color: '#f59e0b' }} className="font-semibold">{submittedEmail}</span>.
                  It expires in 1 hour.
                </p>
                <p style={{ color: '#737373' }} className="text-xs leading-relaxed mb-6">
                  Didn&apos;t get it? Check your spam folder or try again.
                </p>
                <Link
                  href="/login"
                  style={{ color: '#737373' }}
                  className="text-sm hover:underline"
                >
                  Back to login
                </Link>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-black text-white uppercase mb-2">Forgot Password?</h1>
                <p style={{ color: '#737373' }} className="text-sm mb-6">
                  Enter your email and we&apos;ll send you a reset link.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label style={{ color: '#a3a3a3' }} className="block text-xs font-medium uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={status === 'loading'}
                      style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#ffffff' }}
                      className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-amber-500 placeholder-gray-600 disabled:opacity-50"
                      placeholder="you@example.com"
                    />
                  </div>

                  {status === 'error' && (
                    <div style={{ backgroundColor: '#1a0000', border: '1px solid #7f1d1d', color: '#fca5a5' }} className="rounded-lg px-4 py-3 text-sm">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    style={{ backgroundColor: status === 'loading' ? '#262626' : '#f59e0b', color: status === 'loading' ? '#a3a3a3' : '#000000' }}
                    className="w-full py-3 rounded-lg font-black text-sm uppercase tracking-wider transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {status === 'loading' ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </form>

                <p style={{ color: '#737373' }} className="text-sm mt-6 text-center">
                  Remember it?{' '}
                  <Link href="/login" style={{ color: '#f59e0b' }} className="hover:underline font-medium">
                    Back to login
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
