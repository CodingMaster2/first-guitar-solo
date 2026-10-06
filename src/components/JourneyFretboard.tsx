'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface LessonInfo {
  day: number
  title: string
}

interface JourneyFretboardProps {
  completedDays: number[]
  currentDay: number
  lessons: LessonInfo[]
}

interface TooltipState {
  x: number
  y: number
  text: string
}

// ─── SVG Layout Constants ─────────────────────────────────────────────────────

const SVG_W = 900
const SVG_H = 260
const PAD_L = 52   // left: space for string labels
const PAD_T = 38   // top: space for fret numbers
const PAD_R = 22   // right
const PAD_B = 14   // bottom

const FRET_W = SVG_W - PAD_L - PAD_R   // 826
const STRING_H = SVG_H - PAD_T - PAD_B // 208
const FRET_SPACING = FRET_W / 14       // gap between fret lines

// ─── Coordinate Helpers ───────────────────────────────────────────────────────

/** X position of a fret LINE (0 = nut, 14 = rightmost) */
const getFretX = (fret: number): number => PAD_L + (fret / 14) * FRET_W

/** X position of the NOTE SPACE for a given fret (midpoint between fret N-1 and fret N) */
const getNodeX = (fret: number): number => {
  if (fret === 0) return PAD_L + FRET_SPACING * 0.5  // between nut & fret 1
  return PAD_L + (fret - 0.5) * FRET_SPACING
}

/** Y position for a string (1=high e at top … 6=low E at bottom) */
const getStringY = (s: number): number => PAD_T + ((s - 1) / 5) * STRING_H

// ─── Fretboard Data ───────────────────────────────────────────────────────────

const STRING_LABELS = ['e', 'B', 'G', 'D', 'A', 'E'] // index 0 = string 1 (high e)
const STRING_WIDTHS = [0.7, 0.9, 1.1, 1.4, 1.7, 2.1] // thinnest → thickest

const FRET_NUM_LABELS = [0, 3, 5, 7, 9, 12, 14]
const SINGLE_DOT_FRETS = [3, 5, 7, 9, 14]
const DOUBLE_DOT_FRETS = [12]

