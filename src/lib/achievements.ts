import type { AchievementDef } from '@/types'

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    key: 'first_lesson',
    name: 'First Step',
    description: 'Complete your first lesson',
    xpReward: 50,
  },
  {
    key: 'streak_3',
    name: 'On a Roll',
    description: '3-day practice streak',
    xpReward: 100,
  },
  {
    key: 'streak_7',
    name: 'Dedicated',
    description: '7-day practice streak',
    xpReward: 250,
  },
  {
    key: 'week_1',
    name: 'Foundation Built',
    description: 'Complete Week 1',
    xpReward: 200,
  },
  {
    key: 'week_2',
    name: 'Lead Guitarist',
    description: 'Complete Week 2',
    xpReward: 200,
  },
  {
    key: 'solo_section_1',
    name: 'Section 1 Down',
    description: 'Complete Solo Section 1',
    xpReward: 300,
  },
  {
    key: 'solo_complete',
    name: 'Solo Complete',
    description: 'Learn the full solo',
    xpReward: 500,
  },
  {
    key: 'first_solo',
    name: 'First Guitar Solo',
    description: 'Complete Day 30',
    xpReward: 1000,
  },
]
