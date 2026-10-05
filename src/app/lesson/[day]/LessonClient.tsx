'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Lesson } from '@/types'
import AudioPlayer from '@/components/AudioPlayer'
import { triggerConfetti } from '@/components/ConfettiEffect'
import MilestoneModal from '@/components/MilestoneModal'
import XPLevelUp from '@/components/XPLevelUp'
import Metronome from '@/components/Metronome'
import TechniqueTooltip from '@/components/TechniqueTooltip'
import KeyboardShortcutMap from '@/components/KeyboardShortcutMap'

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
}

const DIFFICULT_AREAS = ['Bends', 'Timing', 'Speed', 'Memorization', 'Picking', 'Transitions']

export default function LessonClient({ lesson, existingProgress, audioUrl, audioLabel, currentDay: _currentDay, completionPct }: LessonClientProps) {
  const router = useRouter()
  const [difficulty, setDifficulty] = useState(existingProgress?.difficulty ?? '')
  const [difficultAreas, setDifficultAreas] = useState<string[]>(
    existingProgress?.difficultAreas ? existingProgress.difficultAreas.split(',') : []
  )
  const [rating, setRating] = useState(existingProgress?.rating ?? 0)
  const [notes, setNotes] = useState(existingProgress?.notes ?? '')
  const [completing, setCompleting] = useState(false)
  const [completed, setCompleted] = useState(existingProgress?.completed ?? false)
  const [xpEarned, setXpEarned] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const [newAchievements, setNewAchievements] = useState<string[]>([])
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [showMilestone, setShowMilestone] = useState(false)
  const [milestoneDay, setMilestoneDay] = useState(0)
  const [levelUp, setLevelUp] = useState<{ from: string; to: string } | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const notesDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirstNotesRender = useRef(true)

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => setTimerSeconds((s) => s + 1), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [timerRunning])

  // Debounced notes auto-save
  useEffect(() => {
    if (isFirstNotesRender.current) {
      isFirstNotesRender.current = false
      return
    }
    try { localStorage.setItem(`lesson-${lesson.day}-notes`, notes) } catch {}
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
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLButtonElement) return
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

      const data = await res.json() as {
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
        setXpEarned(earned)
        setNewAchievements(data.newAchievements ?? [])
        setShowToast(true)
        setTimeout(() => setShowToast(false), 5000)

        triggerConfetti()

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
      }
    } catch {
      // ignore
    } finally {
      setCompleting(false)
    }
  }

  const getXPLevel = (xp: number) => {
    if (xp >= 2000) return 'Solo Artist'
    if (xp >= 1000) return 'Lead Guitarist'
    if (xp >= 500) return 'Practitioner'
    if (xp >= 200) return 'Student'
    return 'Beginner'
  }

  const weekColors = ['#f59e0b', '#0ea5e9', '#a855f7', '#22c55e']
  const weekColor = weekColors[(lesson.week - 1) % weekColors.length]

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 30-day progress bar */}
      <div style={{ height: 4, backgroundColor: '#1a1a1a', borderRadius: 2, overflow: 'hidden', marginBottom: '1.5rem' }}>
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

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 mb-6 flex-wrap">
        <Link href="/dashboard" style={{ color: '#525252' }} className="text-xs hover:text-white transition-colors">
          Dashboard
        </Link>
        <span style={{ color: '#404040' }} className="text-xs">&#8250;</span>
        <Link href="/lessons" style={{ color: '#525252' }} className="text-xs hover:text-white transition-colors">
          All Lessons
        </Link>
        <span style={{ color: '#404040' }} className="text-xs">&#8250;</span>
        <span style={{ color: weekColor }} className="text-xs font-bold uppercase tracking-wider">
          Day {lesson.day}: {lesson.title}
        </span>
      </nav>

      {/* Keyboard nav hint */}
      <div className="hidden sm:flex justify-between items-center mb-6">
        {lesson.day > 1 ? (
          <button
            onClick={() => router.push(`/lesson/${lesson.day - 1}`)}
            style={{ color: '#525252', border: '1px solid #1f1f1f' }}
            className="text-xs px-3 py-1.5 rounded-lg hover:text-white hover:border-gray-600 transition-colors flex items-center gap-1.5"
          >
            &#8592; Day {lesson.day - 1}
            <span style={{ color: '#404040' }} className="text-xs">(&#8592;)</span>
          </button>
        ) : <div />}
        {lesson.day < 30 && (
          <button
            onClick={() => router.push(`/lesson/${lesson.day + 1}`)}
            style={{ color: '#525252', border: '1px solid #1f1f1f' }}
            className="text-xs px-3 py-1.5 rounded-lg hover:text-white hover:border-gray-600 transition-colors flex items-center gap-1.5"
          >
            <span style={{ color: '#404040' }} className="text-xs">(&#8594;)</span>
            Day {lesson.day + 1} &#8594;
          </button>
        )}
      </div>

      {/* Title */}
      <h1 className="text-4xl font-black text-white uppercase mb-2">{lesson.title}</h1>
      <p style={{ color: '#a3a3a3' }} className="text-base mb-6">{lesson.subtitle}</p>

      {/* Why this matters */}
      <div style={{ borderLeft: '3px solid #f59e0b', backgroundColor: '#111111' }} className="pl-4 py-3 pr-4 rounded-r-lg mb-6">
        <p style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-wider mb-1">Why This Matters</p>
        <p style={{ color: '#a3a3a3' }} className="text-sm leading-relaxed">{lesson.why}</p>
      </div>

      {/* Duration badge */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span style={{ backgroundColor: '#1a1a1a', color: '#a3a3a3', border: '1px solid #262626' }} className="text-xs px-3 py-1 rounded font-medium">
          &#9201; {lesson.duration} min
        </span>
        <span style={{ backgroundColor: '#1a0f00', color: '#f59e0b', border: '1px solid #78350f' }} className="text-xs px-3 py-1 rounded font-bold">
          +{lesson.xpReward} XP
        </span>
        <span style={{ backgroundColor: '#1a1a1a', color: '#a3a3a3', border: '1px solid #262626' }} className="text-xs px-3 py-1 rounded">
          Week {lesson.week}
        </span>
        {lesson.soloSection && (
          <span style={{ backgroundColor: '#160a1f', color: '#a855f7', border: '1px solid #6b21a8' }} className="text-xs px-3 py-1 rounded font-bold">
            Solo Section {lesson.soloSection}
          </span>
        )}
        {completed && (
          <span style={{ backgroundColor: '#052e16', color: '#86efac', border: '1px solid #166534' }} className="text-xs px-3 py-1 rounded font-bold">
            ✓ Completed
          </span>
        )}
      </div>

      {/* Warmup */}
      <section className="mb-6">
        <h2 style={{ color: '#a3a3a3' }} className="text-xs font-bold uppercase tracking-widest mb-3">Warm-up</h2>
        <p style={{ color: '#a3a3a3' }} className="text-sm leading-relaxed">{lesson.warmup}</p>
      </section>

      {/* Main content */}
      <section className="mb-6">
        <h2 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Lesson Content</h2>
        <div
          style={{ color: '#d4d4d4' }}
          className="prose prose-sm max-w-none lesson-content"
          dangerouslySetInnerHTML={{ __html: lesson.mainContent }}
        />
      </section>

      {/* Exercise */}
      <section style={{ backgroundColor: '#111111', border: '1px solid #262626', borderLeft: '4px solid #f59e0b' }} className="rounded-r-lg p-5 mb-4">
        <h2 style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-widest mb-3">Today&apos;s Exercise</h2>
        <p style={{ color: '#d4d4d4' }} className="text-sm leading-relaxed">{lesson.exercise}</p>
      </section>

      {/* I'm stuck button */}
      <div className="mb-6 flex justify-end">
        <Link
          href={`/coach?prompt=${encodeURIComponent(`I'm stuck on Day ${lesson.day}: ${lesson.title}`)}`}
          style={{ color: '#f59e0b', border: '1px solid #f59e0b', backgroundColor: 'transparent' }}
          className="text-xs px-4 py-1.5 rounded-lg font-bold uppercase tracking-wider hover:opacity-80 transition-opacity inline-block"
        >
          I&apos;m Stuck — Ask Coach
        </Link>
      </div>

      {/* Self-check */}
      <section style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-lg p-5 mb-6">
        <h2 className="text-white text-xs font-bold uppercase tracking-widest mb-3">Self-Check</h2>
        <p style={{ color: '#a3a3a3' }} className="text-sm leading-relaxed">{lesson.selfCheck}</p>
      </section>

      {/* Techniques */}
      <div className="flex flex-wrap gap-2 mb-8">
        {lesson.techniques.map((tech) => (
          <TechniqueTooltip key={tech} term={tech}>
            <span
              style={{ backgroundColor: '#1a1a1a', color: '#a3a3a3', border: '1px solid #262626', cursor: 'default' }}
              className="text-xs px-3 py-1 rounded capitalize inline-block"
            >
              {tech}
            </span>
          </TechniqueTooltip>
        ))}
      </div>

      {/* Audio Player */}
      <section className="mb-8">
        <h2 className="text-white text-xs font-bold uppercase tracking-widest mb-3">Audio</h2>
        {audioUrl ? (
          <AudioPlayer url={audioUrl} label={audioLabel ?? `Day ${lesson.day} Audio`} />
        ) : (
          <div
            style={{ backgroundColor: '#111111', border: '1px dashed #262626' }}
            className="rounded-lg p-4 text-center"
          >
            <p style={{ color: '#a3a3a3' }} className="text-sm">Audio coming soon</p>
          </div>
        )}
      </section>

      {/* Practice timer */}
      <section style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white text-xs font-bold uppercase tracking-widest mb-0.5">Practice Timer</h2>
            <p style={{ color: '#525252' }} className="text-xs">Track your session time</p>
          </div>
          <div className="flex items-center gap-3">
            <span
              style={{ color: timerRunning ? '#f59e0b' : '#ffffff', fontVariantNumeric: 'tabular-nums' }}
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
                  onClick={() => { setTimerSeconds(0); setTimerRunning(false) }}
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
            <div style={{ backgroundColor: '#1a1a1a', height: 4 }} className="rounded-full overflow-hidden">
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
              {timerSeconds >= lesson.duration * 60 && <span style={{ color: '#f59e0b' }}> — Goal reached! ✓</span>}
            </p>
          </div>
        )}
      </section>

      {/* Metronome */}
      <section className="mb-6">
        <Metronome />
      </section>

      {/* Self-assessment */}
      <section style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6 mb-6">
        <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-4">How Did It Feel?</h2>

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
                disabled={completed}
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
            <p style={{ color: '#a3a3a3' }} className="text-xs mb-2">What was difficult?</p>
            <div className="flex flex-wrap gap-2">
              {DIFFICULT_AREAS.map((area) => (
                <button
                  key={area}
                  onClick={() => !completed && toggleArea(area)}
                  disabled={completed}
                  style={{
                    backgroundColor: difficultAreas.includes(area) ? '#1a1a1a' : 'transparent',
                    color: difficultAreas.includes(area) ? '#f59e0b' : '#a3a3a3',
                    border: `1px solid ${difficultAreas.includes(area) ? '#f59e0b' : '#262626'}`,
                  }}
                  className="text-xs px-3 py-1 rounded-full transition-colors disabled:cursor-not-allowed"
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <p style={{ color: '#a3a3a3' }} className="text-xs mb-2">Rate this lesson</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => !completed && setRating(n)}
                disabled={completed}
                style={{ color: n <= rating ? '#f59e0b' : '#262626', fontSize: '1.5rem' }}
                className="transition-colors disabled:cursor-not-allowed"
              >
                &#9733;
              </button>
            ))}
          </div>
        </div>

        {completed ? (
          <div>
            <div style={{ backgroundColor: '#052e16', border: '1px solid #166534', color: '#86efac' }} className="rounded-lg px-4 py-3 text-sm mb-4">
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
        ) : (
          <button
            onClick={completeLesson}
            disabled={completing}
            style={{ backgroundColor: completing ? '#262626' : '#f59e0b', color: completing ? '#a3a3a3' : '#000' }}
            className="w-full py-3 rounded-lg font-black text-sm uppercase tracking-wider transition-colors disabled:cursor-not-allowed"
          >
            {completing ? 'Saving...' : 'Complete Lesson'}
          </button>
        )}
      </section>

      {/* Your Notes */}
      <section style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-5 mb-8">
        <label htmlFor="lesson-notes" className="block text-white text-xs font-bold uppercase tracking-widest mb-3">
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
          onFocus={(e) => { e.currentTarget.style.borderColor = '#f59e0b' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = '#262626' }}
        />
        <p style={{ color: '#404040' }} className="text-xs mt-2">Auto-saved as you type</p>
      </section>

      {/* Bottom navigation */}
      <div className="flex justify-between mt-4 mb-8">
        {lesson.day > 1 ? (
          <Link
            href={`/lesson/${lesson.day - 1}`}
            style={{ border: '1px solid #262626', color: '#a3a3a3' }}
            className="px-4 py-2 rounded-lg text-sm hover:text-white transition-colors"
          >
            &#8592; Day {lesson.day - 1}
          </Link>
        ) : <div />}
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
        ) : <div />}
      </div>

      {/* Toast */}
      {showToast && (
        <div
          style={{ backgroundColor: '#f59e0b', color: '#000' }}
          className="fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg font-bold text-sm z-50"
        >
          &#9733; +{xpEarned} XP! {newAchievements.length > 0 && `Achievement unlocked: ${newAchievements.join(', ')}`}
        </div>
      )}

      {/* Back to top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#a3a3a3' }}
          className="fixed bottom-6 left-6 w-10 h-10 rounded-full flex items-center justify-center hover:text-white hover:border-gray-500 transition-colors z-40 text-base"
          aria-label="Back to top"
        >
          &#8593;
        </button>
      )}

      {/* Milestone modal */}
      {showMilestone && (
        <MilestoneModal day={milestoneDay} xpEarned={xpEarned} onClose={() => setShowMilestone(false)} />
      )}

      {/* XP level-up */}
      {levelUp && (
        <XPLevelUp fromLevel={levelUp.from} toLevel={levelUp.to} onClose={() => setLevelUp(null)} />
      )}

      {/* Keyboard shortcut map */}
      <KeyboardShortcutMap />

      <style>{`
        .lesson-content h3 { color: #ffffff; font-weight: 700; font-size: 1rem; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .lesson-content p { color: #d4d4d4; font-size: 0.875rem; line-height: 1.75; margin-bottom: 0.75rem; }
        .lesson-content ul { list-style: disc; padding-left: 1.5rem; color: #d4d4d4; font-size: 0.875rem; margin-bottom: 0.75rem; }
        .lesson-content ol { list-style: decimal; padding-left: 1.5rem; color: #d4d4d4; font-size: 0.875rem; margin-bottom: 0.75rem; }
        .lesson-content li { margin-bottom: 0.25rem; line-height: 1.6; }
        .lesson-content pre { background-color: #1a1a1a; border: 1px solid #262626; padding: 1rem; border-radius: 0.5rem; font-size: 0.8rem; overflow-x: auto; margin-bottom: 1rem; color: #86efac; }
        .lesson-content strong { color: #f59e0b; font-weight: 600; }
      `}</style>
    </main>
  )
}
