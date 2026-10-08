'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => { console.error(error) }, [error])

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
      {/* Warning icon */}
      <div style={{ fontSize: '3rem', marginBottom: 16, lineHeight: 1 }}>⚠️</div>
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
          marginBottom: process.env.NODE_ENV === 'development' ? '16px' : '40px',
          maxWidth: '420px',
        }}
      >
        An unexpected error occurred. Please try again or go to your dashboard.
        {error.digest && (
          <span style={{ display: 'block', marginTop: '8px', fontSize: '12px', color: '#525252' }}>
            Error ID: {error.digest}
          </span>
        )}
      </p>
      {process.env.NODE_ENV === 'development' && error.message && (
        <pre
          style={{
            fontSize: '12px',
            color: '#ef4444',
            backgroundColor: 'rgba(239,68,68,0.05)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 8,
            padding: '12px 16px',
            maxWidth: '560px',
            width: '100%',
            textAlign: 'left',
            overflowX: 'auto',
            marginBottom: '40px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {error.message}
        </pre>
      )}
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
          Try Again
        </button>
        <Link
          href="/dashboard"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#111111',
            color: '#d4d4d4',
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
    </div>
  )
}
