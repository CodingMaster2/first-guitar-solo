'use client'

import { useState } from 'react'
import confetti from 'canvas-confetti'
import Link from 'next/link'

interface Props {
  userName: string
}

export default function BonusLessonClient({ userName }: Props) {
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleComplete = async () => {
    if (completed || loading) return
    setLoading(true)
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day: 31 }),
      })
    } catch {
      // ignore - just celebrate anyway
    }
    setCompleted(true)
    setLoading(false)
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#f59e0b', '#fde68a', '#ffffff', '#d97706'],
    })
    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 60,
        spread: 80,
        origin: { x: 0, y: 0.6 },
        colors: ['#f59e0b', '#fde68a'],
      })
      confetti({
        particleCount: 100,
        angle: 120,
        spread: 80,
        origin: { x: 1, y: 0.6 },
        colors: ['#f59e0b', '#fde68a'],
      })
    }, 400)
  }

  return (
    <div>
      {/* Tab notation section */}
      <div
        style={{
          backgroundColor: '#111111',
          border: '1px solid #262626',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            color: '#f59e0b',
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: 16,
          }}
        >
          The Graduation Solo — Full Tab
        </h2>
        <p style={{ color: '#a3a3a3', fontSize: '0.875rem', marginBottom: 20 }}>
          This solo uses every technique you&apos;ve learned: slides, hammer-ons, pull-offs, bends, vibrato, and pentatonic phrasing. Take it slow — you&apos;ve earned it.
        </p>
        <pre
          style={{
            backgroundColor: '#0a0a0a',
            border: '1px solid #1f1f1f',
            borderRadius: 8,
            padding: 20,
            fontSize: '0.8rem',
            color: '#d1d5db',
            overflowX: 'auto',
            lineHeight: 1.8,
            fontFamily: 'Courier New, monospace',
          }}
        >{`  The Graduation Solo (Key of A Minor, 120 BPM)
  Measures 1-2: Opening Statement

e |-----------------------------8b10---8----|
B |---8--10--8----8h10p8-----------|--------|
G |--------9----9-------9--7---7---|--7-----|
D |--------------------------------|--------|
A |--------------------------------|--------|
E |--------------------------------|--------|

  Measures 3-4: Pentatonic Run

e |---5---8---5---8-------5---------|
B |--5---5---7---8---8--8---8--5---|
G |-5---5---7---7----7-------5-----|
D |--------------------------------|
A |--------------------------------|
E |--------------------------------|

  Measures 5-6: Slide & Bend

e |------------------------------10b12~------|
B |---8--/10--8----8h10p8--------|------8---|
G |--------9-----9--------9--9b11---------7|
D |----------------------------------------|
A |----------------------------------------|
E |----------------------------------------|

  Measures 7-8: Closing Statement (Vibrato Finish)

e |--8--10--8----|
B |----------10~~|
G |--------------|
D |--------------|
A |--------------|
E |--------------|

  Legend: h=hammer-on  p=pull-off  b=bend  /=slide up  \\=slide down  ~=vibrato`}</pre>

        <div className="mt-5 space-y-3">
          <div style={{ borderLeft: '3px solid #f59e0b', paddingLeft: 12 }}>
            <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.875rem', marginBottom: 4 }}>Tips</p>
            <ul style={{ color: '#a3a3a3', fontSize: '0.8rem', lineHeight: 1.7, listStyle: 'none', padding: 0, margin: 0 }}>
              <li>• Start at 60 BPM — nail the notes before adding speed</li>
              <li>• The bend in measure 3 goes up a full step (b12 from fret 10)</li>
              <li>• Add real vibrato on that final held note — let it sing</li>
              <li>• Record yourself at least once. You&apos;ll be surprised how good it sounds.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Completion section */}
      {completed ? (
        <div
          style={{
            background: 'linear-gradient(135deg, #1a1200 0%, #2d1f00 100%)',
            border: '2px solid #f59e0b',
            borderRadius: 12,
            padding: 32,
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '3rem', marginBottom: 12 }}>&#127928;</p>
          <p style={{ color: '#f59e0b', fontWeight: 900, fontSize: '1.5rem', marginBottom: 8 }}>
            You did it, {userName}!
          </p>
          <p style={{ color: '#a3a3a3', fontSize: '0.875rem', marginBottom: 24, lineHeight: 1.6 }}>
            You completed the entire First Guitar Solo program including the graduation bonus. +100 XP awarded.
            You are officially a lead guitarist.
          </p>
          <Link
            href="/progress"
            style={{
              backgroundColor: '#f59e0b',
              color: '#000000',
              padding: '12px 32px',
              borderRadius: 8,
              fontWeight: 900,
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'inline-block',
              textDecoration: 'none',
            }}
          >
            View Your Progress &#8594;
          </Link>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: '#111111',
            border: '1px solid #262626',
            borderRadius: 12,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <p style={{ color: '#a3a3a3', fontSize: '0.875rem', textAlign: 'center' }}>
            Played through the solo? Mark it complete to claim your +100 XP and graduate.
          </p>
          <button
            onClick={handleComplete}
            disabled={loading}
            style={{
              backgroundColor: '#f59e0b',
              color: '#000000',
              padding: '12px 36px',
              borderRadius: 8,
              fontWeight: 900,
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Recording...' : 'Complete The Graduation Solo (+100 XP)'}
          </button>
        </div>
      )}
    </div>
  )
}
