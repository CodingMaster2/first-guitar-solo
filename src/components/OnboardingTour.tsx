'use client'

import { useState, useEffect } from 'react'

interface OnboardingTourProps {
  show: boolean
  onDone: () => void
}

interface Step {
  title: string
  description: string
  position: 'top' | 'middle' | 'bottom'
  side: 'left' | 'center' | 'right'
}

const STEPS: Step[] = [
  {
    title: 'Your Navigation',
    description: 'The top bar gives you quick access to Lessons, AI Coach, and your Progress. Everything you need is one click away.',
    position: 'top',
    side: 'center',
  },
  {
    title: 'Your Journey',
    description: 'This grid shows all 30 days. Amber squares are days you\'ve completed. Your current day pulses in the center.',
    position: 'middle',
    side: 'left',
  },
  {
    title: "Today's Lesson",
    description: 'Your daily lesson is right here. Each one takes 15–20 minutes and earns you XP. Hit Start to begin.',
    position: 'middle',
    side: 'right',
  },
  {
    title: 'AI Guitar Coach',
    description: 'Stuck on a technique? Ask the AI coach. It knows every lesson and can give you personalized tips.',
    position: 'bottom',
    side: 'left',
  },
]

const POSITION_STYLES: Record<string, React.CSSProperties> = {
  'top-center': { top: '80px', left: '50%', transform: 'translateX(-50%)' },
  'middle-left': { top: '45%', left: '20px', transform: 'none' },
  'middle-right': { top: '45%', right: '20px', left: 'auto', transform: 'none' },
  'bottom-left': { bottom: '100px', left: '20px', transform: 'none' },
}

const RING_STYLES: Record<string, React.CSSProperties> = {
  'top-center': { top: 0, left: '50%', width: '100%', height: '64px', transform: 'translateX(-50%)' },
  'middle-left': { top: '38%', left: 0, width: '55%', height: '30%' },
  'middle-right': { top: '38%', right: 0, left: 'auto', width: '42%', height: '30%' },
  'bottom-left': { bottom: '60px', left: 0, width: '30%', height: '120px' },
}

export default function OnboardingTour({ show, onDone }: OnboardingTourProps) {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!show) return
    try {
      if (localStorage.getItem('hasSeenTour')) return
    } catch {
      return
    }
    setVisible(true)
  }, [show])

  if (!visible) return null

  const current = STEPS[step]
  const posKey = `${current.position}-${current.side}`
  const tooltipStyle = POSITION_STYLES[posKey] ?? { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }
  const ringStyle = RING_STYLES[posKey] ?? {}

  const dismiss = () => {
    setVisible(false)
    try { localStorage.setItem('hasSeenTour', '1') } catch { /* ignore */ }
    onDone()
  }

  const next = () => {
    if (step + 1 >= STEPS.length) {
      dismiss()
    } else {
      setStep(step + 1)
    }
  }

  return (
    <>
      <style>{`
        @keyframes pulseRing {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.5), 0 0 0 4px rgba(245,158,11,0.2); }
          50% { box-shadow: 0 0 0 6px rgba(245,158,11,0.2), 0 0 0 12px rgba(245,158,11,0.05); }
        }
        .tour-ring { animation: pulseRing 1.8s ease-in-out infinite; }
        @keyframes fadeInTour { from { opacity: 0; transform: translateY(-8px) translateX(var(--tx, 0)); } to { opacity: 1; transform: translateY(0) translateX(var(--tx, 0)); } }
        .tour-tooltip { animation: fadeInTour 0.25s ease; }
      `}</style>

      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 pointer-events-none"
        style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      />

      {/* Highlight ring */}
      <div
        className="fixed z-50 rounded-xl pointer-events-none tour-ring"
        style={{
          border: '2px solid #f59e0b',
          position: 'fixed',
          ...ringStyle,
        }}
      />

      {/* Tooltip */}
      <div
        className="fixed z-[60] tour-tooltip"
        style={{
          maxWidth: 300,
          ...tooltipStyle,
        }}
      >
        <div
          style={{
            backgroundColor: '#111111',
            border: '1px solid #f59e0b',
            borderRadius: 12,
            padding: '16px 18px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-wider">
              Step {step + 1} / {STEPS.length}
            </span>
          </div>
          <p className="text-white font-bold text-sm mb-1">{current.title}</p>
          <p style={{ color: '#a3a3a3' }} className="text-xs leading-relaxed mb-4">
            {current.description}
          </p>
          <div className="flex gap-2 justify-between items-center">
            <button
              onClick={dismiss}
              style={{ color: '#525252' }}
              className="text-xs hover:text-white transition-colors"
            >
              Skip tour
            </button>
            <button
              onClick={next}
              style={{ backgroundColor: '#f59e0b', color: '#000' }}
              className="px-4 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
            >
              {step + 1 >= STEPS.length ? 'Done' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
