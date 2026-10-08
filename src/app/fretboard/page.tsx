'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import InteractiveFretboard from '@/components/InteractiveFretboard'

type OverlayMode = 'none' | 'pentatonic-minor' | 'pentatonic-major' | 'blues' | 'major' | 'minor'

const ALL_NOTES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']

const OVERLAY_OPTIONS: { value: OverlayMode; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'pentatonic-minor', label: 'Penta Minor' },
  { value: 'pentatonic-major', label: 'Penta Major' },
  { value: 'blues', label: 'Blues' },
  { value: 'major', label: 'Major' },
  { value: 'minor', label: 'Minor' },
]

const INFO_CARDS = [
  {
    icon: '♩',
    title: 'Click any note to hear it',
    body: 'Every circle on the fretboard is playable. Click to hear a guitar-like tone at the exact frequency of that note.',
  },
  {
    icon: '◎',
    title: 'Toggle scales to see patterns',
    body: 'Select a root note and scale type. Amber dots show every note in the scale across all 15 frets.',
  },
  {
    icon: '●',
    title: 'Amber = in key, larger = root',
    body: 'Bigger circles with a white border mark the root note. Smaller amber circles are the other scale tones.',
  },
]

const QUICK_REF_STRINGS = [
  { name: 'e (1st)', note: 'E4', color: '#f59e0b' },
  { name: 'B (2nd)', note: 'B3', color: '#fde68a' },
  { name: 'G (3rd)', note: 'G3', color: '#86efac' },
  { name: 'D (4th)', note: 'D3', color: '#93c5fd' },
  { name: 'A (5th)', note: 'A2', color: '#c4b5fd' },
  { name: 'E (6th)', note: 'E2', color: '#fb923c' },
]

const QUICK_REF_MARKERS = [
  { fret: 3, label: 'Fret 3' },
  { fret: 5, label: 'Fret 5' },
  { fret: 7, label: 'Fret 7' },
  { fret: 9, label: 'Fret 9' },
  { fret: 12, label: 'Fret 12 (octave)', double: true },
]

