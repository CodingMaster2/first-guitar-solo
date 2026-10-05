'use client'

import { useState } from 'react'

const DEFINITIONS: Record<string, string> = {
  'hammer-on': 'Fret a note, then use a finger to forcefully press a higher fret on the same string — the second note sounds without picking',
  'pull-off': 'While fretting two notes, pull the higher finger away to let the lower fretted note sound',
  'bend': 'Push the string sideways across the fretboard to raise the pitch smoothly',
  'vibrato': 'Rapidly oscillate a fretted note by rocking the fretting hand slightly',
  'slide': 'Press a note, then slide your finger along the string to the destination note',
  'alternate picking': 'Strictly alternate between downstroke and upstroke with the pick',
  'pentatonic': 'A 5-note scale (minor pentatonic) that is the foundation of blues and rock improvisation',
  'legato': 'Playing notes smoothly connected, typically via hammer-ons and pull-offs rather than picking each note',
}

interface TechniqueTooltipProps {
  term: string
  children: React.ReactNode
}

export default function TechniqueTooltip({ term, children }: TechniqueTooltipProps) {
  const [visible, setVisible] = useState(false)
  const definition = DEFINITIONS[term.toLowerCase()]

  if (!definition) {
    return <>{children}</>
  }

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#1a1a1a',
            border: '1px solid #f59e0b',
            color: '#ffffff',
            fontSize: '0.75rem',
            lineHeight: '1.5',
            padding: '6px 10px',
            borderRadius: '6px',
            whiteSpace: 'nowrap',
            maxWidth: '260px',
            whiteSpaceCollapse: 'collapse',
            zIndex: 50,
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
          }}
        >
          <span style={{ whiteSpace: 'normal', display: 'block' }}>{definition}</span>
          {/* Arrow pointing down */}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #f59e0b',
            }}
          />
        </span>
      )}
    </span>
  )
}
