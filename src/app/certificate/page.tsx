'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ProgressRecord {
  day: number
  completed: boolean
  completedAt: string | null
}

interface ProgressApiResponse {
  progress: ProgressRecord[]
  profile: { currentDay: number } | null
}

export default function CertificatePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [day30, setDay30] = useState<ProgressRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return
    fetch('/api/progress')
      .then((r) => r.json())
      .then((data: ProgressApiResponse) => {
        const d30 = data.progress?.find((p) => p.day === 30 && p.completed) ?? null
        setDay30(d30)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [status])

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    )
  }

  if (!day30) {
    return (
      <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} className="px-4">
        <div style={{ color: '#f59e0b', fontSize: '3rem', lineHeight: 1 }} className="mb-6">🎸</div>
        <h1 className="text-2xl font-black text-white uppercase mb-3 text-center">Certificate Locked</h1>
        <p style={{ color: '#a3a3a3' }} className="text-sm text-center max-w-xs mb-6">
          Complete Day 30 to unlock your certificate of completion.
        </p>
        <Link
          href="/lessons"
          style={{ backgroundColor: '#f59e0b', color: '#000000' }}
          className="text-sm font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Continue Learning
        </Link>
      </div>
    )
  }

  const completionDate = day30.completedAt
    ? new Date(day30.completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const studentName = session?.user?.name ?? session?.user?.email ?? 'Guitarist'

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #ffffff !important; }
          .certificate-wrapper { background: #ffffff !important; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        }
      `}</style>

      {/* Nav bar — hidden on print */}
      <div className="no-print" style={{ backgroundColor: '#0a0a0a', borderBottom: '1px solid #262626' }}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" style={{ color: '#a3a3a3' }} className="text-sm hover:text-white transition-colors">
            ← Back to Dashboard
          </Link>
          <div className="flex gap-3">
            <button
              onClick={handleShare}
              style={{ border: '1px solid #262626', backgroundColor: '#111111', color: '#a3a3a3' }}
              className="text-sm px-4 py-2 rounded-lg hover:border-amber-600 hover:text-white transition-colors"
            >
              {copied ? 'Copied!' : 'Share'}
            </button>
            <button
              onClick={() => window.print()}
              style={{ backgroundColor: '#f59e0b', color: '#000000' }}
              className="text-sm font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Download Certificate
            </button>
          </div>
        </div>
      </div>

      {/* Certificate wrapper */}
      <div className="certificate-wrapper" style={{ backgroundColor: '#0a0a0a', minHeight: 'calc(100vh - 65px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            color: '#1a1a1a',
            maxWidth: '680px',
            width: '100%',
            borderRadius: '4px',
            padding: '3rem 3.5rem',
            position: 'relative',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            border: '1px solid #e5e5e5',
          }}
        >
          {/* Outer decorative border */}
          <div
            style={{
              position: 'absolute',
              inset: '12px',
              border: '2px solid #f59e0b',
              borderRadius: '2px',
              pointerEvents: 'none',
            }}
          />

          {/* Inner corner accents */}
          {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((corner) => (
            <div
              key={corner}
              style={{
                position: 'absolute',
                width: '24px',
                height: '24px',
                borderColor: '#d97706',
                borderStyle: 'solid',
                borderWidth: corner.includes('top') ? '3px 0 0 3px' : '0 3px 3px 0',
                ...(corner.includes('top') ? { top: '20px' } : { bottom: '20px' }),
                ...(corner.includes('left') ? { left: '20px' } : { right: '20px' }),
              }}
            />
          ))}

          {/* Header */}
          <div className="text-center mb-6">
            <p style={{ color: '#f59e0b', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Sixth String Labs
            </p>
            <div style={{ width: '40px', height: '2px', backgroundColor: '#f59e0b', margin: '0 auto 1.5rem' }} />
            <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#1a1a1a', lineHeight: 1.1 }}>
              Certificate
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 400, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#525252', marginTop: '0.25rem' }}>
              of Completion
            </p>
          </div>

          {/* Body */}
          <div className="text-center mb-6">
            <p style={{ color: '#737373', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              This certifies that
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: '#1a1a1a', fontStyle: 'italic', marginBottom: '0.75rem', letterSpacing: '0.02em' }}>
              {studentName}
            </p>
            <p style={{ color: '#525252', fontSize: '0.875rem', marginBottom: '1rem' }}>
              has successfully completed
            </p>
            <p style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              First Guitar Solo
            </p>
            <p style={{ color: '#737373', fontSize: '0.875rem', letterSpacing: '0.05em' }}>
              A 30-Day Blues-Rock Guitar Program
            </p>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e5e5' }} />
            <span style={{ color: '#f59e0b', fontSize: '1.25rem' }}>★</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e5e5' }} />
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '120px', height: '1px', backgroundColor: '#1a1a1a', marginBottom: '4px' }} />
              <p style={{ color: '#737373', fontSize: '0.7rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Date Completed</p>
              <p style={{ color: '#1a1a1a', fontSize: '0.8rem', fontWeight: 600 }}>{completionDate}</p>
            </div>

            {/* Seal */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: '3px solid #f59e0b',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fffbeb',
            }}>
              <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>🎸</span>
              <span style={{ color: '#92400e', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '2px', textAlign: 'center', lineHeight: 1.2 }}>
                SSL
              </span>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '120px', height: '1px', backgroundColor: '#1a1a1a', marginBottom: '4px' }} />
              <p style={{ color: '#737373', fontSize: '0.7rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Issued by</p>
              <p style={{ color: '#1a1a1a', fontSize: '0.8rem', fontWeight: 600 }}>Sixth String Labs</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
