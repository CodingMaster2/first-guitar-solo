'use client'

import { useState, useRef, useEffect } from 'react'
import type { CoachMessageRecord } from '@/types'

interface CoachChatProps {
  initialMessages: CoachMessageRecord[]
  currentDay: number
  lessonTitle: string
}

const STARTER_PROMPTS = [
  "What should I focus on in today's lesson?",
  "I'm struggling with bends — any tips?",
  "How do I build speed without losing accuracy?",
  "What's a good warm-up for today?",
]

export default function CoachChat({ initialMessages, currentDay, lessonTitle }: CoachChatProps) {
  const [messages, setMessages] = useState<CoachMessageRecord[]>(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text?: string) => {
    const userMessage = (text ?? input).trim()
    if (!userMessage || loading) return

    setInput('')
    setError('')
    setLoading(true)

    const tempId = `temp-${Date.now()}`
    setMessages((prev) => [
      ...prev,
      { id: tempId, userId: '', role: 'user', content: userMessage, createdAt: new Date() },
    ])

    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      })

      const data = await res.json() as { messages?: CoachMessageRecord[]; error?: string }
      if (!res.ok) {
        throw new Error(data.error ?? 'Server error')
      }
      setMessages(data.messages ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.')
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

  const formatTime = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full py-8">
            <div style={{ color: '#f59e0b', fontSize: '2.5rem', lineHeight: 1 }} className="mb-4">&#9899;</div>
            <p className="text-white font-bold text-base mb-1">AI Guitar Coach</p>
            <p style={{ color: '#a3a3a3' }} className="text-sm mb-8 text-center max-w-xs">
              Ask anything about your playing, techniques, or where to focus next.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  style={{ border: '1px solid #262626', backgroundColor: '#111111', color: '#a3a3a3' }}
                  className="text-xs p-3 rounded-lg text-left hover:border-amber-600 hover:text-white transition-colors leading-relaxed"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div
              style={{
                backgroundColor: msg.role === 'user' ? '#f59e0b' : '#1a1a1a',
                color: msg.role === 'user' ? '#000000' : '#ffffff',
                maxWidth: '80%',
                border: msg.role === 'assistant' ? '1px solid #262626' : 'none',
              }}
              className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
            >
              {msg.content}
            </div>
            <span style={{ color: '#404040' }} className="text-xs mt-1 px-1">
              {formatTime(msg.createdAt)}
            </span>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626' }} className="rounded-2xl px-4 py-3">
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-2">
          <p style={{ color: '#ef4444', backgroundColor: '#1a0000', border: '1px solid #7f1d1d' }} className="text-xs px-3 py-2 rounded-lg">{error}</p>
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
            className="flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 placeholder-gray-600 transition-colors"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            style={{
              backgroundColor: loading || !input.trim() ? '#1a1a1a' : '#f59e0b',
              color: loading || !input.trim() ? '#404040' : '#000000',
              border: loading || !input.trim() ? '1px solid #262626' : 'none',
            }}
            className="px-4 py-2 rounded-lg font-bold text-sm transition-all disabled:cursor-not-allowed self-end"
          >
            Send
          </button>
        </div>
        <p style={{ color: '#404040' }} className="text-xs mt-1">
          Enter to send &bull; Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
