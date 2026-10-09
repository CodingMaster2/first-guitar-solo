'use client'
import { useEffect } from 'react'

export default function ConfettiBurst({ trigger }: { trigger: boolean }) {
  useEffect(() => {
    if (!trigger) return
    // Create 50 confetti particles
    const container = document.createElement('div')
    container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden'
    document.body.appendChild(container)

    const colors = ['#f59e0b', '#fde68a', '#ffffff', '#d97706', '#fbbf24']

    for (let i = 0; i < 50; i++) {
      const el = document.createElement('div')
      const color = colors[Math.floor(Math.random() * colors.length)]
      const x = Math.random() * 100
      const delay = Math.random() * 0.5
      const duration = 1.5 + Math.random()
      const size = 6 + Math.random() * 8
      el.style.cssText = `position:absolute;width:${size}px;height:${size}px;background:${color};left:${x}%;top:-20px;border-radius:${Math.random() > 0.5 ? '50%' : '2px'};animation:confettiFall ${duration}s ease-in ${delay}s forwards`
      container.appendChild(el)
    }

    const style = document.createElement('style')
    style.textContent = '@keyframes confettiFall { to { transform: translateY(110vh) rotate(720deg); opacity: 0; } }'
    document.head.appendChild(style)

    const cleanup = setTimeout(() => {
      if (document.body.contains(container)) document.body.removeChild(container)
    }, 3000)

    return () => {
      clearTimeout(cleanup)
      if (document.body.contains(container)) document.body.removeChild(container)
      if (document.head.contains(style)) document.head.removeChild(style)
    }
  }, [trigger])
  return null
}
