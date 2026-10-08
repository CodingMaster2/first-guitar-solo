'use client'

import { useState, useRef } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [promoMessage, setPromoMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const honeypotRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Honeypot check — bots fill this field, real users don't
    if (honeypotRef.current?.value) {
      return
    }

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, website: honeypotRef.current?.value ?? '', promoCode: promoCode.trim() || undefined }),
      })

      const data = (await res.json()) as { error?: string; promoValid?: boolean }

      if (!res.ok) {
        setError(data.error ?? 'Registration failed.')
        return
      }

      if (data.promoValid === true) {
        setPromoMessage('Promo code applied! Your discount will be applied at checkout.')
      }

      // Auto sign in after registration
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (signInResult?.error) {
        setError('Account created but sign-in failed. Please log in.')
        router.push('/login')
      } else {
        // Redirect to payment
        router.push('/success?new=true')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const hasError = !!error

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }} className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center">
            <span style={{ color: '#f59e0b' }} className="text-xs font-bold tracking-widest uppercase mb-1">
              Sixth String Labs
            </span>
            <span className="text-white text-xl font-black tracking-wider uppercase">First Guitar Solo</span>
          </Link>
        </div>

        <main>
          <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-8">
            <h1 className="text-2xl font-black text-white uppercase mb-2">Create Account</h1>
            <p style={{ color: '#a3a3a3' }} className="text-sm mb-6">
              You&apos;ll complete payment after creating your account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="reg-name"
                  style={{ color: '#a3a3a3' }}
                  className="block text-xs font-medium uppercase tracking-wider mb-2"
                >
                  Name (optional)
                </label>
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#ffffff' }}
                  className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-amber-500 placeholder-gray-600"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-email"
                  style={{ color: '#a3a3a3' }}
                  className="block text-xs font-medium uppercase tracking-wider mb-2"
                >
                  Email
                </label>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-required="true"
                  aria-invalid={hasError || undefined}
                  style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#ffffff' }}
                  className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-amber-500 placeholder-gray-600"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-password"
                  style={{ color: '#a3a3a3' }}
                  className="block text-xs font-medium uppercase tracking-wider mb-2"
                >
                  Password
                </label>
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-required="true"
                  aria-invalid={hasError || undefined}
                  aria-describedby={hasError ? 'reg-error' : undefined}
                  style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#ffffff' }}
                  className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-amber-500 placeholder-gray-600"
                  placeholder="At least 8 characters"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-confirm"
                  style={{ color: '#a3a3a3' }}
                  className="block text-xs font-medium uppercase tracking-wider mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="reg-confirm"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  aria-required="true"
                  aria-invalid={hasError || undefined}
                  style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#ffffff' }}
                  className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-amber-500 placeholder-gray-600"
                  placeholder="Repeat your password"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-promo"
                  style={{ color: '#525252' }}
                  className="block text-xs font-medium uppercase tracking-wider mb-2"
                >
                  Promo Code (optional)
                </label>
                <input
                  id="reg-promo"
                  name="promo-code"
                  type="text"
                  autoComplete="off"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#ffffff' }}
                  className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                  placeholder="Enter promo code"
                />
              </div>

              {promoMessage && (
                <div
                  style={{ backgroundColor: '#052e16', border: '1px solid #166534', color: '#86efac' }}
                  className="rounded-lg px-4 py-3 text-sm"
                >
                  {promoMessage}
                </div>
              )}

              {/* Honeypot — hidden from real users, traps bots */}
              <input
                ref={honeypotRef}
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: -9999,
                  width: 1,
                  height: 1,
                  opacity: 0,
                }}
              />

              {error && (
                <div
                  id="reg-error"
                  role="alert"
                  style={{ backgroundColor: '#1a0000', border: '1px solid #7f1d1d', color: '#fca5a5' }}
                  className="rounded-lg px-4 py-3 text-sm"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: loading ? '#262626' : '#f59e0b', color: loading ? '#a3a3a3' : '#000000' }}
                className="w-full py-3 rounded-lg font-black text-sm uppercase tracking-wider transition-colors disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p style={{ color: '#a3a3a3' }} className="text-sm mt-6 text-center">
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#f59e0b' }} className="hover:underline font-medium">
                Log in
              </Link>
            </p>

            <p style={{ color: '#a3a3a3' }} className="text-xs mt-4 text-center leading-relaxed">
              By creating an account, you agree to our{' '}
              <Link href="/terms" style={{ color: '#f59e0b' }} className="hover:underline">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" style={{ color: '#f59e0b' }} className="hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
