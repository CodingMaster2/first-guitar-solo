'use client'

import { useState } from 'react'

export interface SoloConfig {
  style: string
  key: string
  mood: string
  difficulty: string
  bars: number
}

interface SoloForgeConfigProps {
  onGenerate: (config: SoloConfig) => void
  isLoading: boolean
}

const GUITARISTS = [
  'Eric Clapton',
  'Stevie Ray Vaughan',
  'Jimi Hendrix',
  'Jimmy Page',
  'Slash',
  'David Gilmour',
  'John Mayer',
  'BB King',
  'Angus Young',
  'Carlos Santana',
  'Mark Knopfler',
  'Gary Moore',
  'Joe Bonamassa',
  'Kirk Hammett',
  'Eddie Van Halen',
  'Buddy Guy',
  'Albert King',
  'Duane Allman',
  'Warren Haynes',
  'Derek Trucks',
]

const KEYS = [
  'A minor',
  'E minor',
  'D minor',
  'G minor',
  'C minor',
  'B minor',
  'A major',
  'E major',
  'D major',
  'G major',
  'C major',
  'A blues',
  'E blues',
  'G blues',
]

const MOODS = [
  { value: 'bluesy', label: 'Bluesy & Soulful', emoji: '😢' },
  { value: 'aggressive', label: 'Aggressive & Heavy', emoji: '🔥' },
  { value: 'emotional', label: 'Emotional & Melodic', emoji: '💫' },
  { value: 'funky', label: 'Funky & Groovy', emoji: '🕺' },
  { value: 'country', label: 'Country Twang', emoji: '🤠' },
  { value: 'jazz', label: 'Jazzy & Cool', emoji: '🎷' },
  { value: 'rock', label: 'Classic Rock Energy', emoji: '🎸' },
  { value: 'ethereal', label: 'Ethereal & Ambient', emoji: '🌟' },
]

const DIFFICULTIES = [
  {
    value: 'beginner',
    label: 'Beginner',
    desc: 'Simple phrases, mostly open positions',
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    desc: 'More techniques, wider range',
  },
]

const BARS_OPTIONS = [8, 12, 16]

export default function SoloForgeConfig({
  onGenerate,
  isLoading,
}: SoloForgeConfigProps) {
  const [style, setStyle] = useState('Eric Clapton')
  const [key, setKey] = useState('A minor')
  const [mood, setMood] = useState('bluesy')
  const [difficulty, setDifficulty] = useState('beginner')
  const [bars, setBars] = useState(12)

  const labelStyle: React.CSSProperties = {
    color: '#a3a3a3',
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 700,
    marginBottom: 10,
    display: 'block',
  }

  const selectStyle: React.CSSProperties = {
    background: '#0a0a0a',
    border: '1px solid #262626',
    borderRadius: 8,
    color: '#ffffff',
    padding: '10px 14px',
    fontSize: '0.9rem',
    width: '100%',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
  }

  return (
    <div
      style={{
        maxWidth: 560,
        margin: '0 auto',
        background: '#111111',
        border: '1px solid #1f1f1f',
        borderRadius: 16,
        padding: 32,
      }}
    >
      <span
        style={{
          color: '#f59e0b',
          fontSize: '0.7rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
        }}
      >
        Solo Forge
      </span>
      <h2
        style={{
          color: '#ffffff',
          fontSize: '1.4rem',
          fontWeight: 900,
          margin: '4px 0',
        }}
      >
        Configure Your Solo
      </h2>
      <p style={{ color: '#737373', fontSize: '0.85rem', marginBottom: 28, marginTop: 0 }}>
        Pick your influences and let the AI forge your custom solo
      </p>

      {/* Guitarist */}
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>Style / Guitarist Influence</label>
        <div
          style={{
            overflowX: 'auto',
            display: 'flex',
            gap: 8,
            paddingBottom: 4,
            scrollbarWidth: 'none',
          }}
        >
          {GUITARISTS.map((g) => (
            <button
              key={g}
              onClick={() => setStyle(g)}
              style={{
                flexShrink: 0,
                padding: '7px 14px',
                borderRadius: 20,
                border: `1px solid ${style === g ? '#f59e0b' : '#262626'}`,
                background: style === g ? 'rgba(245,158,11,0.12)' : '#0a0a0a',
                color: style === g ? '#f59e0b' : '#a3a3a3',
                fontSize: '0.8rem',
                fontWeight: style === g ? 700 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Key + Bars */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Key</label>
          <select
            value={key}
            onChange={(e) => setKey(e.target.value)}
            style={selectStyle}
          >
            {KEYS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
        <div style={{ flex: '0 0 130px' }}>
          <label style={labelStyle}>Length</label>
          <select
            value={bars}
            onChange={(e) => setBars(Number(e.target.value))}
            style={selectStyle}
          >
            {BARS_OPTIONS.map((b) => (
              <option key={b} value={b}>
                {b} bars
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mood */}
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>Mood / Feel</label>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 8,
          }}
        >
          {MOODS.map((m) => (
            <button
              key={m.value}
              onClick={() => setMood(m.value)}
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                border: `1px solid ${mood === m.value ? '#f59e0b' : '#262626'}`,
                background:
                  mood === m.value ? 'rgba(245,158,11,0.1)' : '#0a0a0a',
                color: mood === m.value ? '#f59e0b' : '#a3a3a3',
                fontSize: '0.8rem',
                fontWeight: mood === m.value ? 700 : 400,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div style={{ marginBottom: 28 }}>
        <label style={labelStyle}>Difficulty</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {DIFFICULTIES.map((d) => (
            <button
              key={d.value}
              onClick={() => setDifficulty(d.value)}
              style={{
                padding: '14px 16px',
                borderRadius: 10,
                border: `1px solid ${difficulty === d.value ? '#f59e0b' : '#262626'}`,
                background:
                  difficulty === d.value
                    ? 'rgba(245,158,11,0.08)'
                    : '#0a0a0a',
                color: '#ffffff',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  border: `2px solid ${difficulty === d.value ? '#f59e0b' : '#404040'}`,
                  background:
                    difficulty === d.value ? '#f59e0b' : 'transparent',
                  flexShrink: 0,
                  transition: 'all 0.15s',
                }}
              />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                  {d.label}
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: '#737373',
                    marginTop: 2,
                  }}
                >
                  {d.desc}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Forge button */}
      <button
        onClick={() => onGenerate({ style, key, mood, difficulty, bars })}
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: 10,
          border: 'none',
          background: isLoading ? '#7c6006' : '#f59e0b',
          color: '#000000',
          fontSize: '1rem',
          fontWeight: 900,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          transition: 'background 0.2s',
          letterSpacing: '0.02em',
        }}
      >
        {isLoading ? (
          <>
            <span
              style={{
                width: 18,
                height: 18,
                border: '2px solid rgba(0,0,0,0.25)',
                borderTop: '2px solid #000',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'sfSpin 0.8s linear infinite',
              }}
            />
            Forging Your Solo...
          </>
        ) : (
          <>🔨 Forge My Solo</>
        )}
      </button>
      <style>{`@keyframes sfSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
