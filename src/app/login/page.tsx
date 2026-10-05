'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password. Please try again.')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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

        <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-8">
          <h1 className="text-2xl font-black text-white uppercase mb-6">Log In</h1>

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
                style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#ffffff' }}
                className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-amber-500 placeholder-gray-600"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label style={{ color: '#a3a3a3' }} className="block text-xs font-medium uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#ffffff' }}
                className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-amber-500 placeholder-gray-600"
                placeholder="Your password"
              />
            </div>

            {error && (
              <div style={{ backgroundColor: '#1a0000', border: '1px solid #7f1d1d', color: '#fca5a5' }} className="rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: loading ? '#262626' : '#f59e0b', color: loading ? '#a3a3a3' : '#000000' }}
              className="w-full py-3 rounded-lg font-black text-sm uppercase tracking-wider transition-colors disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Log In'}
            </button>
          </form>

          <p style={{ color: '#a3a3a3' }} className="text-sm mt-6 text-center">
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: '#f59e0b' }} className="hover:underline font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
