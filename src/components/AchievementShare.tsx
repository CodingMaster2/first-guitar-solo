'use client'

import { useState } from 'react'

interface AchievementData {
  name: string
  description: string
  xpReward: number
}

interface Props {
  achievement: AchievementData
  userName: string
}

async function generateAchievementImage(achievement: AchievementData, userName: string): Promise<Blob | null> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 340
    const ctx = canvas.getContext('2d')
    if (!ctx) { resolve(null); return }

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 600, 340)
    bgGrad.addColorStop(0, '#0a0a0a')
    bgGrad.addColorStop(1, '#1a0f00')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, 600, 340)

    // Amber border
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, 598, 338)

    // Guitar pick decoration (top-right)
    ctx.save()
    ctx.translate(520, 50)
    ctx.rotate(Math.PI / 6)
    ctx.fillStyle = 'rgba(245, 158, 11, 0.12)'
    ctx.beginPath()
    ctx.moveTo(0, -45)
    ctx.bezierCurveTo(32, -45, 55, -12, 55, 28)
    ctx.bezierCurveTo(55, 65, 0, 88, 0, 88)
    ctx.bezierCurveTo(0, 88, -55, 65, -55, 28)
    ctx.bezierCurveTo(-55, -12, -32, -45, 0, -45)
    ctx.fill()
    ctx.restore()

    // Stars row
    ctx.fillStyle = '#f59e0b'
    ctx.font = 'bold 22px Arial, sans-serif'
    let sx = 40
    for (let i = 0; i < 5; i++) {
      ctx.fillText('★', sx, 72)
      sx += 30
    }

    // Brand label
    ctx.fillStyle = '#525252'
    ctx.font = '11px Arial, sans-serif'
    ctx.fillText('FIRST GUITAR SOLO', 40, 108)

    // Achievement name
    ctx.fillStyle = '#f59e0b'
    ctx.font = 'bold 30px Arial, sans-serif'
    ctx.fillText(achievement.name, 40, 158)

    // Description (wrap at 50 chars)
    ctx.fillStyle = '#a3a3a3'
    ctx.font = '15px Arial, sans-serif'
    const desc = achievement.description.length > 55
      ? achievement.description.substring(0, 52) + '...'
      : achievement.description
    ctx.fillText(desc, 40, 190)

    // XP pill background
    ctx.fillStyle = '#1a1200'
    ctx.beginPath()
    ctx.roundRect(40, 215, 110, 32, 8)
    ctx.fill()
    ctx.strokeStyle = '#78350f'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.roundRect(40, 215, 110, 32, 8)
    ctx.stroke()

    // XP text
    ctx.fillStyle = '#f59e0b'
    ctx.font = 'bold 13px Arial, sans-serif'
    ctx.fillText(`+${achievement.xpReward} XP`, 60, 236)

    // Divider
    ctx.strokeStyle = '#1f1f1f'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(40, 268)
    ctx.lineTo(560, 268)
    ctx.stroke()

    // Username
    ctx.fillStyle = '#a3a3a3'
    ctx.font = '13px Arial, sans-serif'
    ctx.fillText(`Earned by ${userName}`, 40, 295)

    // Date
    ctx.fillStyle = '#525252'
    ctx.font = '11px Arial, sans-serif'
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    ctx.fillText(dateStr, 40, 316)

    canvas.toBlob((blob) => resolve(blob), 'image/png')
  })
}

export default function AchievementShare({ achievement, userName }: Props) {
  const [open, setOpen] = useState(false)
  const [copying, setCopying] = useState(false)
  const [copyDone, setCopyDone] = useState(false)

  const handleDownload = async () => {
    const blob = await generateAchievementImage(achievement, userName)
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${achievement.name.replace(/\s+/g, '-').toLowerCase()}-achievement.png`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopy = async () => {
    setCopying(true)
    const blob = await generateAchievementImage(achievement, userName)
    if (!blob) { setCopying(false); return }
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setCopyDone(true)
      setTimeout(() => setCopyDone(false), 2000)
    } catch {
      // Fallback: download instead
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${achievement.name.replace(/\s+/g, '-').toLowerCase()}-achievement.png`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setCopying(false)
    }
  }

  const handleTwitter = () => {
    const text = encodeURIComponent(
      `Just earned "${achievement.name}" on First Guitar Solo! ${achievement.description} #FirstGuitarSolo #LearnGuitar`
    )
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'noopener,noreferrer')
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          backgroundColor: '#1a1200',
          border: '1px solid #78350f',
          color: '#f59e0b',
          fontSize: '0.7rem',
          padding: '4px 10px',
          borderRadius: 6,
          fontWeight: 700,
          cursor: 'pointer',
          marginTop: 8,
          display: 'block',
        }}
      >
        Share
      </button>
    )
  }

  return (
    <div
      style={{
        backgroundColor: '#0a0a0a',
        border: '1px solid #262626',
        borderRadius: 10,
        padding: 16,
        marginTop: 8,
      }}
    >
      {/* Preview card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0f00 100%)',
          border: '1px solid #f59e0b',
          borderRadius: 10,
          padding: 16,
          marginBottom: 12,
        }}
      >
        <div style={{ color: '#f59e0b', fontSize: '1rem', marginBottom: 6 }}>★★★★★</div>
        <p style={{ color: '#525252', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
          First Guitar Solo
        </p>
        <p style={{ color: '#ffffff', fontWeight: 900, fontSize: '1rem', marginBottom: 4 }}>{achievement.name}</p>
        <p style={{ color: '#a3a3a3', fontSize: '0.8rem', marginBottom: 10 }}>{achievement.description}</p>
        <span
          style={{
            backgroundColor: '#1a1200',
            border: '1px solid #78350f',
            color: '#f59e0b',
            fontSize: '0.7rem',
            padding: '3px 8px',
            borderRadius: 5,
            fontWeight: 700,
          }}
        >
          +{achievement.xpReward} XP
        </span>
        <p style={{ color: '#525252', fontSize: '0.7rem', marginTop: 10 }}>Earned by {userName}</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <button
          onClick={handleDownload}
          style={{
            backgroundColor: '#f59e0b',
            color: '#000000',
            padding: '6px 14px',
            borderRadius: 6,
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Download PNG
        </button>
        <button
          onClick={handleCopy}
          disabled={copying}
          style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #262626',
            color: copyDone ? '#22c55e' : '#a3a3a3',
            padding: '6px 14px',
            borderRadius: 6,
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            cursor: 'pointer',
          }}
        >
          {copyDone ? '✓ Copied' : copying ? 'Copying...' : 'Copy Image'}
        </button>
        <button
          onClick={handleTwitter}
          className="cursor-pointer"
          style={{
            backgroundColor: '#1a1a1a',
            color: '#60a5fa',
            padding: '6px 14px',
            borderRadius: 6,
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            border: '1px solid #1d4ed8',
          }}
        >
          Share on X
        </button>
        <button
          onClick={() => setOpen(false)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#525252',
            fontSize: '0.7rem',
            cursor: 'pointer',
            marginLeft: 'auto',
          }}
        >
          Close
        </button>
      </div>
    </div>
  )
}
