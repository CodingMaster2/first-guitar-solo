'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

interface Props {
  token: string
}

type ValidationState = 'checking' | 'valid' | 'invalid'
type SubmitState = 'idle' | 'loading' | 'success' | 'error'

export default function ResetPasswordClient({ token }: Props) {
  const [validation, setValidation] = useState<ValidationState>('checking')
  const [invalidReason, setInvalidReason] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const validate = async () => {
      try {
        const res = await fetch(`/api/auth/reset-password?token=${encodeURIComponent(token)}`)
        const data = await res.json() as { valid: boolean; reason?: string }
        if (data.valid) {
          setValidation('valid')
        } else {
          setInvalidReason(data.reason ?? 'This reset link is invalid or has expired.')
          setValidation('invalid')
        }
      } catch {
        setInvalidReason('Failed to validate reset link. Please try again.')
        setValidation('invalid')
      }
    }
    void validate()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }

    setSubmitState('loading')

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json() as { success?: boolean; error?: string }
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? 'Failed to reset password.')
      }
      setSubmitState('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
      setSubmitState('error')
    }
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />

      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-8">

            {validation === 'checking' && (
              <div className="text-center py-8">
                <svg className="animate-spin h-8 w-8 mx-auto mb-4" style={{ color: '#f59e0b' }} viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                <p style={{ color: '#737373' }} className="text-sm">Validating reset link...</p>
              </div>
            )}

            {validation === 'invalid' && (
              <div className="text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <h1 className="text-2xl font-black text-white uppercase mb-4">Link Invalid</h1>
                <p style={{ color: '#d4d4d4' }} className="text-sm leading-relaxed mb-6">
                  {invalidReason}
                </p>
                <Link
                  href="/forgot-password"
                  style={{ backgroundColor: '#f59e0b', color: '#000000' }}
                  className="inline-block py-3 px-6 rounded-lg font-black text-sm uppercase tracking-wider"
                >
                  Request New Link
                </Link>
              </div>
            )}

            {validation === 'valid' && submitState === 'success' && (
              <div className="text-center">
                <div style={{ color: '#f59e0b' }} className="text-4xl mb-4">✓</div>
                <h1 className="text-2xl font-black text-white uppercase mb-4">Password Changed!</h1>
                <p style={{ color: '#d4d4d4' }} className="text-sm leading-relaxed mb-6">
                  Your password has been updated. You can now log in with your new password.
                </p>
                <Link
                  href="/login"
                  style={{ backgroundColor: '#f59e0b', color: '#000000' }}
                  className="inline-block py-3 px-6 rounded-lg font-black text-sm uppercase tracking-wider"
                >
                  Log In
                </Link>
              </div>
            )}

            {validation === 'valid' && submitState !== 'success' && (
              <>
                <h1 className="text-2xl font-black text-white uppercase mb-2">New Password</h1>
                <p style={{ color: '#737373' }} className="text-sm mb-6">
                  Choose a strong password (minimum 8 characters).
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label style={{ color: '#a3a3a3' }} className="block text-xs font-medium uppercase tracking-wider mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      disabled={submitState === 'loading'}
                      style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#ffffff' }}
                      className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-amber-500 placeholder-gray-600 disabled:opacity-50"
                      placeholder="At least 8 characters"
                    />
                  </div>

                  <div>
                    <label style={{ color: '#a3a3a3' }} className="block text-xs font-medium uppercase tracking-wider mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={submitState === 'loading'}
                      style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#ffffff' }}
                      className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-amber-500 placeholder-gray-600 disabled:opacity-50"
                      placeholder="Repeat your password"
                    />
                  </div>

                  {(errorMsg || submitState === 'error') && (
                    <div style={{ backgroundColor: '#1a0000', border: '1px solid #7f1d1d', color: '#fca5a5' }} className="rounded-lg px-4 py-3 text-sm">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitState === 'loading'}
                    style={{ backgroundColor: submitState === 'loading' ? '#262626' : '#f59e0b', color: submitState === 'loading' ? '#a3a3a3' : '#000000' }}
                    className="w-full py-3 rounded-lg font-black text-sm uppercase tracking-wider transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitState === 'loading' ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Set New Password'
                    )}
                  </button>
                </form>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
