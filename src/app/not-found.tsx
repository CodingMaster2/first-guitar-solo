import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function NotFound() {
  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: '0 16px', textAlign: 'center' }}>
        {/* Giant amber 404 */}
        <div style={{ fontSize: '8rem', fontWeight: 900, color: '#f59e0b', lineHeight: 1, marginBottom: 16, fontFamily: 'system-ui' }}>
          404
        </div>
        <h1 style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>
          Page not found
        </h1>
        <p style={{ color: '#737373', fontSize: '1rem', marginBottom: 32, maxWidth: 400 }}>
          Looks like you wandered off the fretboard. This page doesn&apos;t exist — but your first guitar solo does.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/" style={{ backgroundColor: '#f59e0b', color: '#000', fontWeight: 700, padding: '10px 24px', borderRadius: 8, fontSize: '0.875rem', textDecoration: 'none', display: 'inline-block' }}>
            Back to Home
          </Link>
          <Link href="/dashboard" style={{ backgroundColor: '#111111', color: '#d4d4d4', border: '1px solid #262626', padding: '10px 24px', borderRadius: 8, fontSize: '0.875rem', textDecoration: 'none', display: 'inline-block' }}>
            Go to Dashboard
          </Link>
        </div>
        {/* Guitar string decoration */}
        <div style={{ marginTop: 64, opacity: 0.15 }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} style={{ height: i * 0.5, backgroundColor: '#f59e0b', width: 200, marginBottom: 8, borderRadius: 1, margin: '4px auto' }} />
          ))}
        </div>
      </main>
    </div>
  )
}
