'use client'

import { useState } from 'react'

const TIPS: string[] = [
  'Always warm up with slow chromatic runs before playing fast. Speed is built on accuracy, not the other way around.',
  'When bending, use two or three fingers behind the bending finger to add strength and control.',
  'Practice scales with a metronome at 60% of your target tempo first. Clean technique at slow speed = clean technique at fast speed.',
  "Your fretting hand should be relaxed. If your hand cramps, you're using too much grip pressure.",
  'The pick angle matters. Slanting your pick slightly toward the strings (upward for the attack) reduces resistance and improves tone.',
  'Vibrato is the mark of a real guitarist. Practice making it consistent — same width, same speed, every time.',
  'Learn the pentatonic scale in all 5 positions, not just position 1. Real improvisation uses the whole neck.',
  "Record yourself practicing. You'll catch mistakes your ears miss while you're playing.",
  'The bend-and-release is often more musical than a straight bend. Let the note sing on the way back.',
  "Hammer-ons should sound the same volume as picked notes. That's the goal to train for.",
  "Ear training is technique. Try to hum along with what you're playing — it locks your ear to your hands.",
  "Great tone starts with proper string-to-fret contact. Press right behind the fret, not on top of it.",
  'The minor pentatonic and major pentatonic share the same shape — just starting from different roots.',
  "When learning a solo, slow it down until you can play every note cleanly, then build speed 5 BPM at a time.",
  "Use your pinky. Most beginners avoid it — but it's the difference between a two-octave reach and a full four-fret span.",
  'String skipping builds right-hand accuracy faster than single-string exercises.',
  'Dynamics separate players. Practice the same phrase both loud and soft — control the volume with your pick attack.',
  'A half-step bend can be more expressive than a full bend in the right context. Both have their place.',
  'Practice bending in tune. Bend to the pitch of the next scale note — use your ear as a guide.',
  'The first position of the minor pentatonic box pattern covers the most common solo territory. Own it completely.',
  'Economy picking (alternate picking + sweep on string changes) is more efficient than strict alternate picking for fast runs.',
  'Slides should begin and end cleanly. The destination note is what listeners hear — make it land in tune.',
  'Learn phrases, not just scales. A scale is a vocabulary; a phrase is a sentence.',
  'Play along with backing tracks. Real musicianship is about responding to other instruments.',
  'Your tone lives in your hands before it reaches your amp. Attack, angle, and touch all shape the sound.',
  'Legato playing (hammer-ons/pull-offs) reduces pick attack for a smoother, more fluid sound than strict picking.',
  'Study the players you love, note for note. Transcribing solos teaches phrasing better than any exercise.',
  'Consistent practice for 20 minutes a day beats a 3-hour binge session once a week. Every time.',
  'The space between notes is as important as the notes themselves. Great soloists know when to rest.',
  'Trust the process. Day 1 always feels rough. Day 30 feels different — but only if you showed up every day.',
]

export default function GuitarTip() {
  const [open, setOpen] = useState(true)
  const tipIndex = Math.floor(Date.now() / 86400000) % TIPS.length
  const tip = TIPS[tipIndex]

  return (
    <div
      style={{
        border: '1px solid #f59e0b',
        borderLeft: '3px solid #f59e0b',
        backgroundColor: '#111111',
      }}
      className="rounded-xl p-4 mb-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            style={{ width: 16, height: 16, fill: '#f59e0b', flexShrink: 0 }}
          >
            <path d="M12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z" />
          </svg>
          <span style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-wider">
            Guitar Tip of the Day
          </span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          style={{ color: '#525252' }}
          className="text-xs hover:text-white transition-colors"
        >
          {open ? 'Hide' : 'Show'}
        </button>
      </div>
      {open && (
        <p style={{ color: '#d4d4d4' }} className="text-sm mt-3 leading-relaxed">
          {tip}
        </p>
      )}
    </div>
  )
}
