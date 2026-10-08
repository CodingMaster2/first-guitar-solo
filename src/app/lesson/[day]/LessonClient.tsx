'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Lesson, CoachMessageRecord } from '@/types'
import AudioPlayer from '@/components/AudioPlayer'
import { triggerConfetti } from '@/components/ConfettiEffect'
import confetti from 'canvas-confetti'
import PrintLesson from '@/components/PrintLesson'
import ReadingProgressBar from '@/components/ReadingProgressBar'
import LessonShareButton from '@/components/LessonShareButton'
import MilestoneModal from '@/components/MilestoneModal'
import XPLevelUp from '@/components/XPLevelUp'
import Metronome from '@/components/Metronome'
import AudioSpeedControl from '@/components/AudioSpeedControl'
import TechniqueTooltip from '@/components/TechniqueTooltip'
import KeyboardShortcutMap from '@/components/KeyboardShortcutMap'
import LessonQuiz from '@/components/LessonQuiz'
import SpeedTrainer from '@/components/SpeedTrainer'
import FretboardDiagram from '@/components/FretboardDiagram'
import LessonComments from '@/components/LessonComments'
import NpsSurveyModal from '@/components/NpsSurveyModal'
import CoachChat from '@/components/CoachChat'
import MicrophoneMode from '@/components/MicrophoneMode'
import PerformanceRecorder from '@/components/PerformanceRecorder'
import LessonTip from '@/components/LessonTip'
import { LESSON_TIPS } from '@/lib/lesson-tips'
import ConfettiBurst from '@/components/ConfettiBurst'

type ActiveTab = 'learn' | 'play' | 'review' | 'community'

const TABS: { id: ActiveTab; label: string }[] = [
  { id: 'learn', label: 'Learn' },
  { id: 'play', label: 'Play' },
  { id: 'review', label: 'Review' },
  { id: 'community', label: 'Community' },
]

interface LessonClientProps {
  lesson: Lesson
  existingProgress: {
    completed: boolean
    difficulty: string | null
    difficultAreas: string | null
    rating: number | null
    notes: string | null
  } | null
  audioUrl: string | null
  audioLabel: string | null
  currentDay: number
  completionPct: number
  userId?: string
  userName?: string
}

const DIFFICULT_AREAS = ['Bends', 'Timing', 'Speed', 'Memorization', 'Picking', 'Transitions']

