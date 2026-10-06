'use client'

import { useState, useRef } from 'react'

interface SoloShareButtonsProps {
  userId: string
  name: string
  style: string | null
  guitarHero: string | null
  /** The tab text, for the canvas download */
  soloText: string | null
  soloCompletedAt: string | null
}

export default function SoloShareButtons({
  userId,
  name,
  style,
  guitarHero,
  soloText,
  soloCompletedAt,
}: SoloShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const soloUrl = `https://firstguitarsolo.com/solo/${userId}`
  const tweetText = `I just played my first guitar solo in 30 days 🎸`
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(soloUrl)}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(soloUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement('textarea')
      el.value = soloUrl
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    if (downloading) return
    setDownloading(true)

    try {
      const canvas = document.createElement('canvas')
      const W = 1200
      const H = 630
      canvas.width = W
      canvas.height = H
      const ctx = canvas.getContext('2d')
      if (!ctx) { setDownloading(false); return }

      // Background
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, W, H)

      // Amber accent bar top
      ctx.fillStyle = '#f59e0b'
      ctx.fillRect(0, 0, W, 6)

      // Border
      ctx.strokeStyle = '#1f1f1f'
      ctx.lineWidth = 1
      ctx.strokeRect(20, 20, W - 40, H - 40)

      // Title
      ctx.fillStyle = '#f59e0b'
      ctx.font = 'bold 18px "Courier New"'
      ctx.textAlign = 'center'
      ctx.fillText('🎸 FIRST GUITAR SOLO 🎸', W / 2, 70)

      // Divider
      ctx.fillStyle = '#262626'
      ctx.fillRect(60, 85, W - 120, 1)

      // "This certifies that"
      ctx.fillStyle = '#737373'
      ctx.font = '16px Georgia, serif'
      ctx.fillText('This certifies that', W / 2, 120)

      // Name
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 48px Georgia, serif'
      ctx.fillText(name, W / 2, 180)

      // Style line
      ctx.fillStyle = '#a3a3a3'
      ctx.font = '16px Georgia, serif'
      const styleLine = [
        'composed and performed their first guitar solo',
        style ? `in the style of ${style}` : null,
        guitarHero ? `inspired by ${guitarHero}` : null,
      ].filter(Boolean).join(' · ')
      ctx.fillText(styleLine, W / 2, 220)

      // Divider
      ctx.fillStyle = '#262626'
      ctx.fillRect(60, 240, W - 120, 1)

      // Tab preview (first 6 lines)
      if (soloText) {
        const lines = soloText.split('\n').filter((l) => l.trim()).slice(0, 8)
        ctx.font = '14px "Courier New"'
        ctx.textAlign = 'left'
        let y = 280
        for (const line of lines) {
          const parts = line.match(/^([eBGDAE])\|(.*)$/)
          if (parts) {
            ctx.fillStyle = '#f59e0b'
            ctx.fillText(parts[1] + '|', 80, y)
            ctx.fillStyle = '#d4d4d4'
            ctx.fillText(parts[2].slice(0, 100), 106, y)
          } else {
            ctx.fillStyle = '#525252'
            ctx.fillText(line.slice(0, 100), 80, y)
          }
          y += 22
        }
      }

      // Footer
      ctx.fillStyle = '#262626'
      ctx.fillRect(60, H - 80, W - 120, 1)

      ctx.fillStyle = '#525252'
      ctx.font = '13px "Courier New"'
      ctx.textAlign = 'center'
      const footerParts = [
        soloCompletedAt ? `Graduated ${new Date(soloCompletedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : null,
        'firstguitarsolo.com',
      ].filter(Boolean).join(' · ')
      ctx.fillText(footerParts, W / 2, H - 45)

      // Download
      const link = document.createElement('a')
      link.download = `${name.replace(/\s+/g, '-').toLowerCase()}-first-guitar-solo.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setDownloading(false)
    }
  }

  const btnBase: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 20px',
    borderRadius: 8,
    fontSize: '0.85rem',
    fontWeight: 700,
    cursor: 'pointer',
    textDecoration: 'none',
    border: 'none',
    transition: 'opacity 0.2s ease',
  }

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        {/* Share on X */}
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...btnBase, backgroundColor: '#1a1a1a', color: '#ffffff', border: '1px solid #262626' }}
          className="hover:opacity-80"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.763l7.633-8.722L2.25 2.25h6.07l4.188 5.539zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Share on X
        </a>

        {/* Copy link */}
        <button
          onClick={handleCopy}
          style={{
            ...btnBase,
            backgroundColor: copied ? '#1a3300' : '#1a1a1a',
            color: copied ? '#86efac' : '#ffffff',
            border: `1px solid ${copied ? '#22c55e40' : '#262626'}`,
          }}
          className="hover:opacity-80"
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy link
            </>
          )}
        </button>

        {/* Download as image */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          style={{
            ...btnBase,
            backgroundColor: '#1a1a1a',
            color: downloading ? '#525252' : '#f59e0b',
            border: '1px solid #262626',
            cursor: downloading ? 'not-allowed' : 'pointer',
          }}
          className="hover:opacity-80"
        >
          {downloading ? (
            'Generating…'
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download image
            </>
          )}
        </button>
      </div>
    </>
  )
}
