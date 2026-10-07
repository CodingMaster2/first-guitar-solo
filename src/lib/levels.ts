export const LEVELS = [
  { level: 1,  title: 'Beginner',   minXP: 0,     color: '#737373' },
  { level: 2,  title: 'Strummer',   minXP: 200,   color: '#86efac' },
  { level: 3,  title: 'Student',    minXP: 500,   color: '#93c5fd' },
  { level: 4,  title: 'Apprentice', minXP: 1000,  color: '#c4b5fd' },
  { level: 5,  title: 'Player',     minXP: 2000,  color: '#f59e0b' },
  { level: 6,  title: 'Soloist',    minXP: 3500,  color: '#fb923c' },
  { level: 7,  title: 'Artist',     minXP: 5500,  color: '#ef4444' },
  { level: 8,  title: 'Virtuoso',   minXP: 8000,  color: '#e879f9' },
  { level: 9,  title: 'Legend',     minXP: 11000, color: '#fde68a' },
  { level: 10, title: 'Maestro',    minXP: 15000, color: '#f59e0b' },
]

export function getLevelInfo(xp: number) {
  let current = LEVELS[0]
  for (const l of LEVELS) {
    if (xp >= l.minXP) current = l
    else break
  }
  const nextLevel = LEVELS.find(l => l.minXP > xp) ?? null
  const progressToNext = nextLevel
    ? Math.round(((xp - current.minXP) / (nextLevel.minXP - current.minXP)) * 100)
    : 100
  return { current, nextLevel, progressToNext, xp }
}
