'use client'

import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div
      style={{
        backgroundColor: '#0a0a0a',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: 'clamp(24px, 5vw, 36px)',
          fontWeight: 700,
          color: '#ffffff',
          marginBottom: '12px',
        }}
      >
        Something went wrong
      </h1>
      <p
        style={{
          fontSize: '16px',
          color: '#737373',
          marginBottom: '40px',
          maxWidth: '420px',
        }}
      >
        We&apos;re sorry — an unexpected error occurred. Please try again or
        return home.
        {error.digest && (
          <span style={{ display: 'block', marginTop: '8px', fontSize: '12px', color: '#525252' }}>
            Error ID: {error.digest}
          </span>
        )}
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
        <button
          onClick={reset}
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#f59e0b',
            color: '#000000',
            fontWeight: 700,
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '15px',
          }}
        >
          Try again
        </button>
        <Link
          href="/"
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
          Go home
        </Link>
      </div>
    </div>
  )
}
