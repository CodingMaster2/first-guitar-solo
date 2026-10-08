import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LicksClient from './LicksClient'

export const metadata: Metadata = {
  title: 'My Lick Library — First Guitar Solo',
  description: 'Every lick from the 30-day course in one searchable, filterable library. Mark licks for your personal practice rotation.',
  robots: { index: false, follow: false },
}

export default async function MyLicksPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />

      <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div>
            <p
              style={{
                color: '#f59e0b',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '0.375rem',
              }}
            >
              Your Collection
            </p>
            <h1
              style={{
                color: '#ffffff',
                fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
                fontWeight: 900,
                letterSpacing: '0.05em',
                lineHeight: 1.1,
                marginBottom: '0.375rem',
              }}
            >
              My Lick Library
            </h1>
            <p style={{ color: '#737373', fontSize: '0.875rem', margin: 0 }}>
              Every lick from the 30-day course · Filter by technique · Add to practice rotation
            </p>
          </div>

          {/* Stats pill */}
          <div
            style={{
              backgroundColor: '#111111',
              border: '1px solid #262626',
              borderRadius: '0.625rem',
              padding: '0.75rem 1.25rem',
              display: 'flex',
              gap: '1.5rem',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: 900, lineHeight: 1, margin: 0 }}>30</p>
              <p style={{ color: '#525252', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '3px 0 0' }}>
                Total Licks
              </p>
            </div>
            <div style={{ borderLeft: '1px solid #262626', paddingLeft: '1.5rem', textAlign: 'center' }}>
              <p style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 900, lineHeight: 1, margin: 0 }}>30</p>
              <p style={{ color: '#525252', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '3px 0 0' }}>
                Days
              </p>
            </div>
          </div>
        </div>

        {/* Helper callout */}
        <div
          style={{
            backgroundColor: 'rgba(245,158,11,0.06)',
            border: '1px solid rgba(245,158,11,0.15)',
            borderRadius: '0.625rem',
            padding: '0.75rem 1rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
          }}
        >
          <span style={{ fontSize: '1rem', flexShrink: 0 }}>💡</span>
          <p style={{ color: '#a3a3a3', fontSize: '0.8rem', margin: 0, lineHeight: 1.5 }}>
            Click <strong style={{ color: '#f59e0b' }}>🔁</strong> on any lick card to add it to your
            practice rotation. Use the{' '}
            <strong style={{ color: '#f59e0b' }}>Practice Rotation</strong> filter to see only those licks during
            focused review sessions. Your rotation is saved locally in this browser.
          </p>
        </div>

        {/* Client component handles all interactivity */}
        <LicksClient />
      </main>

      <Footer />
    </div>
  )
}
