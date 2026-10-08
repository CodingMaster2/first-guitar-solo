import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import CertificatePrint from './CertificatePrint'

export default async function CertificatePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const [profile, user] = await Promise.all([
    prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { soloCompleted: true, soloCompletedAt: true },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true },
    }),
  ])

  const name = user?.name ?? session.user.email ?? 'Guitarist'
  const completionDate = profile?.soloCompletedAt
    ? new Date(profile.soloCompletedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

  if (!profile?.soloCompleted) {
    return (
      <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
        <Navbar />
        <div
          className="flex flex-col items-center justify-center"
          style={{ minHeight: 'calc(100vh - 64px)', padding: '2rem 1rem' }}
        >
          <div
            style={{
              backgroundColor: '#111111',
              border: '1px solid #262626',
              borderRadius: '12px',
              padding: '3rem 2rem',
              maxWidth: '400px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#525252"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ margin: '0 auto 1.5rem' }}
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <h1 className="text-xl font-black text-white uppercase mb-3">Certificate Locked</h1>
            <p style={{ color: '#737373' }} className="text-sm mb-6">
              Complete all 30 days to unlock your certificate of achievement.
            </p>
            <Link
              href="/lessons"
              style={{ backgroundColor: '#f59e0b', color: '#000000' }}
              className="inline-block text-sm font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Continue Learning
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
        }
      `}</style>

      <div className="no-print" style={{ backgroundColor: '#0a0a0a' }}>
        <Navbar />
      </div>

      <div
        className="no-print"
        style={{ backgroundColor: '#0a0a0a', borderBottom: '1px solid #1f1f1f' }}
      >
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            style={{ color: '#a3a3a3' }}
            className="text-sm hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <CertificatePrint />
        </div>
      </div>

      <div
        style={{
          backgroundColor: '#0a0a0a',
          minHeight: 'calc(100vh - 130px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem',
        }}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            color: '#1a1a1a',
            maxWidth: '700px',
            width: '100%',
            borderRadius: '4px',
            padding: '3.5rem',
            position: 'relative',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            border: '1px solid #e5e5e5',
          }}
        >
          {/* Decorative outer border */}
          <div
            style={{
              position: 'absolute',
              inset: '14px',
              border: '2px solid #f59e0b',
              borderRadius: '2px',
              pointerEvents: 'none',
            }}
          />

          {/* Corner accents */}
          {(['tl', 'tr', 'bl', 'br'] as const).map((c) => (
            <div
              key={c}
              style={{
                position: 'absolute',
                width: 24,
                height: 24,
                borderColor: '#d97706',
                borderStyle: 'solid',
                borderWidth: c.startsWith('t') ? '3px 0 0 3px' : '0 3px 3px 0',
                ...(c.startsWith('t') ? { top: 22 } : { bottom: 22 }),
                ...(c.endsWith('l') ? { left: 22 } : { right: 22 }),
              }}
            />
          ))}

          {/* Certificate heading */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p
              style={{
                color: '#f59e0b',
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
            >
              Sixth String Labs
            </p>
            <div
              style={{
                width: 40,
                height: 2,
                backgroundColor: '#f59e0b',
                margin: '0 auto 1.5rem',
              }}
            />
            <h1
              style={{
                fontSize: '2.25rem',
                fontWeight: 900,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: '#1a1a1a',
                lineHeight: 1.1,
                marginBottom: '0.15rem',
              }}
            >
              Certificate of Achievement
            </h1>
          </div>

          {/* Body */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p
              style={{
                color: '#737373',
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '0.75rem',
              }}
            >
              This certifies that
            </p>
            <p
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: '#1a1a1a',
                fontStyle: 'italic',
                marginBottom: '0.75rem',
              }}
            >
              {name}
            </p>
            <p style={{ color: '#525252', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              has successfully completed the
            </p>
            <p
              style={{
                fontSize: '1.5rem',
                fontWeight: 900,
                color: '#f59e0b',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.25rem',
              }}
            >
              First Guitar Solo
            </p>
            <p style={{ color: '#737373', fontSize: '0.875rem' }}>
              30-Day Guitar Program
            </p>
          </div>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              margin: '1.5rem 0',
            }}
          >
            <div style={{ flex: 1, height: 1, backgroundColor: '#e5e5e5' }} />
            <span style={{ color: '#f59e0b', fontSize: '1.25rem' }}>★</span>
            <div style={{ flex: 1, height: 1, backgroundColor: '#e5e5e5' }} />
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 120,
                  height: 1,
                  backgroundColor: '#1a1a1a',
                  marginBottom: 4,
                }}
              />
              <p
                style={{
                  color: '#737373',
                  fontSize: '0.65rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Completion Date
              </p>
              <p style={{ color: '#1a1a1a', fontSize: '0.8rem', fontWeight: 600 }}>
                {completionDate}
              </p>
            </div>

            {/* Seal */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                border: '3px solid #f59e0b',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fffbeb',
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#92400e"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
              <span
                style={{
                  color: '#92400e',
                  fontSize: '0.5rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                SSL
              </span>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 120,
                  height: 1,
                  backgroundColor: '#1a1a1a',
                  marginBottom: 4,
                }}
              />
              <p
                style={{
                  color: '#737373',
                  fontSize: '0.65rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Issued by
              </p>
              <p style={{ color: '#1a1a1a', fontSize: '0.8rem', fontWeight: 600 }}>
                Sixth String Labs
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
