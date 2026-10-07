'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface CommandItem {
  label: string
  href: string
  icon: string
  category: string
}

const NAV_ITEMS: CommandItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '⊞', category: 'Navigate' },
  { label: 'All Lessons', href: '/lessons', icon: '◈', category: 'Navigate' },
  { label: 'AI Coach', href: '/coach', icon: '◎', category: 'Navigate' },
  { label: 'My Progress', href: '/progress', icon: '◉', category: 'Navigate' },
  { label: 'My Solo', href: '/my-solo', icon: '🎸', category: 'Navigate' },
  { label: 'Settings', href: '/settings', icon: '⚙', category: 'Navigate' },
  { label: 'Leaderboard', href: '/leaderboard', icon: '🏆', category: 'Navigate' },
  { label: 'Graduates Wall', href: '/graduates', icon: '🎓', category: 'Navigate' },
]

const LESSON_ITEMS: CommandItem[] = Array.from({ length: 30 }, (_, i) => ({
  label: `Day ${i + 1}`,
  href: `/lesson/${i + 1}`,
  icon: String(i + 1),
  category: 'Lessons',
}))

const ALL_ITEMS: CommandItem[] = [...NAV_ITEMS, ...LESSON_ITEMS]

export default function CommandPalette() {
  const { status } = useSession()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const filteredItems = query.trim()
    ? ALL_ITEMS.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_ITEMS

  const openPalette = useCallback(() => {
    setOpen(true)
    setQuery('')
    setSelectedIndex(0)
  }, [])

  const closePalette = useCallback(() => {
    setOpen(false)
    setQuery('')
  }, [])

  const navigateTo = useCallback(
    (href: string) => {
      router.push(href)
      closePalette()
    },
    [router, closePalette]
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K (Mac) / Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (open) {
          closePalette()
        } else {
          openPalette()
        }
        return
      }

      // '/' when not in an input field
      if (e.key === '/' && !open) {
        const tag = (e.target as HTMLElement).tagName.toLowerCase()
        if (tag !== 'input' && tag !== 'textarea' && tag !== 'select') {
          e.preventDefault()
          openPalette()
          return
        }
      }

      if (!open) return

      if (e.key === 'Escape') {
        closePalette()
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1))
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
        return
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredItems[selectedIndex]) {
          navigateTo(filteredItems[selectedIndex].href)
        }
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, filteredItems, selectedIndex, openPalette, closePalette, navigateTo])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10)
    }
  }, [open])

  // Reset selected index on query change
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return
    const el = listRef.current.querySelector<HTMLElement>('.selected')
    el?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  if (status !== 'authenticated') return null
  if (!open) return null

  // Group filtered items by category
  const categories = Array.from(new Set(filteredItems.map((i) => i.category)))

  return (
    // Overlay
    <div
      className="cmd-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closePalette()
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div className="cmd-panel" style={{ margin: '0 16px' }}>
        {/* Search input */}
        <input
          ref={inputRef}
          className="cmd-input"
          placeholder="Search pages and lessons…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search command palette"
          autoComplete="off"
          spellCheck={false}
        />

        {/* Results */}
        <div
          ref={listRef}
          style={{ maxHeight: 400, overflowY: 'auto', padding: '8px' }}
          role="listbox"
        >
          {filteredItems.length === 0 && (
            <p
              style={{
                color: '#525252',
                fontSize: '0.875rem',
                textAlign: 'center',
                padding: '24px 0',
              }}
            >
              No results for &ldquo;{query}&rdquo;
            </p>
          )}

          {categories.map((category) => {
            const items = filteredItems.filter((i) => i.category === category)
            return (
              <div key={category}>
                {/* Category header */}
                <p
                  className="section-label"
                  style={{ padding: '8px 12px 4px', marginTop: 4 }}
                >
                  {category}
                </p>
                {items.map((item) => {
                  const globalIndex = filteredItems.indexOf(item)
                  const isSelected = globalIndex === selectedIndex
                  return (
                    <div
                      key={item.href}
                      className={`cmd-result${isSelected ? ' selected' : ''}`}
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      onClick={() => navigateTo(item.href)}
                    >
                      <span
                        style={{
                          width: 28,
                          height: 28,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 6,
                          backgroundColor: '#1a1a1a',
                          fontSize: '0.8rem',
                          flexShrink: 0,
                          color: isSelected ? '#f59e0b' : '#a3a3a3',
                        }}
                      >
                        {item.icon}
                      </span>
                      <span
                        style={{
                          fontSize: '0.9rem',
                          color: isSelected ? '#ffffff' : '#d4d4d4',
                        }}
                      >
                        {item.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>

        {/* Keyboard hint footer */}
        <div
          style={{
            borderTop: '1px solid #1f1f1f',
            padding: '8px 16px',
            display: 'flex',
            gap: 16,
            justifyContent: 'center',
          }}
        >
          {(['↑↓ navigate', '↵ select', 'Esc close'] as const).map((hint) => (
            <span
              key={hint}
              style={{ color: '#525252', fontSize: '0.7rem', fontFamily: 'monospace' }}
            >
              {hint}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
