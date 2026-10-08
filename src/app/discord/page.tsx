import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DiscordWaitlist from './DiscordWaitlist'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Discord Community — First Guitar Solo',
}

export default function DiscordPage() {
  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Discord icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              backgroundColor: '#5865F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 900,
              color: '#ffffff',
            }}
          >
            D
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ color: '#ffffff', fontSize: '2rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '0.75rem' }}>
            Discord Community
          </h1>
          <p style={{ color: '#a3a3a3', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            Our Discord server is launching soon!
          </p>
          <p style={{ color: '#525252', fontSize: '0.875rem' }}>
            Join the waitlist to be notified when we go live.
          </p>
        </div>

        {/* Waitlist form card */}
        <div
          style={{
            backgroundColor: '#111111',
            border: '1px solid #262626',
            borderRadius: '0.75rem',
            padding: '2rem',
            marginBottom: '2rem',
          }}
        >
          <h2 style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
            Get Notified
          </h2>
          <DiscordWaitlist />
        </div>

        {/* What to expect */}
        <div
          style={{
            backgroundColor: '#111111',
            border: '1px solid #1f1f1f',
            borderRadius: '0.75rem',
            padding: '1.5rem',
          }}
        >
          <h2 style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
            What to Expect
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { icon: '🎸', text: 'Share your progress recordings' },
              { icon: '🤝', text: 'Find accountability partners' },
              { icon: '💬', text: 'Ask questions and get peer help' },
              { icon: '🏆', text: 'Community challenges and events' },
            ].map((item) => (
              <li key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                <span style={{ color: '#a3a3a3', fontSize: '0.875rem' }}>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  )
}