export default function FretboardPage() {
  const [rootNote, setRootNote] = useState('A')
  const [overlayMode, setOverlayMode] = useState<OverlayMode>('pentatonic-minor')
  const [showNoteNames, setShowNoteNames] = useState(true)
  const [showFretNumbers, setShowFretNumbers] = useState(true)

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#e5e5e5' }}>
      <Navbar />

      <main id="main-content" style={{ maxWidth: 960, margin: '0 auto', padding: '40px 16px 80px' }}>

        {/* ── Page header ──────────────────────────────── */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              color: '#ffffff',
              marginBottom: 8,
              letterSpacing: '0.03em',
            }}
          >
            Fretboard Explorer
          </h1>
          <p style={{ color: '#a3a3a3', fontSize: '1rem', lineHeight: 1.6, maxWidth: 560 }}>
            Click any note to hear it. Overlay a scale to see every in-key position across all 15 frets.
          </p>
        </div>

        {/* ── Control panel ────────────────────────────── */}
        <div
          style={{
            backgroundColor: '#111111',
            border: '1px solid #1f1f1f',
            borderRadius: 12,
            padding: '20px 24px',
            marginBottom: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {/* Root note */}
          <div>
            <p
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#525252',
                marginBottom: 10,
              }}
            >
              Root Note
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {ALL_NOTES.map((note) => (
                <button
                  key={note}
                  onClick={() => setRootNote(note)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 999,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: rootNote === note ? '1px solid #f59e0b' : '1px solid #262626',
                    backgroundColor: rootNote === note ? 'rgba(245,158,11,0.15)' : 'transparent',
                    color: rootNote === note ? '#f59e0b' : '#a3a3a3',
                    transition: 'all 0.12s ease',
                  }}
                >
                  {note}
                </button>
              ))}
            </div>
          </div>

          {/* Scale overlay */}
          <div>
            <p
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#525252',
                marginBottom: 10,
              }}
            >
              Scale Overlay
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
              {OVERLAY_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setOverlayMode(value)}
                  style={{
                    padding: '5px 14px',
                    borderRadius: 999,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: overlayMode === value ? '1px solid #f59e0b' : '1px solid #262626',
                    backgroundColor: overlayMode === value ? 'rgba(245,158,11,0.15)' : 'transparent',
                    color: overlayMode === value ? '#f59e0b' : '#a3a3a3',
                    transition: 'all 0.12s ease',
                  }}
                >
                  {label}
                </button>
              ))}

              {/* "Learn this scale" link */}
              {overlayMode === 'pentatonic-minor' && (
                <Link
                  href="/lesson/7"
                  style={{
                    marginLeft: 8,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#f59e0b',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    opacity: 0.9,
                  }}
                >
                  Learn this scale →
                </Link>
              )}
            </div>
          </div>

          {/* Toggles */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {[
              { label: 'Show note names', value: showNoteNames, setter: setShowNoteNames },
              { label: 'Show fret numbers', value: showFretNumbers, setter: setShowFretNumbers },
            ].map(({ label, value, setter }) => (
              <button
                key={label}
                onClick={() => setter((v) => !v)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '6px 14px',
                  borderRadius: 8,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid #262626',
                  backgroundColor: value ? 'rgba(245,158,11,0.1)' : 'transparent',
                  color: value ? '#f59e0b' : '#6b7280',
                  transition: 'all 0.12s ease',
                }}
              >
                {/* Toggle pill */}
                <span
                  style={{
                    display: 'inline-block',
                    width: 32,
                    height: 18,
                    borderRadius: 999,
                    backgroundColor: value ? '#f59e0b' : '#2a2a2a',
                    position: 'relative',
                    flexShrink: 0,
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: 2,
                      left: value ? 16 : 2,
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      transition: 'left 0.15s ease',
                    }}
                  />
                </span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Fretboard ────────────────────────────────── */}
        <div
          style={{
            backgroundColor: '#111111',
            border: '1px solid #1f1f1f',
            borderRadius: 12,
            padding: '20px 16px',
            marginBottom: 32,
          }}
        >
          <InteractiveFretboard
            overlayMode={overlayMode}
            rootNote={rootNote}
            showNoteNames={showNoteNames}
            showFretNumbers={showFretNumbers}
          />
        </div>

        {/* ── How to use cards ─────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16,
            marginBottom: 40,
          }}
        >
          {INFO_CARDS.map((card) => (
            <div
              key={card.title}
              style={{
                backgroundColor: '#111111',
                border: '1px solid #1f1f1f',
                borderRadius: 10,
                padding: '18px 20px',
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: 10, color: '#f59e0b' }}>
                {card.icon}
              </div>
              <p style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.875rem', marginBottom: 6 }}>
                {card.title}
              </p>
              <p style={{ color: '#a3a3a3', fontSize: '0.8rem', lineHeight: 1.6 }}>
                {card.body}
              </p>
            </div>
          ))}
        </div>

        {/* ── Quick reference ──────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
          }}
        >
          {/* String names */}
          <div
            style={{
              backgroundColor: '#111111',
              border: '1px solid #1f1f1f',
              borderRadius: 10,
              padding: '18px 20px',
            }}
          >
            <p
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#525252',
                marginBottom: 14,
              }}
            >
              Open String Tuning
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {QUICK_REF_STRINGS.map(({ name, note, color }) => (
                <div
                  key={name}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: '#a3a3a3', fontFamily: 'monospace' }}>
                    {name}
                  </span>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color,
                      fontFamily: 'monospace',
                    }}
                  >
                    {note}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Fret markers */}
          <div
            style={{
              backgroundColor: '#111111',
              border: '1px solid #1f1f1f',
              borderRadius: 10,
              padding: '18px 20px',
            }}
          >
            <p
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#525252',
                marginBottom: 14,
              }}
            >
              Fret Markers
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {QUICK_REF_MARKERS.map(({ fret, label, double: isDouble }) => (
                <div
                  key={fret}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span style={{ fontSize: '0.8rem', color: '#a3a3a3' }}>{label}</span>
                  <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    {isDouble ? (
                      <>
                        <span
                          style={{
                            display: 'inline-block',
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: '#4a4a38',
                          }}
                        />
                        <span
                          style={{
                            display: 'inline-block',
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: '#4a4a38',
                          }}
                        />
                      </>
                    ) : (
                      <span
                        style={{
                          display: 'inline-block',
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#4a4a38',
                        }}
                      />
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