const DAY_POSITIONS: Record<number, { string: number; fret: number }> = {
  1:  { string: 6, fret: 0  },
  2:  { string: 5, fret: 0  },
  3:  { string: 6, fret: 5  },
  4:  { string: 5, fret: 5  },
  5:  { string: 4, fret: 5  },
  6:  { string: 3, fret: 5  },
  7:  { string: 2, fret: 5  },
  8:  { string: 1, fret: 5  },
  9:  { string: 6, fret: 7  },
  10: { string: 5, fret: 7  },
  11: { string: 4, fret: 7  },
  12: { string: 3, fret: 7  },
  13: { string: 2, fret: 7  },
  14: { string: 1, fret: 7  },
  15: { string: 6, fret: 9  },
  16: { string: 5, fret: 9  },
  17: { string: 4, fret: 9  },
  18: { string: 3, fret: 9  },
  19: { string: 2, fret: 9  },
  20: { string: 1, fret: 9  },
  21: { string: 6, fret: 12 },
  22: { string: 5, fret: 12 },
  23: { string: 4, fret: 12 },
  24: { string: 3, fret: 12 },
  25: { string: 2, fret: 12 },
  26: { string: 1, fret: 12 },
  27: { string: 6, fret: 14 },
  28: { string: 5, fret: 14 },
  29: { string: 4, fret: 14 },
  30: { string: 3, fret: 14 },
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function JourneyFretboard({
  completedDays,
  currentDay,
  lessons,
}: JourneyFretboardProps) {
  const router = useRouter()
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const completedSet = new Set(completedDays)
  const sortedCompleted = [...completedDays].sort((a, b) => a - b)

  const getLessonTitle = (day: number): string =>
    lessons.find(l => l.day === day)?.title ?? `Lesson ${day}`

  const handleClick = (day: number) => {
    if (completedSet.has(day) || day === currentDay) {
      router.push(`/lesson/${day}`)
    }
  }

  // Build polyline points from completed days in order
  const pathPoints = sortedCompleted
    .map(day => {
      const pos = DAY_POSITIONS[day]
      if (!pos) return null
      return `${getNodeX(pos.fret).toFixed(1)},${getStringY(pos.string).toFixed(1)}`
    })
    .filter((p): p is string => p !== null)
    .join(' ')

  const dotMidY = PAD_T + STRING_H / 2

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <style>{`
        @keyframes fp-pulse {
          0%,100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.6); opacity: 0.08; }
        }
        @keyframes fp-glow {
          0%,100% { stroke-opacity: 0.45; }
          50% { stroke-opacity: 0.85; }
        }
      `}</style>

      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%"
        style={{ minWidth: 560, height: 'auto', display: 'block' }}
        onMouseLeave={() => setTooltip(null)}
        aria-label="Guitar fretboard journey map showing 30 lesson positions"
        role="img"
      >
        {/* ── Fretboard wood background ───────────────────────────────────── */}
        <rect
          x={PAD_L} y={PAD_T}
          width={FRET_W} height={STRING_H}
          rx={4}
          fill="#1c1509"
          stroke="#2a2010" strokeWidth={1}
        />

        {/* ── Inlay dots ─────────────────────────────────────────────────── */}
        {SINGLE_DOT_FRETS.map(fret => (
          <circle
            key={`sdot-${fret}`}
            cx={getNodeX(fret)} cy={dotMidY}
            r={4} fill="#2d2718"
          />
        ))}
        {DOUBLE_DOT_FRETS.map(fret => (
          <g key={`ddot-${fret}`}>
            <circle cx={getNodeX(fret)} cy={PAD_T + STRING_H * 0.3} r={4} fill="#2d2718" />
            <circle cx={getNodeX(fret)} cy={PAD_T + STRING_H * 0.7} r={4} fill="#2d2718" />
          </g>
        ))}

        {/* ── String lines ───────────────────────────────────────────────── */}
        {[1, 2, 3, 4, 5, 6].map(s => (
          <line
            key={`str-${s}`}
            x1={PAD_L} y1={getStringY(s)}
            x2={SVG_W - PAD_R} y2={getStringY(s)}
            stroke="#4a3c28"
            strokeWidth={STRING_WIDTHS[s - 1]}
          />
        ))}

        {/* ── Fret lines (nut is extra thick) ───────────────────────────── */}
        {Array.from({ length: 15 }, (_, i) => i).map(fret => (
          <line
            key={`fret-${fret}`}
            x1={getFretX(fret)} y1={PAD_T}
            x2={getFretX(fret)} y2={PAD_T + STRING_H}
            stroke={fret === 0 ? '#b0a090' : '#3a3020'}
            strokeWidth={fret === 0 ? 4 : 1}
          />
        ))}

        {/* ── String labels (left) ──────────────────────────────────────── */}
        {STRING_LABELS.map((label, i) => (
          <text
            key={`slbl-${label}`}
            x={PAD_L - 8} y={getStringY(i + 1) + 4}
            textAnchor="end"
            fill="#5a5a5a"
            fontSize={10}
            fontFamily="monospace"
            fontStyle="italic"
          >
            {label}
          </text>
        ))}

        {/* ── Fret number labels (top) ───────────────────────────────────── */}
        {FRET_NUM_LABELS.map(fret => (
          <text
            key={`fnum-${fret}`}
            x={getNodeX(fret)} y={PAD_T - 8}
            textAnchor="middle"
            fill="#484848"
            fontSize={10}
            fontFamily="monospace"
          >
            {fret}
          </text>
        ))}

        {/* ── Journey path connecting completed circles ─────────────────── */}
        {pathPoints && (
          <polyline
            points={pathPoints}
            fill="none"
            stroke="#f59e0b"
            strokeWidth={1.5}
            strokeDasharray="5 3"
            style={{ animation: 'fp-glow 2s ease-in-out infinite' }}
          />
        )}

        {/* ── Day circles ────────────────────────────────────────────────── */}
        {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
          const rawPos: { string: number; fret: number } | undefined =
            (DAY_POSITIONS as Record<number, { string: number; fret: number } | undefined>)[day]
          if (!rawPos) return null

          const cx = getNodeX(rawPos.fret)
          const cy = getStringY(rawPos.string)
          const isCompleted = completedSet.has(day)
          const isCurrent = day === currentDay
          const isAccessible = isCompleted || isCurrent
          const r = isCurrent ? 11 : 9

          return (
            <g
              key={`day-${day}`}
              transform={`translate(${cx}, ${cy})`}
              onClick={() => handleClick(day)}
              onMouseEnter={() =>
                setTooltip({ x: cx, y: cy, text: `Day ${day}: ${getLessonTitle(day)}` })
              }
              onMouseLeave={() => setTooltip(null)}
              style={{ cursor: isAccessible ? 'pointer' : 'default' }}
            >
              {/* Pulsing outer ring for current day */}
              {isCurrent && (
                <circle
                  cx={0} cy={0} r={15}
                  fill="none"
                  stroke="#f59e0b" strokeWidth={1.5}
                  style={{ animation: 'fp-pulse 1.5s ease-in-out infinite' }}
                />
              )}

              {/* Main circle */}
              <circle
                cx={0} cy={0} r={r}
                fill={
                  isCompleted ? '#f59e0b'
                    : isCurrent ? '#2a1800'
                      : '#1a1510'
                }
                stroke={
                  isCompleted ? '#d97706'
                    : isCurrent ? '#f59e0b'
                      : '#2e2820'
                }
                strokeWidth={isCurrent ? 2 : 1}
                opacity={isCompleted || isCurrent ? 1 : 0.4}
                style={
                  isCompleted
                    ? { filter: 'drop-shadow(0 0 5px rgba(245,158,11,0.6))' }
                    : undefined
                }
              />

              {/* Day number text */}
              <text
                x={0} y={3.5}
                textAnchor="middle"
                fill={isCompleted ? '#000000' : isCurrent ? '#f59e0b' : '#3a3530'}
                fontSize={day >= 10 ? 6.5 : 7.5}
                fontWeight="900"
                fontFamily="sans-serif"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {day}
              </text>
            </g>
          )
        })}

        {/* ── Tooltip ────────────────────────────────────────────────────── */}
        {tooltip && (() => {
          const maxW = 164
          const halfW = maxW / 2
          const tx = Math.min(Math.max(tooltip.x, halfW + 5), SVG_W - halfW - 5)
          const ty = tooltip.y < PAD_T + 24 ? tooltip.y + 46 : tooltip.y - 18
          const label =
            tooltip.text.length > 32
              ? tooltip.text.slice(0, 30) + '…'
              : tooltip.text

          return (
            <g pointerEvents="none">
              <rect
                x={tx - halfW} y={ty - 20}
                width={maxW} height={22}
                rx={4}
                fill="#111111"
                stroke="#2a2a2a" strokeWidth={1}
              />
              <text
                x={tx} y={ty - 5}
                textAnchor="middle"
                fill="#f59e0b"
                fontSize={10}
                fontFamily="system-ui, sans-serif"
              >
                {label}
              </text>
            </g>
          )
        })()}
      </svg>
    </div>
  )
}
