export interface Lesson {
  day: number
  week: number
  title: string
  subtitle: string
  why: string
  duration: number
  warmup: string
  mainContent: string
  exercise: string
  selfCheck: string
  techniques: string[]
  xpReward: number
  soloSection?: number
}

export interface UserProfile {
  id: string
  userId: string
  instrument: string | null
  experienceMonths: number | null
  tabComfort: number | null
  hasBasicChords: boolean | null
  hasLearnedSolo: boolean | null
  pickingLevel: number | null
  hammerOnLevel: number | null
  pullOffLevel: number | null
  slideLevel: number | null
  bendLevel: number | null
  vibratoLevel: number | null
  pentatonicLevel: number | null
  styles: string | null
  practiceMinutes: number | null
  currentDay: number
  totalXP: number
  streak: number
  lastPracticeDate: Date | null
}

export interface ProgressRecord {
  id: string
  userId: string
  day: number
  completed: boolean
  completedAt: Date | null
  difficulty: string | null
  difficultAreas: string | null
  rating: number | null
  notes: string | null
  createdAt: Date
}

export interface AchievementDef {
  key: string
  name: string
  description: string
  xpReward: number
}

export interface UserAchievementRecord {
  id: string
  userId: string
  achievementId: string
  unlockedAt: Date
  achievement: {
    key: string
    name: string
    description: string
    xpReward: number
  }
}

export interface CoachMessageRecord {
  id: string
  userId: string
  role: string
  content: string
  createdAt: Date
}

export interface AudioAssetRecord {
  id: string
  type: string
  label: string
  url: string
  day: number | null
  section: number | null
  speed: string | null
  published: boolean
}

export interface PracticeSessionRecord {
  id: string
  userId: string
  day: number
  duration: number
  difficulty: string | null
  createdAt: Date
}

export interface FeedbackRecord {
  id: string
  userId: string
  day: number | null
  rating: number | null
  comment: string | null
  type: string | null
  createdAt: Date
}
