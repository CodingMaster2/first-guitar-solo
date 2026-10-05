'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function SuccessPage() {
  const { data: session, update } = useSession()
  const searchParams = useSearchParams()
  const isNew = searchParams.get('new') === 'true'
  const fromStripe = !!searchParams.get('session_id')
  const [hasProfile, setHasProfile] = useState(false)
  const [loading, setLoading] = useState(true)
  const [paid, setPaid] = useState(false)
  const [polling, setPolling] = useState(fromStripe)

  const refreshSession = useCallback(async () => {
    const updated = await update()
    if (updated?.user?.purchaseStatus === 'PAID') {
      setPaid(true)
      return true
    }
    return false
  }, [update])

  useEffect(() => {
    if (!fromStripe) {
      refreshSession().then(() => setPolling(false))
      return
    }

    // Poll up to 12 seconds for webhook to fire
    let attempts = 0
    const poll = async () => {
      attempts++
      const confirmed = await refreshSession()
      if (confirmed || attempts >= 6) {
        setPolling(false)
      } else {
        setTimeout(poll, 2000)
      }
    }
    poll()
  }, [fromStripe, refreshSession])

  useEffect(() => {
    if (session?.user?.purchaseStatus === 'PAID') setPaid(true)
  }, [session])

  useEffect(() => {
    if (!session?.user || polling) return
    const checkProfile = async () => {
      try {
        const res = await fetch('/api/progress')
        const data = await res.json() as { profile?: { id: string } | null }
        setHasProfile(!!data.profile)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    checkProfile()
  }, [session, polling])

  if (isNew && !paid) {
    return (
      <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }} className="flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-widest mb-4">
            Account Created
          </div>
          <h1 className="text-4xl font-black uppercase mb-4">One Last Step</h1>
          <p style={{ color: '#a3a3a3' }} className="text-base mb-8 leading-relaxed">
            Your account is ready. Complete your payment to access the full 30-day program.
          </p>
          <PaymentButton />
          <p style={{ color: '#a3a3a3' }} className="text-xs mt-4">
            30-day money-back guarantee
          </p>
        </div>
      </div>
    )
  }

  if (polling) {
    return (
      <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }} className="flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div style={{ color: '#a3a3a3' }} className="text-sm mb-2">Confirming your payment&hellip;</div>
          <div style={{ color: '#a3a3a3' }} className="text-xs">This takes a moment.</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }} className="flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div style={{ color: '#f59e0b', fontSize: '4rem' }} className="mb-6">&#9733;</div>
        <div style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-widest mb-4">
          Payment Complete
        </div>
        <h1 className="text-5xl font-black uppercase mb-4">You&apos;re in.</h1>
        <p style={{ color: '#a3a3a3' }} className="text-lg mb-10 leading-relaxed">
          Your account is ready. Let&apos;s start building toward your first solo.
        </p>

        {!loading && (
          <div>
            {!hasProfile ? (
              <Link
                href="/onboarding"
                style={{ backgroundColor: '#f59e0b', color: '#000000' }}
                className="inline-block text-base font-black px-8 py-4 rounded uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                Begin Onboarding &#8594;
              </Link>
            ) : (
              <Link
                href="/dashboard"
                style={{ backgroundColor: '#f59e0b', color: '#000000' }}
                className="inline-block text-base font-black px-8 py-4 rounded uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                Go to Dashboard &#8594;
              </Link>
            )}
          </div>
        )}

        {loading && (
          <div style={{ color: '#a3a3a3' }} className="text-sm">Loading&hellip;</div>
        )}
      </div>
    </div>
  )
}

function PaymentButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePayment = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json() as { url?: string; error?: string }
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? 'Failed to start checkout')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handlePayment}
        disabled={loading}
        style={{ backgroundColor: loading ? '#262626' : '#f59e0b', color: loading ? '#a3a3a3' : '#000000' }}
        className="w-full py-4 rounded-lg font-black text-base uppercase tracking-wider transition-colors disabled:cursor-not-allowed"
      >
        {loading ? 'Loading...' : 'Complete Payment — $25'}
      </button>
      {error && <p style={{ color: '#fca5a5' }} className="text-sm mt-2">{error}</p>}
    </div>
  )
}
