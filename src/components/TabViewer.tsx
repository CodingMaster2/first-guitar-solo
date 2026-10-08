'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'

interface TabViewerProps {
  tabContent: string
  bpm: number
  title: string
}

const STRING_COLORS: Record<string, string> = {
  'e|': '#fde68a',
  'B|': '#86efac',
  'G|': '#93c5fd',
  'D|': '#d8b4fe',
  'A|': '#fdba74',
  'E|': '#f87171',
}

const TECHNIQUE_CHARS = new Set(['b', 'h', 'p', '/', '~', '\\'])

function colorizeTabLine(line: string, lineIndex: number): ReactNode {
  const label = Object.keys(STRING_COLORS).find(k => line.startsWith(k))

  if (!label) {
    return (
      <span key={lineIndex} style={{ display: 'block', color: '#525252' }}>
        {line}
      </span>
    )
  }

  const labelColor = STRING_COLORS[label]
  const rest = line.slice(label.length)

  // Split on technique characters while keeping delimiters
  const tokens = rest.split(/(b|h|p|\/|~|\\)/)

  return (
    <span key={lineIndex} style={{ display: 'block' }}>
      <span style={{ color: labelColor, fontWeight: 700 }}>{label}</span>
      {tokens.map((token, i) =>
        TECHNIQUE_CHARS.has(token) ? (
          <span key={i} style={{ color: '#f59e0b', fontWeight: 700 }}>{token}</span>
        ) : (
          <span key={i} style={{ color: '#d4d4d4' }}>{token}</span>
        )
      )}
    </span>
  )
}

export default function TabViewer({ tabContent, bpm, title }: TabViewerProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tabContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard not available — silently fail
    }
  }

  const lines = tabContent.split('\n')

  return (
    <div
      style={{
        background: '#0d0d0d',
        border: '1px solid #1f1f1f',
        borderRadius: 12,
        padding: 24,
        position: 'relative',
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <span
          style={{
            color: '#525252',
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          {title}
        </span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span
            style={{
              background: '#1a1a1a',
              border: '1px solid #262626',
              borderRadius: 6,
              padding: '4px 10px',
              color: '#f59e0b',
              fontSize: '0.8rem',
              fontFamily: "'Courier New', Courier, monospace",
            }}
          >
            ♩ = {bpm} BPM
          </span>
          <button
            onClick={handleCopy}
            style={{
              background: copied ? '#0d1a00' : '#111111',
              border: `1px solid ${copied ? '#2d5a00' : '#262626'}`,
              borderRadius: 6,
              padding: '4px 12px',
              color: copied ? '#86efac' : '#a3a3a3',
              fontSize: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {copied ? '✓ Copied' : 'Copy TAB'}
          </button>
        </div>
      </div>

      {/* TAB content */}
      <div
        style={{
          overflowX: 'auto',
          borderRadius: 6,
        }}
      >
        <pre
          style={{
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: 14,
            lineHeight: 1.8,
            margin: 0,
            whiteSpace: 'pre',
            minWidth: 'max-content',
          }}
        >
          {lines.map((line, i) => colorizeTabLine(line, i))}
        </pre>
      </div>

      {/* String color legend */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginTop: 16,
          flexWrap: 'wrap',
          borderTop: '1px solid #1a1a1a',
          paddingTop: 12,
        }}
      >
        {Object.entries(STRING_COLORS).map(([label, color]) => (
          <span
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.7rem',
              color: '#525252',
            }}
          >
            <span
              style={{
                fontFamily: "'Courier New', Courier, monospace",
                color,
                fontWeight: 700,
                fontSize: '0.75rem',
              }}
            >
              {label}
            </span>
            {label === 'e|' ? 'high e' : label === 'E|' ? 'low E' : label.slice(0, 1)}
          </span>
        ))}
        <span style={{ fontSize: '0.7rem', color: '#525252', marginLeft: 'auto' }}>
          <span style={{ color: '#f59e0b', fontWeight: 700, fontFamily: "'Courier New', Courier, monospace" }}>
            b h p / ~
          </span>{' '}
          = techniques
        </span>
      </div>
    </div>
  )
}
