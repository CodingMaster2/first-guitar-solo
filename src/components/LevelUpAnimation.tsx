'use client'

import { useEffect } from 'react'

interface LevelUpAnimationProps {
  level: number
  show: boolean
  onComplete: () => void
}

export default function LevelUpAnimation({ level, show, onComplete }: LevelUpAnimationProps) {
  useEffect(() => {
    if (!show) return
    const timer = setTimeout(onComplete, 3000)
    return () => clearTimeout(timer)
  }, [show, onComplete])

  if (!show) return null

  return (
    <>
      <style>{`
        @keyframes levelUpIn {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes floatPulse {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
        .lua-card { animation: levelUpIn 0.4s ease-out forwards; }
        .lua-icon { animation: floatPulse 1.5s ease-in-out infinite; }
      `}</style>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}
        onClick={onComplete}
      >
        <div
          className="lua-card"
          style={{
            backgroundColor: '#111111',
            border: '2px solid #f59e0b',
            borderRadius: '1rem',
            padding: '2.5rem 2rem',
            maxWidth: '24rem',
            width: '100%',
            textAlign: 'center',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="lua-icon"
            style={{ fontSize: '3.5rem', lineHeight: 1, marginBottom: '1rem' }}
          >
            ⚡
          </div>
          <h2
            style={{
              color: '#f59e0b',
              fontSize: '2.25rem',
              fontWeight: 900,
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: '0.05em',
              marginBottom: '0.5rem',
            }}
          >
            LEVEL UP!
          </h2>
          <p style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
            You reached Level {level}
          </p>
          <p style={{ color: '#737373', fontSize: '0.75rem', marginBottom: '1.5rem' }}>
            Keep rocking!
          </p>
          <button
            onClick={onComplete}
            style={{
              backgroundColor: '#f59e0b',
              color: '#000000',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.625rem 2rem',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </>
  )
}
