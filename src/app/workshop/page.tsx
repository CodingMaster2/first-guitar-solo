'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import SoloForgeConfig, { type SoloConfig } from '@/components/SoloForgeConfig'
import TabViewer from '@/components/TabViewer'

interface SoloSection {
  name: string
  bars: string
  description: string
  technique: string
  tip: string
}

interface GeneratedSolo {
  id: string
  title: string
  style: string
  key: string
  mood: string
  difficulty: string
  bars: number
  bpm: number
  tabContent: string
  sections: SoloSection[]
  techniques: string[]
  practiceGuide: string
  public: boolean
  createdAt: string
}

// Raw shape returned from /api/workshop/my-solos (sections/techniques are JSON strings)
interface StoredSolo {
  id: string
  title: string
  style: string
  key: string
  mood: string
  difficulty: string
  bars: number
  bpm: number
  tabContent: string
  sections: string
  techniques: string
  practiceGuide: string
  public: boolean
  createdAt: string
}

function parseSolo(raw: StoredSolo): GeneratedSolo {
  let sections: SoloSection[]
  if (typeof raw.sections === 'string') {
    try {
      sections = JSON.parse(raw.sections) as SoloSection[]
    } catch {
      sections = []
    }
  } else {
    sections = raw.sections as unknown as SoloSection[]
  }

  let techniques: string[]
  if (typeof raw.techniques === 'string') {
    try {
      techniques = JSON.parse(raw.techniques) as string[]
    } catch {
      techniques = []
    }
  } else {
    techniques = raw.techniques as unknown as string[]
  }

  return { ...raw, sections, techniques }
}

type TabView = 'forge' | 'history' | 'community'

const pillStyle: React.CSSProperties = {
  background: '#1a1a1a',
  border: '1px solid #262626',
  borderRadius: 20,
  padding: '4px 12px',
  color: '#a3a3a3',
  fontSize: '0.78rem',
  fontWeight: 500,
}

const techniquePillStyle: React.CSSProperties = {
  background: 'rgba(245,158,11,0.1)',
  border: '1px solid rgba(245,158,11,0.25)',
  borderRadius: 4,
  padding: '3px 10px',
  color: '#f59e0b',
  fontSize: '0.75rem',
  fontWeight: 600,
}

