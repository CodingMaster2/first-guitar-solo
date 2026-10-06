'use client'

import { useState } from 'react'

interface QuizQuestion {
  question: string
  options: string[]
  correct: number
}

interface LessonQuizProps {
  quiz: QuizQuestion[]
  onComplete: (score: number) => void
}

export default function LessonQuiz({ quiz, onComplete }: LessonQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [animating, setAnimating] = useState(false)

  const current = quiz[currentIndex]
  const isCorrect = submitted && selected === current.correct
  const isLast = currentIndex === quiz.length - 1

  const handleSelect = (idx: number) => {
    if (submitted) return
    setSelected(idx)
  }

  const handleSubmit = () => {
    if (selected === null || submitted) return
    const correct = selected === current.correct
    if (correct) setScore((s) => s + 1)
    setSubmitted(true)
  }

  const handleNext = () => {
    setAnimating(true)
    setTimeout(() => {
      if (isLast) {
        const finalScore = score + (selected === current.correct ? 0 : 0)
        setFinished(true)
      } else {
        setCurrentIndex((i) => i + 1)
        setSelected(null)
        setSubmitted(false)
      }
      setAnimating(false)
    }, 200)
  }

  const xpForScore = (s: number) => {
    if (s === quiz.length) return 50
    if (s >= quiz.length - 1) return 30
    if (s > 0) return 15
    return 5
  }

  if (finished) {
    const bonusXP = xpForScore(score)
    return (
      <div
        style={{
          backgroundColor: '#111111',
          border: '1px solid #262626',
          borderTop: '3px solid #f59e0b',
          borderRadius: '0.75rem',
          padding: '1.5rem',
        }}
      >
        <p style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-wider mb-3">
          Quiz Complete
        </p>
        <p className="text-white text-2xl font-black mb-2">
          {score} / {quiz.length} correct
        </p>
        {score === quiz.length && (
          <p style={{ color: '#86efac' }} className="text-sm mb-4">
            Perfect score! +{bonusXP} bonus XP
          </p>
        )}
        {score < quiz.length && (
          <p style={{ color: '#a3a3a3' }} className="text-sm mb-4">
            {score > 0 ? `Good effort! +${bonusXP} bonus XP earned.` : `Keep practicing — you'll get it next time. +${bonusXP} XP for trying.`}
          </p>
        )}
        <button
          onClick={() => onComplete(score)}
          style={{ backgroundColor: '#f59e0b', color: '#000' }}
          className="px-6 py-2 rounded-lg font-black text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          Continue
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        backgroundColor: '#111111',
        border: '1px solid #262626',
        borderTop: '3px solid #f59e0b',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        opacity: animating ? 0 : 1,
        transition: 'opacity 0.2s ease',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <p style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-wider">
          Knowledge Check
        </p>
        <p style={{ color: '#525252' }} className="text-xs">
          {currentIndex + 1} / {quiz.length}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 mb-5">
        {quiz.map((_, i) => (
          <div
            key={i}
            style={{
              height: 3,
              flex: 1,
              borderRadius: 2,
              backgroundColor: i < currentIndex ? '#f59e0b' : i === currentIndex ? '#78350f' : '#262626',
            }}
          />
        ))}
      </div>

      <p className="text-white font-bold text-sm mb-4 leading-relaxed">{current.question}</p>

      <div className="flex flex-col gap-2 mb-5">
        {current.options.map((opt, idx) => {
          let bg = '#0a0a0a'
          let border = '#262626'
          let color = '#d4d4d4'

          if (submitted) {
            if (idx === current.correct) {
              bg = '#052e16'
              border = '#166534'
              color = '#86efac'
            } else if (idx === selected && idx !== current.correct) {
              bg = '#2d0a0a'
              border = '#7f1d1d'
              color = '#fca5a5'
            } else {
              color = '#525252'
            }
          } else if (selected === idx) {
            bg = '#1a0f00'
            border = '#f59e0b'
            color = '#f59e0b'
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={submitted}
              style={{
                backgroundColor: bg,
                border: `1px solid ${border}`,
                color,
                textAlign: 'left',
                borderRadius: '0.5rem',
                padding: '0.625rem 0.875rem',
                fontSize: '0.875rem',
                cursor: submitted ? 'default' : 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ color: '#404040', marginRight: '0.5rem', fontSize: '0.75rem' }}>
                {String.fromCharCode(65 + idx)}.
              </span>
              {opt}
              {submitted && idx === current.correct && (
                <span style={{ marginLeft: '0.5rem', color: '#86efac' }}>&#10003;</span>
              )}
              {submitted && idx === selected && idx !== current.correct && (
                <span style={{ marginLeft: '0.5rem', color: '#fca5a5' }}>&#10007;</span>
              )}
            </button>
          )
        })}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          style={{
            backgroundColor: selected !== null ? '#f59e0b' : '#262626',
            color: selected !== null ? '#000' : '#525252',
          }}
          className="px-5 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-colors disabled:cursor-not-allowed"
        >
          Submit Answer
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <div
            style={{
              backgroundColor: isCorrect ? '#052e16' : '#2d0a0a',
              border: `1px solid ${isCorrect ? '#166534' : '#7f1d1d'}`,
              color: isCorrect ? '#86efac' : '#fca5a5',
            }}
            className="text-xs px-3 py-1 rounded font-bold"
          >
            {isCorrect ? 'Correct!' : 'Not quite'}
          </div>
          <button
            onClick={handleNext}
            style={{ backgroundColor: '#f59e0b', color: '#000' }}
            className="px-5 py-2 rounded-lg font-black text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            {isLast ? 'See Results' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  )
}
