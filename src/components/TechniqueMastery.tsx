'use client'

const DAY_TECHNIQUES: Record<number, string> = {
  1: 'Posture & Setup',
  2: 'Fretting',
  3: 'Picking',
  4: 'Chord Basics',
  5: 'Hammer-ons',
  6: 'Pull-offs',
  7: 'Pentatonic Scale',
  8: 'Licks',
  9: 'Slides',
  10: 'String Bending',
  11: 'Vibrato',
  12: 'Advanced Bending',
  13: 'Blues Phrases',
  14: 'Rhythm & Timing',
  15: 'Position Playing',
  16: 'String Skipping',
  17: 'Hybrid Picking',
  18: 'Double Stops',
  19: 'Whammy Techniques',
  20: 'Solo Construction',
  21: 'Tone & Dynamics',
  22: 'Advanced Vibrato',
  23: 'Speed Building',
  24: 'Pentatonic Mastery',
  25: 'Solo Phrases',
  26: 'Full Solo Section 1',
  27: 'Full Solo Section 2',
  28: 'Full Solo Section 3',
  29: 'Performance Prep',
  30: 'Complete Solo',
}

interface ProgressEntry {
  day: number
  rating: number | null
  difficulty: string | null
}

interface TechniqueMasteryProps {
  completedProgress: ProgressEntry[]
}

export default function TechniqueMastery({ completedProgress }: TechniqueMasteryProps) {
  // Build technique scores
  const techniqueMap: Record<string, { total: number; count: number }> = {}

  for (const entry of completedProgress) {
    const technique = DAY_TECHNIQUES[entry.day]
    if (!technique) continue
    if (!techniqueMap[technique]) {
      techniqueMap[technique] = { total: 0, count: 0 }
    }
    const ratingVal = entry.rating ?? 0
    techniqueMap[technique].total += ratingVal
    techniqueMap[technique].count += 1
  }

  const techniqueScores = Object.entries(techniqueMap)
    .map(([name, { total, count }]) => ({
      name,
      score: count > 0 ? Math.round((total / count) * 20) : 0,
    }))
    .sort((a, b) => b.score - a.score)

  if (techniqueScores.length === 0) {
    return (
      <div
        style={{
          backgroundColor: '#111111',
          border: '1px solid #262626',
          borderRadius: '0.75rem',
          padding: '1.25rem',
        }}
      >
        <h2 className="text-white text-xs font-bold uppercase tracking-widest mb-3">
          Technique Mastery
        </h2>
        <p style={{ color: '#525252', fontSize: '0.875rem' }}>
          Complete lessons and rate them to see your technique mastery.
        </p>
      </div>
    )
  }

  const getBarColor = (score: number) => {
    if (score >= 70) return '#22c55e'
    if (score >= 40) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div
      style={{
        backgroundColor: '#111111',
        border: '1px solid #262626',
        borderRadius: '0.75rem',
        padding: '1.25rem',
      }}
    >
      <h2 className="text-white text-xs font-bold uppercase tracking-widest mb-4">
        Technique Mastery
      </h2>
      <div className="flex flex-col gap-3">
        {techniqueScores.map(({ name, score }) => {
          const barColor = getBarColor(score)
          return (
            <div key={name}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 4,
                }}
              >
                <span style={{ color: '#d4d4d4', fontSize: '0.8rem', fontWeight: 500 }}>
                  {name}
                </span>
                <span
                  style={{
                    color: barColor,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {score}
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  backgroundColor: '#1a1a1a',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${score}%`,
                    backgroundColor: barColor,
                    borderRadius: 3,
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
