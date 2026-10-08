'use client'

import { useState, useEffect } from 'react'
import LevelUpAnimation from './LevelUpAnimation'

interface LevelUpTriggerProps {
  totalXP: number
}

export default function LevelUpTrigger({ totalXP }: LevelUpTriggerProps) {
  const currentLevel = Math.floor(totalXP / 100) + 1
  const [showAnimation, setShowAnimation] = useState(false)
  const [displayLevel, setDisplayLevel] = useState(currentLevel)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('last-level')
      const lastLevel = stored ? parseInt(stored, 10) : null
      if (lastLevel !== null && currentLevel > lastLevel) {
        setDisplayLevel(currentLevel)
        setShowAnimation(true)
      } else if (lastLevel === null) {
        // First visit — store current level without showing animation
        localStorage.setItem('last-level', String(currentLevel))
      }
    } catch { /* ignore */ }
  }, [currentLevel])

  const handleComplete = () => {
    setShowAnimation(false)
    try {
      localStorage.setItem('last-level', String(currentLevel))
    } catch { /* ignore */ }
  }

  return (
    <LevelUpAnimation
      level={displayLevel}
      show={showAnimation}
      onComplete={handleComplete}
    />
  )
}
