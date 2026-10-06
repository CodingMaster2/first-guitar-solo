export interface SkillProfile {
  experienceMonths: number | null
  tabComfort: number | null       // 1-5
  pickingLevel: number | null     // 1-5
  hammerOnLevel: number | null    // 1-5
  pentatonicLevel: number | null  // 1-5
  bendLevel: number | null        // 1-5
}

export function generateAdaptivePath(skills: SkillProfile): number[] {
  const exp = skills.experienceMonths ?? 0
  const tab = skills.tabComfort ?? 1
  const picking = skills.pickingLevel ?? 1
  const penta = skills.pentatonicLevel ?? 1
  const bends = skills.bendLevel ?? 1

  // Score: 0-10
  const score = Math.min(10, Math.round(
    (exp / 12) * 2 +      // 2 pts per year experience
    (tab - 1) * 0.5 +
    (picking - 1) * 0.5 +
    (penta - 1) * 1.5 +   // pentatonic knowledge is key
    (bends - 1) * 1
  ))

  if (score <= 2) {
    // Complete beginner: all 30 days in order
    return Array.from({ length: 30 }, (_, i) => i + 1)
  } else if (score <= 5) {
    // Intermediate: skip Days 1-3 (basic orientation), otherwise full path
    return [4, 5, 6, 7, 8, ...Array.from({ length: 22 }, (_, i) => i + 9)]
  } else if (score <= 8) {
    // Advanced beginner: start at Day 8 (technique deep-dive)
    return Array.from({ length: 23 }, (_, i) => i + 8)
  } else {
    // Experienced: start at Day 15 (advanced techniques)
    return Array.from({ length: 16 }, (_, i) => i + 15)
  }
}

export function getNextLessonInPath(adaptivePath: number[], completedDays: number[]): number {
  const completedSet = new Set(completedDays)
  const nextInPath = adaptivePath.find(d => !completedSet.has(d))
  return nextInPath ?? adaptivePath[adaptivePath.length - 1]
}