export default function LessonClient({
  lesson,
  existingProgress,
  audioUrl,
  audioLabel,
  currentDay: _currentDay,
  completionPct,
  userId,
  userName = 'Student',
}: LessonClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ActiveTab>('learn')
  const [difficulty, setDifficulty] = useState(existingProgress?.difficulty ?? '')
  const [difficultAreas, setDifficultAreas] = useState<string[]>(
    existingProgress?.difficultAreas ? existingProgress.difficultAreas.split(',') : []
  )
  const [rating, setRating] = useState(existingProgress?.rating ?? 0)
  const [notes, setNotes] = useState(existingProgress?.notes ?? '')
  const [completing, setCompleting] = useState(false)
  const [completed, setCompleted] = useState(existingProgress?.completed ?? false)
  const [optimisticComplete, setOptimisticComplete] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const [newAchievements, setNewAchievements] = useState<string[]>([])
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [showMilestone, setShowMilestone] = useState(false)
  const [milestoneDay, setMilestoneDay] = useState(0)
  const [levelUp, setLevelUp] = useState<{ from: string; to: string } | null>(null)
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  // readProgress is now tracked inside ReadingProgressBar component
  const [quizDone, setQuizDone] = useState(false)
  const [showSwipeHint, setShowSwipeHint] = useState(false)
  const [coachMessages, setCoachMessages] = useState<CoachMessageRecord[]>([])
  const [showNps, setShowNps] = useState(false)
  const [announcement, setAnnouncement] = useState<string>('')

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const notesDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirstNotesRender = useRef(true)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  // Restore tab from sessionStorage / URL hash on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(`lesson-${lesson.day}-tab`)
      if (saved && ['learn', 'play', 'review', 'community'].includes(saved)) {
        setActiveTab(saved as ActiveTab)
        return
      }
    } catch {}
    const hash = typeof window !== 'undefined' ? window.location.hash.slice(1) : ''
    if (['play', 'review', 'community'].includes(hash)) {
      setActiveTab(hash as ActiveTab)
    }
  }, [lesson.day])

  // Save tab + update URL hash
  const switchTab = (tab: ActiveTab) => {
    const currentLabel = TABS.find((t) => t.id === activeTab)?.label ?? activeTab
    setAnnouncement(`Section ${currentLabel} completed!`)
    setActiveTab(tab)
    try {
      sessionStorage.setItem(`lesson-${lesson.day}-tab`, tab)
    } catch {}
    if (typeof window !== 'undefined') {
      history.replaceState(
        null,
        '',
        tab === 'learn'
          ? window.location.pathname
          : `${window.location.pathname}#${tab}`
      )
    }
  }

  // Load coach message history
  useEffect(() => {
    fetch('/api/coach')
      .then((r) => r.json())
      .then((data: { messages?: CoachMessageRecord[] }) => {
        setCoachMessages(data.messages ?? [])
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => setTimerSeconds((s) => s + 1), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [timerRunning])

  // Debounced notes auto-save
  useEffect(() => {
    if (isFirstNotesRender.current) {
      isFirstNotesRender.current = false
      return
    }
    try {
      localStorage.setItem(`lesson-${lesson.day}-notes`, notes)
    } catch {}
    if (notesDebounceRef.current) clearTimeout(notesDebounceRef.current)
    notesDebounceRef.current = setTimeout(() => {
      fetch('/api/progress', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day: lesson.day, notes }),
      }).catch(() => {})
    }, 1500)
    return () => {
      if (notesDebounceRef.current) clearTimeout(notesDebounceRef.current)
    }
  }, [notes, lesson.day])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLButtonElement
      )
        return
      if (e.key === 'ArrowLeft' && lesson.day > 1) {
        router.push(`/lesson/${lesson.day - 1}`)
      } else if (e.key === 'ArrowRight' && lesson.day < 30) {
        router.push(`/lesson/${lesson.day + 1}`)
      } else if (e.key === 'Enter') {
        setTimerRunning((r) => !r)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lesson.day, router])

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 640px)').matches
    if (!isMobile) return
    setShowSwipeHint(true)
    const t = setTimeout(() => setShowSwipeHint(false), 3000)
    return () => clearTimeout(t)
  }, [])

  // Browser tab title
  useEffect(() => {
    document.title = `Day ${lesson.day} of 30 — First Guitar Solo`
    return () => { document.title = 'First Guitar Solo' }
  }, [lesson.day])

  // Load notes from localStorage on mount if no server-side notes saved
  useEffect(() => {
    if (!existingProgress?.notes) {
      try {
        const saved = localStorage.getItem(`lesson-${lesson.day}-notes`)
        if (saved) setNotes(saved)
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    )
      return

    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current)

    if (Math.abs(dx) > 80 && Math.abs(dx) > dy) {
      if (dx < 0 && lesson.day < 30) {
        router.push(`/lesson/${lesson.day + 1}`)
      } else if (dx > 0 && lesson.day > 1) {
        router.push(`/lesson/${lesson.day - 1}`)
      }
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  const toggleArea = (area: string) => {
    setDifficultAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    )
  }

  const completeLesson = async () => {
    if (completing) return
    setOptimisticComplete(true)
    triggerConfetti()
    if ([7, 14, 21].includes(lesson.day)) {
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 }, colors: ['#f59e0b', '#fde68a', '#ffffff'] })
    }
    setCompleting(true)

    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day: lesson.day,
          difficulty,
          difficultAreas: difficultAreas.join(','),
          rating: rating || null,
          notes,
        }),
      })

      const data = (await res.json()) as {
        xpEarned?: number
        newAchievements?: string[]
        alreadyCompleted?: boolean
        totalXPBefore?: number
        totalXPAfter?: number
      }

      if (res.ok) {
        await fetch('/api/practice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ day: lesson.day, duration: lesson.duration, difficulty }),
        })

        const earned = data.xpEarned ?? lesson.xpReward
        setCompleted(true)
        setAnnouncement(`Day ${lesson.day} complete! Great work!`)
        setXpEarned(earned)
        setNewAchievements(data.newAchievements ?? [])
        setShowToast(true)
        setTimeout(() => setShowToast(false), 5000)

        try {
          if (navigator.vibrate) navigator.vibrate([80, 40, 120])
        } catch {}

        if (lesson.quiz && lesson.quiz.length > 0) {
          setShowQuiz(true)
          // Switch to review tab to show the quiz
          switchTab('review')
        }

        if ([7, 14, 21, 30].includes(lesson.day)) {
          setMilestoneDay(lesson.day)
          setShowMilestone(true)
        }

        if (data.totalXPBefore !== undefined && data.totalXPAfter !== undefined) {
          const fromLevel = getXPLevel(data.totalXPBefore)
          const toLevel = getXPLevel(data.totalXPAfter)
          if (fromLevel !== toLevel) {
            setLevelUp({ from: fromLevel, to: toLevel })
          }
        }

        if (lesson.day === 15) {
          setTimeout(() => setShowNps(true), 2000)
        }
      }
    } catch {
      setOptimisticComplete(false)
    } finally {
      setCompleting(false)
    }
  }

  const handleQuizComplete = (_score: number) => {
    setShowQuiz(false)
    setQuizDone(true)
  }

  const handleCompleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setTimeout(() => setRipple(null), 600)
    void completeLesson()
  }

  const getXPLevel = (xp: number) => {
    if (xp >= 2000) return 'Solo Artist'
    if (xp >= 1000) return 'Lead Guitarist'
    if (xp >= 500) return 'Practitioner'
    if (xp >= 200) return 'Student'
    return 'Beginner'
  }

  function downloadTab() {
    const content = `Day ${lesson.day} Guitar TAB\n\nFirst Guitar Solo — 30-Day Program\n\n[Professional TAB notation will be available here once audio assets are finalized]\n\nVisit firstguitarsolo.com for the full program`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `day-${lesson.day}-tab.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  function getTechniqueColor(tech: string): { bg: string; border: string; text: string } {
    const t = tech.toLowerCase()
    if (t.includes('bend') || t.includes('vibrato')) return { bg: '#1a0f00', border: '#78350f', text: '#fb923c' }
    if (t.includes('hammer') || t.includes('pull')) return { bg: '#0f0f1a', border: '#3b1f5e', text: '#c4b5fd' }
    if (t.includes('slide')) return { bg: '#0f1a1a', border: '#0e4444', text: '#5eead4' }
    if (t.includes('pick') || t.includes('alternate')) return { bg: '#1a1200', border: '#78350f', text: '#f59e0b' }
    if (t.includes('scale') || t.includes('pentatonic')) return { bg: '#0f1a0f', border: '#1a5e1a', text: '#86efac' }
    return { bg: '#111111', border: '#262626', text: '#a3a3a3' }
  }

  const weekColors = ['#f59e0b', '#0ea5e9', '#a855f7', '#22c55e']
  const weekColor = weekColors[(lesson.week - 1) % weekColors.length]

  const lessonContext = {
    day: lesson.day,
    title: lesson.title,
    techniques: lesson.techniques,
    difficulty: difficulty || undefined,
    commonMistakes: lesson.commonMistakes,
  }

  const showFretboard = lesson.techniques.some((t) =>
    ['pentatonic box 1', 'pentatonic scale', 'box patterns', 'ascending/descending', 'scale fingering'].includes(t)
  )

  return (
    <>
      <ConfettiBurst trigger={optimisticComplete} />
      <ReadingProgressBar />

      <main
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label={`Lesson: Day ${lesson.day} — ${lesson.title}`}
      >
        <style>{`
          .lesson-content h3 { color: #ffffff; font-weight: 700; font-size: 1rem; margin-top: 1.5rem; margin-bottom: 0.5rem; }
          .lesson-content p { color: #d4d4d4; font-size: 0.875rem; line-height: 1.75; margin-bottom: 0.75rem; }
          .lesson-content ul { list-style: disc; padding-left: 1.5rem; color: #d4d4d4; font-size: 0.875rem; margin-bottom: 0.75rem; }
          .lesson-content ol { list-style: decimal; padding-left: 1.5rem; color: #d4d4d4; font-size: 0.875rem; margin-bottom: 0.75rem; }
          .lesson-content li { margin-bottom: 0.25rem; line-height: 1.6; }
          .lesson-content pre { background-color: #1a1a1a; border: 1px solid #262626; padding: 1rem; border-radius: 0.5rem; font-size: 0.8rem; overflow-x: auto; margin-bottom: 1rem; color: #86efac; }
          .lesson-content strong { color: #f59e0b; font-weight: 600; }
          @keyframes rippleEffect { 0% { transform: translate(-50%,-50%) scale(0); opacity: 0.6; } 100% { transform: translate(-50%,-50%) scale(20); opacity: 0; } }
          @keyframes tabFadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>

        {/* Mobile swipe hint */}
        {showSwipeHint && (
          <div
            aria-hidden="true"
            style={{
              position: 'fixed',
              bottom: 80,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0,0,0,0.75)',
              border: '1px solid #262626',
              borderRadius: 9999,
              padding: '6px 16px',
              fontSize: '0.75rem',
              color: '#a3a3a3',
              zIndex: 30,
              pointerEvents: 'none',
            }}
          >
            &larr; Swipe to navigate lessons &rarr;
          </div>
        )}

        {/* 30-day progress bar */}
        <div
          style={{
            height: 4,
            backgroundColor: '#1a1a1a',
            borderRadius: 2,
            overflow: 'hidden',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#f59e0b',
              width: `${Math.min(100, Math.max(0, completionPct))}%`,
              height: '100%',
              borderRadius: 2,
              transition: 'width 0.4s ease',
            }}
            aria-label={`${Math.round(completionPct)}% of 30-day program complete`}
          />
        </div>

        {/* ─── LESSON HEADER ─── */}
        <div style={{
          background: 'linear-gradient(135deg, #0f0c00 0%, #0a0a0a 50%, #111111 100%)',
          borderBottom: '1px solid #1f1f1f',
          padding: '24px 16px 16px',
          marginLeft: '-1rem',
          marginRight: '-1rem',
          marginBottom: '0',
        }}>
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-4">
              <Link href="/lessons" style={{ color: '#525252', fontSize: '0.75rem' }}>Lessons</Link>
              <span style={{ color: '#404040', fontSize: '0.75rem' }}>›</span>
              <span style={{ color: '#737373', fontSize: '0.75rem' }}>Day {lesson.day}</span>
            </div>

            {/* Day number + title */}
            <div className="flex items-start gap-6 mb-4">
              <div style={{
                fontSize: 'clamp(3rem, 8vw, 5rem)',
                fontWeight: 900,
                color: '#f59e0b',
                lineHeight: 1,
                letterSpacing: '0.02em',
                flexShrink: 0,
                textShadow: '0 0 40px rgba(245,158,11,0.3)',
              }}>
                {lesson.day}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-white font-black text-2xl sm:text-3xl leading-tight mb-1">{lesson.title}</h1>
                <p style={{ color: '#a3a3a3' }} className="text-sm leading-relaxed">{lesson.subtitle}</p>
              </div>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2">
              <span style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#737373' }} className="text-xs px-3 py-1 rounded-full font-medium">
                ⏱ {lesson.duration} min
              </span>
              {lesson.bpmTarget && (
                <span style={{ backgroundColor: '#1a1200', border: '1px solid #78350f', color: '#f59e0b' }} className="text-xs px-3 py-1 rounded-full font-bold">
                  🎵 {lesson.bpmTarget} BPM target
                </span>
              )}
              <span style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f', color: '#525252' }} className="text-xs px-3 py-1 rounded-full">
                Week {lesson.week}
              </span>
              {lesson.techniques.map((tech) => {
                const color = getTechniqueColor(tech)
                return (
                  <span key={tech} style={{ backgroundColor: color.bg, border: `1px solid ${color.border}`, color: color.text }} className="text-xs px-3 py-1 rounded-full font-semibold">
                    {tech}
                  </span>
                )
              })}
              {(optimisticComplete || completed) && (
                <span style={{ backgroundColor: '#052e16', color: '#86efac', border: '1px solid #166534' }} className="text-xs px-3 py-1 rounded-full font-bold">
                  ✓ Completed
                </span>
              )}
              <button
                onClick={downloadTab}
                style={{ color: '#737373', fontSize: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem 0', marginLeft: 4 }}
                className="hover:text-white transition-colors"
                aria-label={`Download Day ${lesson.day} TAB`}
              >
                ⬇ Download TAB
              </button>
            </div>
          </div>
        </div>

        {/* Keyboard nav hint */}
        <div className="hidden sm:flex justify-between items-center mb-4">
          {lesson.day > 1 ? (
            <button
              onClick={() => router.push(`/lesson/${lesson.day - 1}`)}
              style={{ color: '#525252', border: '1px solid #1f1f1f' }}
              className="text-xs px-3 py-1.5 rounded-lg hover:text-white hover:border-gray-600 transition-colors flex items-center gap-1.5"
            >
              &#8592; Day {lesson.day - 1}
              <span style={{ color: '#404040' }} className="text-xs">
                (&#8592;)
              </span>
            </button>
          ) : (
            <div />
          )}
          {lesson.day < 30 && (
            <button
              onClick={() => router.push(`/lesson/${lesson.day + 1}`)}
              style={{ color: '#525252', border: '1px solid #1f1f1f' }}
              className="text-xs px-3 py-1.5 rounded-lg hover:text-white hover:border-gray-600 transition-colors flex items-center gap-1.5"
            >
              <span style={{ color: '#404040' }} className="text-xs">
                (&#8594;)
              </span>
              Day {lesson.day + 1} &#8594;
            </button>
          )}
        </div>

        {/* ─── STICKY TAB BAR ─── */}
        <div
          style={{
            position: 'sticky',
            top: 64,
            zIndex: 30,
            backgroundColor: '#0a0a0a',
            borderBottom: '1px solid #1f1f1f',
            marginBottom: '1.5rem',
            marginLeft: '-1rem',
            marginRight: '-1rem',
            paddingLeft: '1rem',
            paddingRight: '1rem',
          }}
        >
          <div style={{ display: 'flex', gap: 0 }}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => switchTab(tab.id)}
                  style={{
                    padding: '0.75rem 1.25rem',
                    fontSize: '0.8rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#ffffff' : '#525252',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottomColor: isActive ? '#f59e0b' : 'transparent',
                    borderBottomStyle: 'solid',
                    borderBottomWidth: 2,
                    cursor: 'pointer',
                    transition: 'color 0.15s ease, border-color 0.15s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* ─── TAB: LEARN ─── */}
        <div
          style={{
            display: activeTab === 'learn' ? 'block' : 'none',
            animation: activeTab === 'learn' ? 'tabFadeIn 0.15s ease' : 'none',
          }}
        >
          {/* XP badge row */}
          <div className="flex flex-wrap gap-2 mb-6 mt-2">
            <span
              style={{
                backgroundColor: '#1a0f00',
                color: '#f59e0b',
                border: '1px solid #78350f',
              }}
              className="text-xs px-3 py-1 rounded font-bold"
            >
              +{lesson.xpReward} XP
            </span>
            {lesson.soloSection && (
              <span
                style={{
                  backgroundColor: '#160a1f',
                  color: '#a855f7',
                  border: '1px solid #6b21a8',
                }}
                className="text-xs px-3 py-1 rounded font-bold"
              >
                Solo Section {lesson.soloSection}
              </span>
            )}
          </div>

          {/* Pro Tip for milestone days */}
          {LESSON_TIPS[lesson.day] && (
            <LessonTip tip={LESSON_TIPS[lesson.day].tip} type={LESSON_TIPS[lesson.day].type} />
          )}

          {/* Why This Matters */}
          <div style={{ borderLeft: '3px solid #f59e0b', paddingLeft: 12, marginBottom: 8 }}>
            <h3 style={{ color: '#f59e0b', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Why This Matters</h3>
          </div>
          <p style={{ color: '#d4d4d4', lineHeight: 1.8, fontSize: '0.9375rem', marginBottom: '1.5rem' }}>{lesson.why}</p>

          {/* Prerequisites */}
          {lesson.prerequisites && lesson.prerequisites.length > 0 && (
            <div
              style={{
                backgroundColor: '#0a0a0a',
                border: '1px solid #1f1f1f',
                borderRadius: '0.5rem',
                padding: '0.875rem',
                marginBottom: '1.5rem',
              }}
            >
              <p
                style={{ color: '#f59e0b' }}
                className="text-xs font-bold uppercase tracking-wider mb-2"
              >
                Before This Lesson
              </p>
              <ul className="flex flex-col gap-1">
                {lesson.prerequisites.map((p, i) => (
                  <li
                    key={i}
                    style={{ color: '#a3a3a3' }}
                    className="text-xs flex items-start gap-2"
                  >
                    <span style={{ color: '#f59e0b', flexShrink: 0 }}>&#8227;</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Techniques with tooltips */}
          <div className="flex flex-wrap gap-2 mb-6">
            {lesson.techniques.map((tech) => (
              <TechniqueTooltip key={tech} term={tech}>
                <span
                  style={{
                    backgroundColor: '#1a1a1a',
                    color: '#a3a3a3',
                    border: '1px solid #262626',
                    cursor: 'default',
                  }}
                  className="text-xs px-3 py-1 rounded capitalize inline-block"
                >
                  {tech}
                </span>
              </TechniqueTooltip>
            ))}
          </div>

          {/* Main lesson content */}
          <section className="mb-6">
            <div style={{ borderLeft: '3px solid #f59e0b', paddingLeft: 12, marginBottom: 8 }}>
              <h3 style={{ color: '#f59e0b', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Lesson Content</h3>
            </div>
            <div
              style={{ color: '#d4d4d4', lineHeight: 1.8, fontSize: '0.9375rem' }}
              className="prose prose-sm max-w-none lesson-content"
              dangerouslySetInnerHTML={{ __html: lesson.mainContent }}
            />
          </section>

          {/* Bonus content */}
          {lesson.bonusContent && (
            <section
              style={{
                backgroundColor: '#111111',
                border: '1px solid #262626',
                borderLeft: '4px solid #a855f7',
              }}
              className="rounded-r-lg p-5 mb-6"
            >
              <h2
                style={{ color: '#a855f7' }}
                className="text-xs font-bold uppercase tracking-widest mb-3"
              >
                Bonus — Go Deeper
              </h2>
              <p style={{ color: '#d4d4d4' }} className="text-sm leading-relaxed">
                {lesson.bonusContent}
              </p>
            </section>
          )}

          {/* Common mistakes */}
          {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
            <section
              style={{
                backgroundColor: '#111111',
                border: '1px solid #262626',
                borderLeft: '4px solid #ef4444',
              }}
              className="rounded-r-lg p-5 mb-6"
            >
              <h2
                style={{ color: '#ef4444' }}
                className="text-xs font-bold uppercase tracking-widest mb-3"
              >
                Common Mistakes
              </h2>
              <ul className="flex flex-col gap-2">
                {lesson.commonMistakes.map((m, i) => (
                  <li
                    key={i}
                    style={{ color: '#d4d4d4' }}
                    className="text-sm flex items-start gap-2 leading-relaxed"
                  >
                    <span style={{ color: '#ef4444', flexShrink: 0, marginTop: 2 }}>
                      &#9888;
                    </span>
                    {m}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Cross-references */}
          {lesson.crossRefs && lesson.crossRefs.length > 0 && (
            <section className="mb-6">
              <h2
                style={{ color: '#a3a3a3' }}
                className="text-xs font-bold uppercase tracking-widest mb-3"
              >
                Connects To
              </h2>
              <div className="flex flex-col gap-2">
                {lesson.crossRefs.map((ref, i) => (
                  <a
                    key={i}
                    href={`/lesson/${ref.day}`}
                    style={{
                      backgroundColor: '#111111',
                      border: '1px solid #1f1f1f',
                      borderRadius: '0.5rem',
                      padding: '0.625rem 0.875rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.625rem',
                      textDecoration: 'none',
                    }}
                    className="hover:border-gray-600 transition-colors"
                  >
                    <span
                      style={{
                        backgroundColor: '#1a0f00',
                        color: '#f59e0b',
                        borderRadius: '0.25rem',
                        padding: '0.125rem 0.375rem',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      Day {ref.day}
                    </span>
                    <span style={{ color: '#a3a3a3' }} className="text-xs leading-relaxed">
                      {ref.description}
                    </span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Audio player */}
          <section className="mb-8">
            <h2 className="text-white text-xs font-bold uppercase tracking-widest mb-3">
              Audio
            </h2>
            {audioUrl ? (
              <AudioPlayer url={audioUrl} label={audioLabel ?? `Day ${lesson.day} Audio`} />
            ) : (
              <div style={{ textAlign: 'center', padding: '24px', opacity: 0.6 }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>🎸</div>
                <p
                  style={{
                    color: '#a3a3a3',
                    fontStyle: 'italic',
                    fontSize: '0.875rem',
                  }}
                >
                  Audio coming soon — check back after the next update.
                </p>
              </div>
            )}
          </section>

          {/* Success Criteria */}
          {lesson.successCriteria && (
            <div style={{ backgroundColor: '#0f1a0f', border: '1px solid #166534', borderRadius: 12 }} className="p-4 mt-6 mb-8">
              <p style={{ color: '#86efac', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>✓ Ready to Move On When...</p>
              <p style={{ color: '#d4d4d4', lineHeight: 1.7, fontSize: '0.875rem' }}>{lesson.successCriteria}</p>
            </div>
          )}
        </div>

        {/* ─── TAB: PLAY ─── */}
        <div
          style={{
            display: activeTab === 'play' ? 'block' : 'none',
            animation: activeTab === 'play' ? 'tabFadeIn 0.15s ease' : 'none',
          }}
        >
          {/* Warmup */}
          <section className="mb-6">
            <h2
              style={{ color: '#a3a3a3' }}
              className="text-xs font-bold uppercase tracking-widest mb-3"
            >
              Warm-up
            </h2>
            <p style={{ color: '#a3a3a3' }} className="text-sm leading-relaxed">
              {lesson.warmup}
            </p>
          </section>

          {/* Fretboard diagram */}
          {showFretboard && (
            <section className="mb-6">
              <h2
                style={{ color: '#a3a3a3' }}
                className="text-xs font-bold uppercase tracking-widest mb-3"
              >
                Fretboard Reference
              </h2>
              <div className="overflow-x-auto">
                <FretboardDiagram
                  startFret={5}
                  title="A Minor Pentatonic — Box 1 (fret 5)"
                  notes={[
                    { string: 6, fret: 5, label: 'R', color: '#f59e0b' },
                    { string: 6, fret: 8, label: '♭3' },
                    { string: 5, fret: 5, label: '4' },
                    { string: 5, fret: 7, label: '5' },
                    { string: 4, fret: 5, label: '♭7' },
                    { string: 4, fret: 7, label: 'R', color: '#f59e0b' },
                    { string: 3, fret: 5, label: '♭3' },
                    { string: 3, fret: 7, label: '4' },
                    { string: 2, fret: 5, label: '5' },
                    { string: 2, fret: 8, label: '♭7' },
                    { string: 1, fret: 5, label: 'R', color: '#f59e0b' },
                    { string: 1, fret: 8, label: '♭3' },
                  ]}
                />
              </div>
            </section>
          )}

          {/* Exercise */}
          <section
            style={{
              backgroundColor: '#111111',
              border: '1px solid #262626',
              borderLeft: '4px solid #f59e0b',
            }}
            className="rounded-r-lg p-5 mb-6"
          >
            <h2
              style={{ color: '#f59e0b' }}
              className="text-xs font-bold uppercase tracking-widest mb-3"
            >
              Today&apos;s Exercise
            </h2>
            <p style={{ color: '#d4d4d4' }} className="text-sm leading-relaxed">
              {lesson.exercise}
            </p>
          </section>

          {/* Speed Trainer */}
          <section className="mb-6">
            <SpeedTrainer />
          </section>

          {/* Practice Tools */}
          <section className="mb-6">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 style={{ color: '#a3a3a3' }} className="text-xs font-bold uppercase tracking-widest">
                Practice Tools
              </h2>
              <Link
                href="/practice-room"
                style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none' }}
              >
                Open Practice Room →
              </Link>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ flex: '1 1 260px', minWidth: 0 }}>
                <Metronome />
              </div>
              {audioUrl && (
                <div style={{ flex: '1 1 260px', minWidth: 0 }}>
                  <AudioSpeedControl src={audioUrl} label={audioLabel ?? `Day ${lesson.day} Audio`} />
                </div>
              )}
            </div>
          </section>

          {/* Practice Timer */}
          <section
            style={{ backgroundColor: '#111111', border: '1px solid #262626' }}
            className="rounded-xl p-5 mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white text-xs font-bold uppercase tracking-widest mb-0.5">
                  Practice Timer
                </h2>
                <p style={{ color: '#525252' }} className="text-xs">
                  Track your session time
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  style={{
                    color: timerRunning ? '#f59e0b' : '#ffffff',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                  className="text-3xl font-black tracking-tight"
                >
                  {formatTimer(timerSeconds)}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTimerRunning((r) => !r)}
                    style={{
                      backgroundColor: timerRunning ? '#1a1a1a' : '#f59e0b',
                      color: timerRunning ? '#a3a3a3' : '#000',
                      border: timerRunning ? '1px solid #262626' : 'none',
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all"
                  >
                    {timerRunning ? 'Pause' : timerSeconds > 0 ? 'Resume' : 'Start'}
                  </button>
                  {timerSeconds > 0 && !timerRunning && (
                    <button
                      onClick={() => {
                        setTimerSeconds(0)
                        setTimerRunning(false)
                      }}
                      style={{ color: '#525252', border: '1px solid #262626' }}
                      className="px-3 py-2 rounded-lg text-xs transition-colors hover:text-white"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
            {timerSeconds > 0 && (
              <div className="mt-3">
                <div
                  style={{ backgroundColor: '#1a1a1a', height: 4 }}
                  className="rounded-full overflow-hidden"
                >
                  <div
                    style={{
                      backgroundColor: '#f59e0b',
                      width: `${Math.min(100, (timerSeconds / (lesson.duration * 60)) * 100)}%`,
                      height: '100%',
                      transition: 'width 1s linear',
                    }}
                    className="rounded-full"
                  />
                </div>
                <p style={{ color: '#525252' }} className="text-xs mt-1">
                  Target: {lesson.duration} min
                  {timerSeconds >= lesson.duration * 60 && (
                    <span style={{ color: '#f59e0b' }}> — Goal reached! ✓</span>
                  )}
                </p>
              </div>
            )}
          </section>

          {/* Microphone Practice Mode */}
          <section className="mb-6">
            <h2
              style={{ color: '#a3a3a3' }}
              className="text-xs font-bold uppercase tracking-widest mb-3"
            >
              Mic Practice Mode
            </h2>
            <MicrophoneMode day={lesson.day} />
          </section>

          {/* Performance Recorder — days 25+ */}
          {lesson.day >= 25 && (
            <section className="mb-6">
              <PerformanceRecorder day={lesson.day} userName={userName} />
            </section>
          )}

          {/* AI Coach embedded */}
          <section className="mb-6">
            <h2
              style={{ color: '#a3a3a3' }}
              className="text-xs font-bold uppercase tracking-widest mb-3"
            >
              AI Coach
            </h2>
            <div
              style={{
                height: 450,
                border: '1px solid #1f1f1f',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CoachChat
                initialMessages={coachMessages}
                currentDay={lesson.day}
                lessonTitle={lesson.title}
                lessonContext={lessonContext}
              />
            </div>
          </section>

          {/* Mark Complete */}
          <section
            style={{ backgroundColor: '#111111', border: '1px solid #262626' }}
            className="rounded-xl p-6 mb-8"
          >
            {(optimisticComplete || completed) ? (
              <div>
                <div
                  style={{
                    backgroundColor: '#052e16',
                    border: '1px solid #166534',
                    color: '#86efac',
                  }}
                  className="rounded-lg px-4 py-3 text-sm mb-4"
                >
                  &#10003; Lesson completed! +{xpEarned} XP earned
                  {newAchievements.length > 0 && (
                    <span className="ml-2">
                      &#127942; {newAchievements.join(', ')}
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  {lesson.day < 30 && (
                    <Link
                      href={`/lesson/${lesson.day + 1}`}
                      style={{ backgroundColor: '#f59e0b', color: '#000' }}
                      className="flex-1 py-3 rounded-lg font-black text-sm uppercase tracking-wider text-center hover:opacity-90 transition-opacity"
                    >
                      Next: Day {lesson.day + 1} &#8594;
                    </Link>
                  )}
                  {lesson.day === 30 && (
                    <Link
                      href="/dashboard"
                      style={{ backgroundColor: '#f59e0b', color: '#000' }}
                      className="flex-1 py-3 rounded-lg font-black text-sm uppercase tracking-wider text-center hover:opacity-90 transition-opacity"
                    >
                      Back to Dashboard &#8594;
                    </Link>
                  )}
                  <button
                    onClick={() => switchTab('review')}
                    style={{ border: '1px solid #262626', color: '#a3a3a3' }}
                    className="px-4 py-3 rounded-lg text-sm hover:text-white transition-colors"
                  >
                    Review Tab
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p style={{ color: '#525252' }} className="text-xs mb-4">
                  Finished practicing? Mark this lesson complete to earn your XP.
                </p>
                <button
                  onClick={handleCompleteClick}
                  disabled={completing}
                  style={{
                    backgroundColor: completing ? '#262626' : '#f59e0b',
                    color: completing ? '#a3a3a3' : '#000',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  className="w-full py-3 rounded-lg font-black text-sm uppercase tracking-wider transition-colors disabled:cursor-not-allowed"
                >
                  {completing ? 'Saving...' : 'Mark Complete'}
                  {ripple && (
                    <span
                      style={{
                        position: 'absolute',
                        left: ripple.x,
                        top: ripple.y,
                        width: 10,
                        height: 10,
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgba(255,255,255,0.4)',
                        borderRadius: '50%',
                        animation: 'rippleEffect 0.6s ease-out forwards',
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                </button>
              </>
            )}
          </section>
        </div>

        {/* ─── TAB: REVIEW ─── */}
        <div
          style={{
            display: activeTab === 'review' ? 'block' : 'none',
            animation: activeTab === 'review' ? 'tabFadeIn 0.15s ease' : 'none',
          }}
        >
          {/* Self-check */}
          <section
            style={{ backgroundColor: '#111111', border: '1px solid #262626' }}
            className="rounded-lg p-5 mb-6"
          >
            <h2 className="text-white text-xs font-bold uppercase tracking-widest mb-3">
              Self-Check
            </h2>
            <p style={{ color: '#a3a3a3' }} className="text-sm leading-relaxed">
              {lesson.selfCheck}
            </p>
            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <LessonShareButton day={lesson.day} title={lesson.title} />
              <PrintLesson day={lesson.day} title={lesson.title} />
            </div>
          </section>

          {/* How Did It Feel? */}
          <section
            style={{ backgroundColor: '#111111', border: '1px solid #262626' }}
            className="rounded-xl p-6 mb-6"
          >
            <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              How Did It Feel?
            </h2>

            <div className="mb-4">
              <div className="flex gap-2">
                {[
                  { val: 'easy', label: 'Easy' },
                  { val: 'good', label: 'Good Challenge' },
                  { val: 'struggled', label: 'Struggled' },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => setDifficulty(opt.val)}
                    disabled={optimisticComplete || completed}
                    style={{
                      backgroundColor: difficulty === opt.val ? '#f59e0b' : '#1a1a1a',
                      color: difficulty === opt.val ? '#000' : '#a3a3a3',
                      border: `1px solid ${difficulty === opt.val ? '#f59e0b' : '#262626'}`,
                    }}
                    className="flex-1 py-2 rounded-lg text-xs font-bold transition-colors disabled:cursor-not-allowed"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {difficulty === 'struggled' && (
              <div className="mb-4">
                <p style={{ color: '#a3a3a3' }} className="text-xs mb-2">
                  What was difficult?
                </p>
                <div className="flex flex-wrap gap-2">
                  {DIFFICULT_AREAS.map((area) => (
                    <button
                      key={area}
                      onClick={() => !(optimisticComplete || completed) && toggleArea(area)}
                      disabled={optimisticComplete || completed}
                      style={{
                        backgroundColor: difficultAreas.includes(area)
                          ? '#1a1a1a'
                          : 'transparent',
                        color: difficultAreas.includes(area) ? '#f59e0b' : '#a3a3a3',
                        border: `1px solid ${
                          difficultAreas.includes(area) ? '#f59e0b' : '#262626'
                        }`,
                      }}
                      className="text-xs px-3 py-1 rounded-full transition-colors disabled:cursor-not-allowed"
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <p style={{ color: '#a3a3a3' }} className="text-xs mb-2">
                Rate this lesson
              </p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => !(optimisticComplete || completed) && setRating(n)}
                    disabled={optimisticComplete || completed}
                    style={{
                      color: n <= rating ? '#f59e0b' : '#262626',
                      fontSize: '1.5rem',
                    }}
                    className="transition-colors disabled:cursor-not-allowed"
                  >
                    &#9733;
                  </button>
                ))}
              </div>
            </div>

            {!(optimisticComplete || completed) && (
              <button
                onClick={handleCompleteClick}
                disabled={completing}
                style={{
                  backgroundColor: completing ? '#262626' : '#f59e0b',
                  color: completing ? '#a3a3a3' : '#000',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                className="w-full py-3 rounded-lg font-black text-sm uppercase tracking-wider transition-colors disabled:cursor-not-allowed"
              >
                {completing ? 'Saving...' : 'Complete Lesson'}
                {ripple && (
                  <span
                    style={{
                      position: 'absolute',
                      left: ripple.x,
                      top: ripple.y,
                      width: 10,
                      height: 10,
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'rgba(255,255,255,0.4)',
                      borderRadius: '50%',
                      animation: 'rippleEffect 0.6s ease-out forwards',
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </button>
            )}

            {(optimisticComplete || completed) && (
              <div>
                <div
                  style={{
                    backgroundColor: '#052e16',
                    border: '1px solid #166534',
                    color: '#86efac',
                  }}
                  className="rounded-lg px-4 py-3 text-sm mb-4"
                >
                  &#10003; Lesson completed! +{xpEarned} XP earned
                  {newAchievements.length > 0 && (
                    <span className="ml-2">&#127942; {newAchievements.join(', ')}</span>
                  )}
                </div>
                {lesson.day < 30 && (
                  <Link
                    href={`/lesson/${lesson.day + 1}`}
                    style={{ backgroundColor: '#f59e0b', color: '#000' }}
                    className="block w-full py-3 rounded-lg font-black text-sm uppercase tracking-wider text-center hover:opacity-90 transition-opacity"
                  >
                    Next Lesson: Day {lesson.day + 1} &#8594;
                  </Link>
                )}
                {lesson.day === 30 && (
                  <Link
                    href="/dashboard"
                    style={{ backgroundColor: '#f59e0b', color: '#000' }}
                    className="block w-full py-3 rounded-lg font-black text-sm uppercase tracking-wider text-center hover:opacity-90 transition-opacity"
                  >
                    Back to Dashboard &#8594;
                  </Link>
                )}
              </div>
            )}
          </section>

          {/* Your Notes */}
          <section
            style={{ backgroundColor: '#111111', border: '1px solid #262626' }}
            className="rounded-xl p-5 mb-6"
          >
            <label
              htmlFor="lesson-notes"
              className="block text-white text-xs font-bold uppercase tracking-widest mb-3"
            >
              Your Notes
            </label>
            <textarea
              id="lesson-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write anything you want to remember about today's lesson..."
              rows={4}
              style={{
                backgroundColor: '#0a0a0a',
                border: '1px solid #262626',
                color: '#d4d4d4',
                borderRadius: '8px',
                padding: '10px 12px',
                width: '100%',
                fontSize: '0.875rem',
                lineHeight: '1.6',
                resize: 'vertical',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#f59e0b'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#262626'
              }}
            />
            <p style={{ color: '#404040' }} className="text-xs mt-2">
              Auto-saved as you type
            </p>
          </section>

          {/* Post-lesson Quiz */}
          {showQuiz && lesson.quiz && lesson.quiz.length > 0 && !quizDone && (
            <section className="mb-6">
              <LessonQuiz quiz={lesson.quiz} onComplete={handleQuizComplete} />
            </section>
          )}

          {quizDone && (
            <div
              style={{
                backgroundColor: '#052e16',
                border: '1px solid #166534',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                marginBottom: '1.5rem',
              }}
              className="flex items-center gap-2"
            >
              <span style={{ color: '#86efac' }} className="text-xs font-bold">
                &#10003; Knowledge check complete
              </span>
            </div>
          )}

          <div style={{ marginTop: 32 }}>
            <LessonComments day={lesson.day} userId={userId ?? ''} />
          </div>
        </div>

        {/* ─── TAB: COMMUNITY ─── */}
        <div
          style={{
            display: activeTab === 'community' ? 'block' : 'none',
            animation: activeTab === 'community' ? 'tabFadeIn 0.15s ease' : 'none',
          }}
        >
          <LessonComments day={lesson.day} userId={userId ?? ''} />
        </div>

        {/* ─── BOTTOM NAVIGATION ─── */}
        <div className="flex justify-between mt-4 mb-8">
          {lesson.day > 1 ? (
            <Link
              href={`/lesson/${lesson.day - 1}`}
              style={{ border: '1px solid #262626', color: '#a3a3a3' }}
              className="px-4 py-2 rounded-lg text-sm hover:text-white transition-colors"
            >
              &#8592; Day {lesson.day - 1}
            </Link>
          ) : (
            <div />
          )}
          <Link
            href="/lessons"
            style={{ border: '1px solid #262626', color: '#525252' }}
            className="px-4 py-2 rounded-lg text-sm hover:text-white transition-colors"
          >
            All Lessons
          </Link>
          {lesson.day < 30 ? (
            <Link
              href={`/lesson/${lesson.day + 1}`}
              style={{ border: '1px solid #262626', color: '#a3a3a3' }}
              className="px-4 py-2 rounded-lg text-sm hover:text-white transition-colors"
            >
              Day {lesson.day + 1} &#8594;
            </Link>
          ) : (
            <div />
          )}
        </div>

        {/* Toast */}
        {showToast && (
          <div
            style={{ backgroundColor: '#f59e0b', color: '#000' }}
            className="fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg font-bold text-sm z-50"
          >
            &#9733; +{xpEarned} XP!{' '}
            {newAchievements.length > 0 &&
              `Achievement unlocked: ${newAchievements.join(', ')}`}
          </div>
        )}

        {/* Back to top */}
        {showBackToTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #262626',
              color: '#a3a3a3',
            }}
            className="fixed bottom-6 left-6 w-10 h-10 rounded-full flex items-center justify-center hover:text-white hover:border-gray-500 transition-colors z-40 text-base"
            aria-label="Back to top"
          >
            &#8593;
          </button>
        )}

        {/* Milestone modal */}
        {showMilestone && (
          <MilestoneModal
            day={milestoneDay}
            xpEarned={xpEarned}
            onClose={() => setShowMilestone(false)}
          />
        )}

        {/* XP level-up */}
        {levelUp && (
          <XPLevelUp
            fromLevel={levelUp.from}
            toLevel={levelUp.to}
            onClose={() => setLevelUp(null)}
          />
        )}

        {/* Keyboard shortcut map */}
        <KeyboardShortcutMap />
      </main>

      {/* NPS Survey Modal */}
      {showNps && (
        <NpsSurveyModal
          isOpen={showNps}
          onClose={() => setShowNps(false)}
          onSubmit={async (score, comment) => {
            await fetch('/api/nps', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ score, comment }),
            }).catch(() => {})
            setShowNps(false)
          }}
        />
      )}

      {/* Screen-reader live region for lesson progress announcements */}
      <div
        role="status"
        aria-live="polite"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {announcement}
      </div>
    </>
  )
}
