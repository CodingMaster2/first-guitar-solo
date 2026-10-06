'use client'

import { useState, useRef, useEffect } from 'react'
import type { CoachMessageRecord } from '@/types'

interface LessonContext {
  day: number
  title: string
  techniques: string[]
  difficulty?: string
  commonMistakes?: string[]
}

interface CoachChatProps {
  initialMessages: CoachMessageRecord[]
  currentDay: number
  lessonTitle: string
  lastLessonTitle?: string
  lastLessonDay?: number
  lessonContext?: LessonContext
}

const STARTER_PROMPTS = [
  "What should I focus on in today's lesson?",
  "I'm struggling with bends — any tips?",
  "How do I build speed without losing accuracy?",
  "What's a good warm-up for today?",
]

const TECHNIQUE_CHIPS = [
  'Bends', 'Vibrato', 'Speed', 'Timing', 'Hammer-ons', 'Pull-offs', 'Slides', 'Picking',
]

const FOLLOW_UP_SUGGESTIONS = [
  "Can you give me a specific drill for that?",
  "How long should I practice this each day?",
  "What's the most common mistake to avoid?",
  "How will I know when I've got it?",
]

const MAX_CHARS = 500

export default function CoachChat({ initialMessages, currentDay, lessonTitle, lastLessonTitle, lastLessonDay: _lastLessonDay, lessonContext }: CoachChatProps) {
  const [messages, setMessages] = useState<CoachMessageRecord[]>(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [clearing, setClearing] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const supported =
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    setSpeechSupported(supported)
    if (supported) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognitionCtor()
      recognition.continuous = false
      recognition.interimResults = false
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript as string
        setInput((prev) => prev + transcript)
        setIsRecording(false)
      }
      recognition.onerror = () => setIsRecording(false)
      recognition.onend = () => setIsRecording(false)
      recognitionRef.current = recognition
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const startRecording = () => {
    if (!recognitionRef.current || isRecording) return
    setIsRecording(true)
    recognitionRef.current.start()
  }

  const sendMessage = async (text?: string) => {
    const userMessage = (text ?? input).trim()
    if (!userMessage || loading) return
    if (userMessage.length > MAX_CHARS) return

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
        body: JSON.stringify({
          message: userMessage,
          ...(lessonContext ? { lessonContext } : {}),
        }),
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

  const clearConversation = async () => {
    setClearing(true)
    setShowClearConfirm(false)
    try {
      await fetch('/api/coach/clear', { method: 'DELETE' })
      setMessages([])
      setError('')
    } catch {
      setError('Failed to clear conversation.')
    } finally {
      setClearing(false)
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

  const displayTitle = lastLessonTitle ?? lessonTitle

  return (
    <div className="flex flex-col h-full">
      <style>{`
        @keyframes typingBounce { 0%,60%,100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-6px); opacity: 1; } }
      `}</style>
      {/* Context bar */}
      <div style={{ backgroundColor: '#111111', borderBottom: '1px solid #262626' }} className="px-4 py-2 flex items-center justify-between">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <p style={{ color: '#a3a3a3' }} className="text-xs">
            <span style={{ color: '#f59e0b' }}>Day {currentDay}</span>
            {' '}&bull;{' '}
            <span>{lessonTitle}</span>
          </p>
          {lessonContext && (
            <span
              style={{
                backgroundColor: '#1a0f00',
                color: '#f59e0b',
                border: '1px solid #78350f',
                borderRadius: '9999px',
                padding: '0.1rem 0.5rem',
                fontSize: '0.65rem',
                fontWeight: 700,
              }}
            >
              Day {lessonContext.day}: {lessonContext.title}
            </span>
          )}
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            style={{ color: '#525252' }}
            className="text-xs hover:text-white transition-colors px-2 py-1 rounded"
            title="Clear conversation"
          >
            Clear
          </button>
        )}
      </div>

      {/* Clear confirmation */}
      {showClearConfirm && (
        <div style={{ backgroundColor: '#1a0000', border: '1px solid #7f1d1d', borderTop: 'none' }} className="px-4 py-3 flex items-center justify-between gap-3">
          <p style={{ color: '#a3a3a3' }} className="text-xs">Clear all messages?</p>
          <div className="flex gap-2">
            <button onClick={() => setShowClearConfirm(false)} style={{ color: '#a3a3a3', border: '1px solid #262626' }} className="text-xs px-3 py-1 rounded hover:text-white transition-colors">
              Cancel
            </button>
            <button onClick={clearConversation} style={{ color: '#ef4444', border: '1px solid #7f1d1d', backgroundColor: '#1a0000' }} className="text-xs px-3 py-1 rounded hover:opacity-80 transition-opacity">
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 && !clearing && (
          <div className="flex flex-col items-center justify-center h-full py-8">
            {/* Context-aware banner */}
            <div
              style={{ backgroundColor: '#1a1200', border: '1px solid #78350f', color: '#f59e0b' }}
              className="text-xs px-4 py-2 rounded-lg mb-6 text-center max-w-sm"
            >
              Your coach knows you&apos;re on Day {currentDay}: {displayTitle}
            </div>

            <div style={{ color: '#f59e0b', fontSize: '2.5rem', lineHeight: 1 }} className="mb-4">&#9899;</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <svg width="14" height="17" viewBox="0 0 60 72" fill="#f59e0b" style={{ flexShrink: 0 }}>
                <path d="M30 0 C50 0 60 12 60 24 C60 48 30 72 30 72 C30 72 0 48 0 24 C0 12 10 0 30 0Z"/>
              </svg>
              <p className="text-white font-bold text-base">AI Guitar Coach</p>
            </div>
            <p style={{ color: '#a3a3a3' }} className="text-sm mb-6 text-center max-w-xs">
              Ask anything about your playing, techniques, or where to focus next.
            </p>

            {/* Starter prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg mb-4">
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

            {/* Practice plan button */}
            <button
              onClick={() => sendMessage(`Generate a focused 20-minute practice plan for today, Day ${currentDay}. Make it specific to where I am in the program.`)}
              style={{ backgroundColor: '#1a1200', border: '1px solid #78350f', color: '#f59e0b' }}
              className="text-xs px-4 py-2 rounded-lg hover:opacity-80 transition-opacity mb-6 font-medium"
            >
              Generate practice plan
            </button>

            {/* Technique trouble selector */}
            <div className="w-full max-w-lg">
              <p style={{ color: '#525252' }} className="text-xs mb-2 text-center uppercase tracking-wider">
                I&apos;m struggling with...
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {TECHNIQUE_CHIPS.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => sendMessage(`I'm struggling with ${tech}. I'm on Day ${currentDay} of the program. Can you give me a specific drill?`)}
                    style={{ border: '1px solid #262626', backgroundColor: '#111111', color: '#a3a3a3' }}
                    className="text-xs px-3 py-1.5 rounded-full hover:border-amber-600 hover:text-white transition-colors"
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div
              style={msg.role === 'user' ? {
                background: 'linear-gradient(135deg, #1a1200, #120e00)',
                color: '#ffffff',
                maxWidth: '80%',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: '18px 18px 4px 18px',
                padding: '10px 14px',
              } : {
                background: '#161616',
                color: '#ffffff',
                maxWidth: '80%',
                border: '1px solid #262626',
                borderRadius: '18px 18px 18px 4px',
                padding: '10px 14px',
              }}
              className="text-sm leading-relaxed whitespace-pre-wrap"
            >
              {msg.content}
            </div>
            <span style={{ color: '#404040' }} className="text-xs mt-1 px-1">
              {formatTime(msg.createdAt)}
            </span>
            {/* Follow-up suggestions after the last assistant message */}
            {msg.role === 'assistant' && idx === messages.length - 1 && !loading && (
              <div className="flex flex-wrap gap-1.5 mt-2 max-w-xs">
                {FOLLOW_UP_SUGGESTIONS.slice(0, 3).map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    style={{ border: '1px solid #262626', backgroundColor: '#111111', color: '#525252' }}
                    className="text-xs px-2 py-1 rounded-full hover:border-amber-600 hover:text-white transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '8px' }}>
            <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', borderRadius: '18px 18px 18px 4px', padding: '12px 16px', display: 'flex', gap: '5px', alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  width: 7, height: 7, borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block',
                  animation: 'typingBounce 1.2s ease-in-out infinite',
                  animationDelay: `${i * 0.2}s`,
                }} />
              ))}
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
          <div className="flex-1 flex flex-col">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
              onKeyDown={handleKeyDown}
              placeholder="Ask your coach..."
              rows={2}
              style={{
                backgroundColor: '#1a1a1a',
                border: `1px solid ${input.length > MAX_CHARS * 0.9 ? '#78350f' : '#262626'}`,
                color: '#ffffff',
                resize: 'none',
              }}
              className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 placeholder-gray-600 transition-colors"
            />
            <div className="flex justify-between items-center mt-1">
              <span style={{ color: '#404040' }} className="text-xs">Enter to send &bull; Shift+Enter for new line</span>
              <span style={{ color: input.length > MAX_CHARS * 0.9 ? '#f59e0b' : '#404040' }} className="text-xs">
                {input.length}/{MAX_CHARS}
              </span>
            </div>
          </div>
          {speechSupported && (
            <button
              onClick={startRecording}
              disabled={isRecording || loading}
              title={isRecording ? 'Listening...' : 'Voice input'}
              style={{
                backgroundColor: isRecording ? '#7f1d1d' : '#1a1a1a',
                border: `1px solid ${isRecording ? '#ef4444' : '#262626'}`,
                color: isRecording ? '#ef4444' : '#a3a3a3',
              }}
              className={`px-3 py-2 rounded-lg text-sm transition-all self-start mt-0 ${
                isRecording ? 'animate-pulse' : 'hover:border-amber-600 hover:text-white'
              }`}
            >
              🎤
            </button>
          )}
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim() || input.length > MAX_CHARS}
            style={{
              backgroundColor: loading || !input.trim() ? '#1a1a1a' : '#f59e0b',
              color: loading || !input.trim() ? '#404040' : '#000000',
              border: loading || !input.trim() ? '1px solid #262626' : 'none',
            }}
            className="px-4 py-2 rounded-lg font-bold text-sm transition-all disabled:cursor-not-allowed self-start mt-0"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
