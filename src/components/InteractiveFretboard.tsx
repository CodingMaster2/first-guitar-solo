'use client'

import { useState, useMemo, useCallback } from 'react'

export interface InteractiveFretboardProps {
  overlayMode: 'none' | 'pentatonic-minor' | 'pentatonic-major' | 'blues' | 'major' | 'minor'
  rootNote: string
  showNoteNames: boolean
  showFretNumbers: boolean
}

// Standard tuning — string 0 = high e, string 5 = low E
const OPEN_NOTES = ['E', 'B', 'G', 'D', 'A', 'E']
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const STRING_NAMES = ['e', 'B', 'G', 'D', 'A', 'E']

const SCALE_INTERVALS: Record<string, number[]> = {
  'pentatonic-minor': [0, 3, 5, 7, 10],
  'pentatonic-major': [0, 2, 4, 7, 9],
  blues: [0, 3, 5, 6, 7, 10],
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
}

// SVG layout
const STRING_Y = [40, 70, 100, 130, 160, 190]
const STRING_THICKNESS = [1, 1.5, 2, 2.5, 3, 3.5]
const NUT_X = 60
const FRET_SPACING = 58
const NUM_STRINGS = 6
const NUM_FRETS = 15  // frets 0–14
const FRET_MARKER_FRETS = [3, 5, 7, 9, 12]

function getNoteAtPosition(stringIndex: number, fret: number): string {
  const openNoteIndex = NOTE_NAMES.indexOf(OPEN_NOTES[stringIndex])
  return NOTE_NAMES[(openNoteIndex + fret) % 12]
}

function noteFrequency(stringIndex: number, fret: number): number {
  const baseOctaves = [4, 3, 3, 3, 2, 2]
  const openNoteIndex = NOTE_NAMES.indexOf(OPEN_NOTES[stringIndex])
  let octave = baseOctaves[stringIndex]
  if (openNoteIndex + fret >= 12) octave++
  if (openNoteIndex + fret >= 24) octave++
  const noteName = getNoteAtPosition(stringIndex, fret)
  const semitonesFromA4 =
    (NOTE_NAMES.indexOf(noteName) - NOTE_NAMES.indexOf('A')) + (octave - 4) * 12
  return 440 * Math.pow(2, semitonesFromA4 / 12)
}

function playNote(freq: number): void {
  if (typeof window === 'undefined') return
  const AudioCtx =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioCtx) return
  const ctx = new AudioCtx()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = 'triangle'
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0.3, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 1.5)
}

// X center of note circle: fret 0 (open) is left of nut; fret n >= 1 is midpoint of fret space
function noteCircleX(fret: number): number {
  if (fret === 0) return 30
  return 31 + fret * FRET_SPACING
}

function fretWireX(fret: number): number {
  return NUT_X + fret * FRET_SPACING
}

