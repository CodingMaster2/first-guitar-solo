import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function NotFound() {
  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: 'clamp(80px, 20vw, 128px)',
            fontWeight: 900,
            color: '#f59e0b',
            lineHeight: 1,
            margin: 0,
          }}
        >
          404
        </p>
        <h1
          style={{
            fontSize: 'clamp(24px, 5vw, 36px)',
            fontWeight: 700,
            color: '#ffffff',
            marginTop: '16px',
            marginBottom: '12px',
          }}
        >
          Page not found
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: '#737373',
            marginBottom: '40px',
            maxWidth: '400px',
          }}
        >
          This page doesn&apos;t exist or has moved.
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#f59e0b',
              color: '#000000',
              fontWeight: 700,
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '15px',
            }}
          >
            ← Back to Home
          </Link>
          <Link
            href="/dashboard"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: '#ffffff',
              fontWeight: 700,
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '15px',
              border: '1px solid #262626',
            }}
          >
            Go to Dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}