export default function WorkshopPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [tab, setTab] = useState<TabView>('forge')
  const [solo, setSolo] = useState<GeneratedSolo | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [savedSoloId, setSavedSoloId] = useState<string | null>(null)
  const [mySolos, setMySolos] = useState<GeneratedSolo[]>([])
  const [expandedSoloId, setExpandedSoloId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Auth redirect
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Page title
  useEffect(() => {
    document.title = 'Solo Forge — First Guitar Solo'
  }, [])

  // Fetch my solos on mount
  useEffect(() => {
    if (status === 'authenticated') {
      fetchMySolos()
    }
  }, [status])

  async function fetchMySolos() {
    try {
      const res = await fetch('/api/workshop/my-solos')
      if (res.ok) {
        const data = (await res.json()) as { solos: StoredSolo[] }
        setMySolos(data.solos.map(parseSolo))
      }
    } catch {
      // silently fail
    }
  }

  async function handleGenerate(config: SoloConfig) {
    setIsGenerating(true)
    setGenerateError(null)
    setSavedSoloId(null)

    try {
      const res = await fetch('/api/workshop/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })

      const data = (await res.json()) as GeneratedSolo & { error?: string }

      if (!res.ok) {
        setGenerateError(data.error ?? 'Generation failed. Please try again.')
        return
      }

      setSolo(data)
    } catch {
      setGenerateError('Network error. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleSave() {
    if (!solo || savedSoloId) return
    setIsSaving(true)
    try {
      const res = await fetch('/api/workshop/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ soloId: solo.id, public: false }),
      })
      if (res.ok) {
        setSavedSoloId(solo.id)
        // Refresh the list
        fetchMySolos()
      }
    } catch {
      // silently fail
    } finally {
      setIsSaving(false)
    }
  }

  function handleRegenerate() {
    setSolo(null)
    setSavedSoloId(null)
    setGenerateError(null)
  }

  function handleShare() {
    if (!solo) return
    const shareText = `Check out my custom guitar solo: "${solo.title}" — ${solo.style} style in ${solo.key}`
    if (navigator.share) {
      navigator.share({ title: solo.title, text: shareText }).catch(() => null)
    } else {
      navigator.clipboard.writeText(shareText).catch(() => null)
    }
  }

  async function handleDeleteSolo(soloId: string) {
    try {
      const res = await fetch(`/api/workshop/my-solos?id=${soloId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setMySolos((prev) => prev.filter((s) => s.id !== soloId))
        if (expandedSoloId === soloId) setExpandedSoloId(null)
      }
    } catch {
      // silently fail
    }
  }

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div
        style={{
          background: '#0a0a0a',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            border: '3px solid #262626',
            borderTop: '3px solid #f59e0b',
            borderRadius: '50%',
            animation: 'sfSpin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes sfSpin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const tabItems: { id: TabView; label: string }[] = [
    { id: 'forge', label: '🔨 Forge New' },
    { id: 'history', label: '📁 My Solos' },
    { id: 'community', label: '🌐 Community' },
  ]

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />

      <main
        id="main-content"
        style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px 64px' }}
      >
        {/* Page header */}
        <div
          style={{
            padding: '40px 0 8px',
            borderBottom: '1px solid #1f1f1f',
            marginBottom: 0,
          }}
        >
          <h1
            style={{
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              color: '#f59e0b',
              margin: '0 0 4px',
              letterSpacing: '0.04em',
              lineHeight: 1,
            }}
          >
            Solo Forge
          </h1>
          <p style={{ color: '#737373', fontSize: '0.95rem', margin: '0 0 28px' }}>
            Generate unlimited custom solos tailored to your style
          </p>

          {/* Tab bar */}
          <div style={{ display: 'flex', gap: 0 }}>
            {tabItems.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: '10px 20px',
                  background: 'none',
                  border: 'none',
                  borderBottom: `2px solid ${tab === t.id ? '#f59e0b' : 'transparent'}`,
                  color: tab === t.id ? '#f59e0b' : '#737373',
                  fontSize: '0.85rem',
                  fontWeight: tab === t.id ? 700 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Forge New tab ─── */}
        {tab === 'forge' && (
          <div style={{ paddingTop: 32 }}>
            <div
              style={{
                display: 'flex',
                gap: 32,
                alignItems: 'flex-start',
                flexWrap: 'wrap',
              }}
            >
              {/* Config form */}
              <div style={{ flex: '0 0 min(100%, 560px)' }}>
                <SoloForgeConfig
                  onGenerate={handleGenerate}
                  isLoading={isGenerating}
                />

                {generateError && (
                  <div
                    style={{
                      marginTop: 16,
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: 8,
                      padding: '12px 16px',
                      color: '#fca5a5',
                      fontSize: '0.85rem',
                      maxWidth: 560,
                      margin: '16px auto 0',
                    }}
                  >
                    {generateError}
                  </div>
                )}
              </div>

              {/* Result pane */}
              {solo && (
                <div
                  style={{
                    flex: '1 1 400px',
                    minWidth: 0,
                    animation: 'slideIn 0.35s ease',
                  }}
                >
                  <style>{`
                    @keyframes slideIn {
                      from { opacity: 0; transform: translateY(16px); }
                      to   { opacity: 1; transform: translateY(0); }
                    }
                  `}</style>

                  {/* Solo title */}
                  <h2
                    style={{
                      fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                      fontSize: '1.8rem',
                      color: '#ffffff',
                      margin: '0 0 12px',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {solo.title}
                  </h2>

                  {/* Metadata pills */}
                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                      flexWrap: 'wrap',
                      marginBottom: 16,
                    }}
                  >
                    <span style={pillStyle}>{solo.style}</span>
                    <span style={pillStyle}>{solo.key}</span>
                    <span style={pillStyle}>♩ = {solo.bpm} BPM</span>
                    <span style={pillStyle}>{solo.bars} bars</span>
                    <span style={pillStyle}>{solo.difficulty}</span>
                  </div>

                  {/* TAB viewer */}
                  <TabViewer
                    tabContent={solo.tabContent}
                    bpm={solo.bpm}
                    title={solo.title}
                  />

                  {/* Sections breakdown */}
                  {solo.sections.length > 0 && (
                    <div style={{ marginTop: 24 }}>
                      <p
                        style={{
                          color: '#a3a3a3',
                          fontSize: '0.7rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          fontWeight: 700,
                          marginBottom: 12,
                        }}
                      >
                        Section Breakdown
                      </p>
                      {solo.sections.map((section) => (
                        <div
                          key={section.name}
                          style={{
                            borderLeft: '3px solid #f59e0b',
                            paddingLeft: 16,
                            marginBottom: 16,
                          }}
                        >
                          <p
                            style={{
                              color: '#f59e0b',
                              fontWeight: 700,
                              margin: '0 0 4px',
                              fontSize: '0.9rem',
                            }}
                          >
                            {section.name} — Bars {section.bars}
                          </p>
                          <p
                            style={{
                              color: '#a3a3a3',
                              margin: '0 0 4px',
                              fontSize: '0.85rem',
                            }}
                          >
                            {section.description}
                          </p>
                          <p
                            style={{
                              color: '#737373',
                              fontSize: '0.8rem',
                              margin: 0,
                            }}
                          >
                            💡 {section.tip}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Techniques */}
                  {solo.techniques.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <p
                        style={{
                          color: '#a3a3a3',
                          fontSize: '0.7rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          fontWeight: 700,
                          marginBottom: 8,
                        }}
                      >
                        Techniques Used
                      </p>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {solo.techniques.map((t) => (
                          <span key={t} style={techniquePillStyle}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Practice guide */}
                  <div
                    style={{
                      background: '#0d1a00',
                      border: '1px solid #1a3300',
                      borderRadius: 12,
                      padding: 20,
                      marginTop: 20,
                    }}
                  >
                    <p
                      style={{
                        color: '#86efac',
                        fontWeight: 700,
                        margin: '0 0 8px',
                        fontSize: '0.85rem',
                      }}
                    >
                      📋 Practice Guide
                    </p>
                    <p
                      style={{
                        color: '#a3a3a3',
                        whiteSpace: 'pre-line',
                        lineHeight: 1.7,
                        margin: 0,
                        fontSize: '0.85rem',
                      }}
                    >
                      {solo.practiceGuide}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div
                    style={{
                      display: 'flex',
                      gap: 10,
                      marginTop: 20,
                      flexWrap: 'wrap',
                    }}
                  >
                    <button
                      onClick={handleSave}
                      disabled={isSaving || !!savedSoloId}
                      style={{
                        background: savedSoloId ? '#0d1a00' : '#f59e0b',
                        border: savedSoloId ? '1px solid #2d5a00' : 'none',
                        color: savedSoloId ? '#86efac' : '#000000',
                        padding: '10px 24px',
                        borderRadius: 8,
                        fontWeight: 700,
                        cursor: savedSoloId ? 'default' : 'pointer',
                        fontSize: '0.9rem',
                        transition: 'all 0.2s',
                      }}
                    >
                      {savedSoloId ? '✓ Saved' : isSaving ? 'Saving…' : 'Save Solo'}
                    </button>
                    <button
                      onClick={handleRegenerate}
                      style={{
                        background: '#111111',
                        color: '#ffffff',
                        border: '1px solid #262626',
                        padding: '10px 24px',
                        borderRadius: 8,
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                    >
                      🔨 Forge Another
                    </button>
                    <button
                      onClick={handleShare}
                      style={{
                        background: '#111111',
                        color: '#ffffff',
                        border: '1px solid #262626',
                        padding: '10px 24px',
                        borderRadius: 8,
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                    >
                      Share
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── My Solos tab ─── */}
        {tab === 'history' && (
          <div style={{ paddingTop: 32 }}>
            {mySolos.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '64px 16px',
                  color: '#525252',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🎸</div>
                <p style={{ fontSize: '1rem', marginBottom: 8, color: '#737373' }}>
                  No solos forged yet
                </p>
                <p style={{ fontSize: '0.85rem' }}>
                  Head to the Forge New tab to generate your first custom solo
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: 16,
                }}
              >
                {mySolos.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      background: '#111111',
                      border: '1px solid #1f1f1f',
                      borderRadius: 12,
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ padding: '16px 16px 12px' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: 8,
                          marginBottom: 8,
                        }}
                      >
                        <h3
                          style={{
                            color: '#ffffff',
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            margin: 0,
                            lineHeight: 1.3,
                          }}
                        >
                          {s.title}
                        </h3>
                        <span
                          style={{
                            color: '#525252',
                            fontSize: '0.7rem',
                            flexShrink: 0,
                            marginTop: 2,
                          }}
                        >
                          {new Date(s.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{ ...pillStyle, fontSize: '0.72rem' }}>
                          {s.style}
                        </span>
                        <span style={{ ...pillStyle, fontSize: '0.72rem' }}>
                          {s.key}
                        </span>
                        <span style={{ ...pillStyle, fontSize: '0.72rem' }}>
                          {s.bars} bars
                        </span>
                      </div>
                    </div>

                    {/* Expanded TAB */}
                    {expandedSoloId === s.id && (
                      <div
                        style={{
                          padding: '0 16px 16px',
                          animation: 'slideIn 0.25s ease',
                        }}
                      >
                        <TabViewer
                          tabContent={s.tabContent}
                          bpm={s.bpm}
                          title={s.title}
                        />
                      </div>
                    )}

                    {/* Card actions */}
                    <div
                      style={{
                        display: 'flex',
                        gap: 8,
                        padding: '0 16px 16px',
                      }}
                    >
                      <button
                        onClick={() =>
                          setExpandedSoloId(
                            expandedSoloId === s.id ? null : s.id
                          )
                        }
                        style={{
                          flex: 1,
                          padding: '8px',
                          background:
                            expandedSoloId === s.id
                              ? 'rgba(245,158,11,0.1)'
                              : '#0a0a0a',
                          border: `1px solid ${expandedSoloId === s.id ? '#f59e0b' : '#262626'}`,
                          borderRadius: 6,
                          color: expandedSoloId === s.id ? '#f59e0b' : '#a3a3a3',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        {expandedSoloId === s.id ? 'Hide TAB' : 'View TAB'}
                      </button>
                      <button
                        onClick={() => handleDeleteSolo(s.id)}
                        style={{
                          padding: '8px 14px',
                          background: '#0a0a0a',
                          border: '1px solid #262626',
                          borderRadius: 6,
                          color: '#737373',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#ef4444'
                          e.currentTarget.style.color = '#fca5a5'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#262626'
                          e.currentTarget.style.color = '#737373'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── Community tab ─── */}
        {tab === 'community' && (
          <div
            style={{
              paddingTop: 32,
              textAlign: 'center',
              padding: '64px 16px',
              color: '#525252',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🌐</div>
            <p style={{ fontSize: '1rem', marginBottom: 8, color: '#737373' }}>
              Community solos coming soon
            </p>
            <p style={{ fontSize: '0.85rem' }}>
              Browse solos shared by other players — launching with the next update
            </p>
          </div>
        )}
      </main>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
