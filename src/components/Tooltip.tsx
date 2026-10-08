'use client'

import { useState } from 'react'
import type React from 'react'

interface TooltipProps {
  children: React.ReactNode
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export default function Tooltip({ children, content, position = 'top' }: TooltipProps) {
  const [visible, setVisible] = useState(false)

  let tooltipPos: React.CSSProperties = {}
  let arrowPos: React.CSSProperties = {}

  switch (position) {
    case 'top':
      tooltipPos = { bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' }
      arrowPos = {
        bottom: -3,
        left: '50%',
        transform: 'translateX(-50%)',
        borderLeft: '3px solid transparent',
        borderRight: '3px solid transparent',
        borderTop: '3px solid #1f1f1f',
      }
      break
    case 'bottom':
      tooltipPos = { top: 'calc(100% + 4px)', left: '50%', transform: 'translateX(-50%)' }
      arrowPos = {
        top: -3,
        left: '50%',
        transform: 'translateX(-50%)',
        borderLeft: '3px solid transparent',
        borderRight: '3px solid transparent',
        borderBottom: '3px solid #1f1f1f',
      }
      break
    case 'left':
      tooltipPos = { right: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' }
      arrowPos = {
        right: -3,
        top: '50%',
        transform: 'translateY(-50%)',
        borderTop: '3px solid transparent',
        borderBottom: '3px solid transparent',
        borderLeft: '3px solid #1f1f1f',
      }
      break
    case 'right':
      tooltipPos = { left: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' }
      arrowPos = {
        left: -3,
        top: '50%',
        transform: 'translateY(-50%)',
        borderTop: '3px solid transparent',
        borderBottom: '3px solid transparent',
        borderRight: '3px solid #1f1f1f',
      }
      break
  }

  return (
    <>
      <style>{`
        @keyframes tooltipFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .tt-box { animation: tooltipFadeIn 0.15s ease forwards; }
      `}</style>
      <span
        style={{ position: 'relative', display: 'inline-block' }}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
        {visible && (
          <div
            className="tt-box"
            style={{
              position: 'absolute',
              zIndex: 100,
              backgroundColor: '#1f1f1f',
              border: '1px solid #262626',
              color: '#f59e0b',
              fontSize: '0.75rem',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.375rem',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              ...tooltipPos,
            }}
          >
            {content}
            <span
              style={{
                position: 'absolute',
                width: 0,
                height: 0,
                ...arrowPos,
              }}
            />
          </div>
        )}
      </span>
    </>
  )
}
