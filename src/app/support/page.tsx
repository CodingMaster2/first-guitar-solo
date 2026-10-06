import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SupportForm from './SupportForm'

export const metadata: Metadata = {
  title: 'Support — First Guitar Solo',
  description: 'Get help with your First Guitar Solo program. Contact us for technical issues, payment questions, or lesson help.',
  openGraph: {
    title: 'Support — First Guitar Solo',
    description: 'Get help with your First Guitar Solo program.',
    url: 'https://firstguitarsolo.com/support',
  },
}

export default async function SupportPage() {
  const session = await getServerSession(authOptions)
  const isLoggedIn = !!session?.user
  const email = session?.user?.email ?? undefined

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh' }}>
      <Navbar />

      <main id="main-content" className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <svg width="24" height="30" viewBox="0 0 60 72" fill="#f59e0b" aria-hidden="true">
              <path d="M30 0 C50 0 60 12 60 24 C60 48 30 72 30 72 C30 72 0 48 0 24 C0 12 10 0 30 0Z"/>
            </svg>
            <span
              style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}
            >
              Student Support
            </span>
          </div>
          <h1
            style={{ color: '#ffffff', fontWeight: 900, fontSize: '2.5rem', textTransform: 'uppercase', lineHeight: 1.1 }}
            className="mb-3"
          >
            Need Help?
          </h1>
          <p style={{ color: '#a3a3a3', fontSize: '1rem', lineHeight: 1.6 }}>
            Fill out the form below and we&apos;ll get back to you within 24 hours.
          </p>
          {isLoggedIn && email && (
            <p style={{ color: '#525252', fontSize: '0.8rem', marginTop: 8 }}>
              Logged in as <span style={{ color: '#a3a3a3' }}>{email}</span>
            </p>
          )}
        </div>

        {/* Form card */}
        <div
          style={{
            backgroundColor: '#111111',
            border: '1px solid #1f1f1f',
            borderRadius: 16,
            padding: '32px',
          }}
        >
          <SupportForm defaultEmail={email} isLoggedIn={isLoggedIn} />
        </div>

        {/* Response time note */}
        <p style={{ color: '#525252', fontSize: '0.78rem', textAlign: 'center', marginTop: 20 }}>
          Typical response time: within 24 hours, Mon–Fri.
        </p>
      </main>

      <Footer />
    </div>
  )
}
