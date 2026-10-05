'use client'

import { useState, useRef, useEffect } from 'react'
import type { CoachMessageRecord } from '@/types'

interface CoachChatProps {
  initialMessages: CoachMessageRecord[]
  currentDay: number
  lessonTitle: string
}

export default function CoachChat({ initialMessages, currentDay, lessonTitle }: CoachChatProps) {
  const [messages, setMessages] = useState<CoachMessageRecord[]>(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setError('')
    setLoading(true)

    // Optimistically add the user message
    const tempId = `temp-${Date.now()}`
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        userId: '',
        role: 'user',
        content: userMessage,
        createdAt: new Date(),
      },
    ])

    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      })

      if (!res.ok) {
        throw new Error('Failed to send message')
      }

      const data = await res.json() as { messages?: CoachMessageRecord[]; error?: string }
      if (!res.ok) {
        throw new Error(data.error ?? 'Server error')
      }
      setMessages(data.messages ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.')
      // Remove the optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempId))
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Context bar */}
      <div style={{ backgroundColor: '#111111', borderBottom: '1px solid #262626' }} className="px-4 py-2">
        <p style={{ color: '#a3a3a3' }} className="text-xs">
          <span style={{ color: '#f59e0b' }}>Day {currentDay}</span>
          {' '}&bull;{' '}
          <span>{lessonTitle}</span>
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <p style={{ color: '#a3a3a3' }} className="text-sm">
              Ask your AI Guitar Coach anything about your playing, the program, or specific techniques.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              style={{
                backgroundColor: msg.role === 'user' ? '#f59e0b' : '#1a1a1a',
                color: msg.role === 'user' ? '#000000' : '#ffffff',
                maxWidth: '80%',
              }}
              className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div style={{ backgroundColor: '#1a1a1a' }} className="rounded-2xl px-4 py-3">
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-2">
          <p style={{ color: '#ef4444' }} className="text-xs">{error}</p>
        </div>
      )}

      {/* Input */}
      <div style={{ borderTop: '1px solid #262626', backgroundColor: '#111111' }} className="p-4">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your coach..."
            rows={2}
            style={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #262626',
              color: '#ffffff',
              resize: 'none',
            }}
            className="flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 placeholder-gray-600"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              backgroundColor: loading || !input.trim() ? '#262626' : '#f59e0b',
              color: loading || !input.trim() ? '#a3a3a3' : '#000000',
            }}
            className="px-4 py-2 rounded-lg font-bold text-sm transition-colors disabled:cursor-not-allowed self-end"
          >
            Send
          </button>
        </div>
        <p style={{ color: '#a3a3a3' }} className="text-xs mt-1">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
