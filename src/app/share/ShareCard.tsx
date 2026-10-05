'use client'

import { useState } from 'react'

interface ShareCardProps {
  name: string
  completedAt: string
}

export default function ShareCard({ name, completedAt }: ShareCardProps) {
  const [copied, setCopied] = useState(false)

  const completionDate = new Date(completedAt)
  const formattedDate = completionDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <div style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-widest mb-4">
          Program Complete
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase mb-4">
          Share Your Achievement
        </h1>
        <p style={{ color: '#a3a3a3' }} className="text-sm">
          Take a screenshot of the card below to share it.
        </p>
      </div>

      {/* Shareable card */}
      <div
        id="completion-card"
        style={{
          backgroundColor: '#111111',
          border: '2px solid #f59e0b',
          borderRadius: 16,
          padding: '48px 40px',
          textAlign: 'center',
        }}
      >
        {/* Top label */}
        <div
          style={{
            backgroundColor: '#f59e0b',
            color: '#000',
            display: 'inline-block',
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: '4px 12px',
            borderRadius: 4,
            marginBottom: 32,
          }}
        >
          Sixth String Labs
        </div>

        {/* Guitar icon */}
        <div style={{ fontSize: 48, marginBottom: 24 }}>🎸</div>

        {/* Main heading */}
        <h2
          style={{
            color: '#ffffff',
            fontSize: 28,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            marginBottom: 8,
          }}
        >
          I played my first
        </h2>
        <h2
          style={{
            color: '#f59e0b',
            fontSize: 36,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            marginBottom: 24,
          }}
        >
          Guitar Solo.
        </h2>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #262626', marginBottom: 24 }} />

        {/* Name */}
        <p style={{ color: '#ffffff', fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{name}</p>
        <p style={{ color: '#a3a3a3', fontSize: 13, marginBottom: 24 }}>Completed on {formattedDate}</p>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
          {['30 days', 'Blues-Rock', 'A minor pentatonic'].map((tag) => (
            <span
              key={tag}
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #262626',
                color: '#a3a3a3',
                fontSize: 11,
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: 4,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <p style={{ color: '#525252', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          First Guitar Solo &bull; Sixth String Labs
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
        <button
          onClick={copyLink}
          style={{
            backgroundColor: copied ? '#22c55e' : '#f59e0b',
            color: '#000',
            border: 'none',
          }}
          className="text-sm font-black px-6 py-3 rounded uppercase tracking-wider hover:opacity-90 transition-all"
        >
          {copied ? 'Link Copied!' : 'Copy Link'}
        </button>
        <div
          style={{
            backgroundColor: '#111111',
            border: '1px solid #262626',
            color: '#a3a3a3',
          }}
          className="text-xs px-6 py-3 rounded text-center leading-relaxed"
        >
          To download: take a screenshot of the card above.
        </div>
      </div>
    </main>
  )
}
