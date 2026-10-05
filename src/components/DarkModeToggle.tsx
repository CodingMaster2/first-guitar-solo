'use client'
import { useState, useEffect } from 'react'

export default function DarkModeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('fgs-theme') as 'dark' | 'light' | null
      if (saved) {
        setTheme(saved)
        document.documentElement.setAttribute('data-theme', saved)
      }
    } catch {}
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    try { localStorage.setItem('fgs-theme', next) } catch {}
  }

  return (
    <button
      onClick={toggle}
      style={{ color: '#a3a3a3' }}
      className="text-sm hover:text-white transition-colors p-1"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  )
}
