'use client'

import { useRef, useCallback } from 'react'

// Guitar string standard tuning: E2, A2, D3, G3, B3, E4 (MIDI note numbers)
const OPEN_STRING_MIDI: Record<string, number> = {
  E: 40, // low E (string 6)
  A: 45,
  D: 50,
  G: 55,
  B: 59,
  e: 64, // high e (string 1)
}

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

function parseTabLine(line: string, stringName: string): { fret: number; position: number }[] {
  const notes: { fret: number; position: number }[] = []
  // Find the pipe separator and extract the tab content
  const pipeIdx = line.indexOf('|')
  if (pipeIdx === -1) return notes

  const content = line.slice(pipeIdx + 1)
  const base = OPEN_STRING_MIDI[stringName]
  if (base === undefined) return notes

  let i = 0
  while (i < content.length) {
    const ch = content[i]
    if (ch === '-' || ch === '~' || ch === ' ' || ch === '|' || ch === '(' || ch === ')') {
      i++
      continue
    }
    // Check for technique markers followed by number
    if (ch === 'h' || ch === 'p' || ch === 'b' || ch === '/') {
      i++
      continue
    }
    // Parse fret number
    if (/\d/.test(ch)) {
      let numStr = ch
      while (i + 1 < content.length && /\d/.test(content[i + 1])) {
        numStr += content[i + 1]
        i++
      }
      notes.push({ fret: parseInt(numStr, 10), position: i })
    }
    i++
  }
  return notes
}

function extractNotesFromTab(tab: string): { freq: number; delay: number }[] {
  const lines = tab.split('\n').map((l) => l.trim()).filter(Boolean)
  const stringOrder = ['e', 'B', 'G', 'D', 'A', 'E'] // top string first in tab notation
  const result: { freq: number; delay: number }[] = []

  const tabLines: { name: string; notes: { fret: number; position: number }[] }[] = []

  for (const line of lines) {
    for (const name of stringOrder) {
      if (line.startsWith(name + ' |') || line.startsWith(name + '|')) {
        const notes = parseTabLine(line, name)
        if (notes.length > 0) tabLines.push({ name, notes })
        break
      }
    }
  }

  if (tabLines.length === 0) return result

  // Collect all notes sorted by position, then string
  const allNotes: { freq: number; position: number }[] = []
  for (const tl of tabLines) {
    const base = OPEN_STRING_MIDI[tl.name]
    if (base === undefined) continue
    for (const n of tl.notes) {
      allNotes.push({ freq: midiToFreq(base + n.fret), position: n.position })
    }
  }

  allNotes.sort((a, b) => a.position - b.position)

  // Assign delays (0.3s per step)
  let lastPos = -1
  let delay = 0
  for (const note of allNotes) {
    if (note.position !== lastPos) {
      delay += lastPos === -1 ? 0 : 0.3
      lastPos = note.position
    }
    result.push({ freq: note.freq, delay })
  }

  return result
}

interface TabPlayerProps {
  tab: string
  label?: string
}

export default function TabPlayer({ tab, label }: TabPlayerProps) {
  const audioCtxRef = useRef<AudioContext | null>(null)
  const playingRef = useRef(false)

  const playNote = useCallback((ctx: AudioContext, freq: number, startTime: number) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'triangle'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0, startTime)
    gain.gain.linearRampToValueAtTime(0.25, startTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4)
    osc.start(startTime)
    osc.stop(startTime + 0.4)
  }, [])

  const playTab = useCallback(() => {
    if (playingRef.current) return
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext()
    const ctx = audioCtxRef.current

    const notes = extractNotesFromTab(tab)
    if (notes.length === 0) return

    playingRef.current = true
    const startTime = ctx.currentTime + 0.05

    for (const note of notes) {
      playNote(ctx, note.freq, startTime + note.delay)
    }

    const lastDelay = notes[notes.length - 1]?.delay ?? 0
    setTimeout(() => { playingRef.current = false }, (lastDelay + 0.6) * 1000)
  }, [tab, playNote])

  return (
    <button
      onClick={playTab}
      style={{ border: '1px solid #262626', backgroundColor: '#111111', color: '#a3a3a3' }}
      className="text-xs px-3 py-1.5 rounded-lg hover:border-amber-600 hover:text-white transition-colors flex items-center gap-1.5"
      title={label ? `Play ${label}` : 'Play tab'}
    >
      <span style={{ color: '#f59e0b' }}>▶</span>
      {label ?? 'Play tab'}
    </button>
  )
}