export default function InteractiveFretboard({
  overlayMode,
  rootNote,
  showNoteNames,
  showFretNumbers,
}: InteractiveFretboardProps) {
  const [activeNote, setActiveNote] = useState<{ s: number; f: number } | null>(null)

  const inScaleSet = useMemo<Set<string>>(() => {
    if (overlayMode === 'none') return new Set<string>()
    const intervals = SCALE_INTERVALS[overlayMode]
    if (!intervals) return new Set<string>()
    const rootIndex = NOTE_NAMES.indexOf(rootNote)
    if (rootIndex < 0) return new Set<string>()
    return new Set<string>(intervals.map((i) => NOTE_NAMES[(rootIndex + i) % 12]))
  }, [overlayMode, rootNote])

  const rootNoteIndex = NOTE_NAMES.indexOf(rootNote)

  const handleNoteClick = useCallback(
    (stringIndex: number, fret: number) => {
      const freq = noteFrequency(stringIndex, fret)
      playNote(freq)
      setActiveNote({ s: stringIndex, f: fret })
      setTimeout(() => {
        setActiveNote((prev) =>
          prev?.s === stringIndex && prev?.f === fret ? null : prev
        )
      }, 1500)
    },
    [],
  )

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 900 220"
        style={{ minWidth: 560, width: '100%', display: 'block' }}
        aria-label="Interactive guitar fretboard"
        role="img"
      >
        <style>{`
          .note-ghost { opacity: 0; transition: opacity 0.12s ease; }
          .note-group:hover .note-ghost { opacity: 1; }
          .note-group { cursor: pointer; }
        `}</style>

        {/* SVG background */}
        <rect x={0} y={0} width={900} height={220} fill="#0d0d0d" />

        {/* Fretboard wood surface */}
        <rect x={NUT_X} y={26} width={838} height={170} fill="#1c1408" rx={3} />

        {/* Fret wires 1–14 */}
        {Array.from({ length: NUM_FRETS - 1 }, (_, i) => {
          const fretNum = i + 1
          const x = fretWireX(fretNum)
          return (
            <line
              key={`fw-${fretNum}`}
              x1={x} y1={26} x2={x} y2={196}
              stroke={fretNum === 12 ? '#6a6a50' : '#3a3a28'}
              strokeWidth={fretNum === 12 ? 2 : 1}
            />
          )
        })}

        {/* Nut */}
        <rect x={NUT_X - 3} y={26} width={5} height={170} fill="#c8b560" rx={1} />

        {/* String lines — nut to right edge */}
        {STRING_Y.map((y, si) => (
          <line
            key={`str-${si}`}
            x1={NUT_X} y1={y} x2={890} y2={y}
            stroke="#8a8a6a"
            strokeWidth={STRING_THICKNESS[si]}
          />
        ))}

        {/* Open string segments — left edge to nut */}
        {STRING_Y.map((y, si) => (
          <line
            key={`ostr-${si}`}
            x1={4} y1={y} x2={NUT_X - 3} y2={y}
            stroke="#5a5a48"
            strokeWidth={STRING_THICKNESS[si]}
          />
        ))}

        {/* String name labels */}
        {STRING_NAMES.map((name, si) => (
          <text
            key={`sn-${si}`}
            x={12}
            y={STRING_Y[si] + 4}
            textAnchor="middle"
            fontSize={9}
            fontWeight="700"
            fill="#525252"
            fontFamily="monospace"
          >
            {name}
          </text>
        ))}

        {/* Fret position marker dots */}
        {FRET_MARKER_FRETS.map((fret) => {
          const mx = noteCircleX(fret)
          const my = 208
          if (fret === 12) {
            return (
              <g key={`mk-${fret}`}>
                <circle cx={mx - 7} cy={my} r={3.5} fill="#4a4a38" />
                <circle cx={mx + 7} cy={my} r={3.5} fill="#4a4a38" />
              </g>
            )
          }
          return <circle key={`mk-${fret}`} cx={mx} cy={my} r={3.5} fill="#4a4a38" />
        })}

        {/* Fret number labels */}
        {showFretNumbers &&
          Array.from({ length: NUM_FRETS - 1 }, (_, i) => {
            const fretNum = i + 1
            return (
              <text
                key={`fn-${fretNum}`}
                x={noteCircleX(fretNum)}
                y={218}
                textAnchor="middle"
                fontSize={8}
                fill="#525252"
                fontFamily="monospace"
              >
                {fretNum}
              </text>
            )
          })}

        {/* Note circles — 6 strings × 15 frets */}
        {Array.from({ length: NUM_STRINGS }, (_, si) =>
          Array.from({ length: NUM_FRETS }, (_, fret) => {
            const noteName = getNoteAtPosition(si, fret)
            const inScale = overlayMode !== 'none' && inScaleSet.has(noteName)
            const isRoot = inScale && NOTE_NAMES.indexOf(noteName) === rootNoteIndex
            const isActive = activeNote?.s === si && activeNote?.f === fret
            const cx = noteCircleX(fret)
            const cy = STRING_Y[si]
            const r = isRoot ? 12 : inScale ? 9 : 8

            return (
              <g
                key={`n-${si}-${fret}`}
                className="note-group"
                onClick={() => handleNoteClick(si, fret)}
                role="button"
                aria-label={`Play ${noteName}, string ${si + 1}, fret ${fret}`}
                tabIndex={-1}
              >
                {/* Invisible hit-area so hover triggers reliably */}
                <circle cx={cx} cy={cy} r={15} fill="transparent" />

                {inScale ? (
                  /* Amber circle for in-scale notes */
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={isRoot ? '#f59e0b' : 'rgba(245,158,11,0.72)'}
                    stroke={isRoot ? '#ffffff' : '#f59e0b'}
                    strokeWidth={isRoot ? 2 : 1}
                  />
                ) : (
                  /* Ghost circle for out-of-scale notes — shown on hover */
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="rgba(255,255,255,0.07)"
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth={1}
                    className="note-ghost"
                  />
                )}

                {/* Note name text */}
                {showNoteNames && inScale && (
                  <text
                    x={cx}
                    y={cy + 4}
                    textAnchor="middle"
                    fontSize={noteName.length > 1 ? 7 : 8}
                    fontWeight="700"
                    fill="#000000"
                    fontFamily="sans-serif"
                    pointerEvents="none"
                  >
                    {noteName}
                  </text>
                )}
                {showNoteNames && !inScale && (
                  <text
                    x={cx}
                    y={cy + 4}
                    textAnchor="middle"
                    fontSize={noteName.length > 1 ? 7 : 8}
                    fill="#e5e5e5"
                    fontFamily="sans-serif"
                    pointerEvents="none"
                    className="note-ghost"
                  >
                    {noteName}
                  </text>
                )}

                {/* Pulsing ripple on click */}
                {isActive && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke={inScale ? '#f59e0b' : 'rgba(200,200,200,0.7)'}
                    strokeWidth={2}
                  >
                    <animate
                      attributeName="r"
                      values={`${r};${r + 14};${r}`}
                      dur="0.65s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.9;0;0.9"
                      dur="0.65s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            )
          }),
        )}
      </svg>
    </div>
  )
}
