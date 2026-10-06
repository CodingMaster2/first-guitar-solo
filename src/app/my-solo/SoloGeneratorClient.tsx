'use client'

import { useState } from 'react'

const STYLES = [
  { value: 'blues', label: 'Blues', icon: '🎸', desc: 'Soulful, expressive, feel-every-note' },
  { value: 'rock', label: 'Rock', icon: '⚡', desc: 'Powerful, driving, built for the stage' },
  { value: 'metal', label: 'Metal', icon: '🔥', desc: 'Heavy, aggressive, technically demanding' },
  { value: 'country', label: 'Country', icon: '🤠', desc: 'Twangy, melodic, story-telling bends' },
  { value: 'folk', label: 'Folk', icon: '🌿', desc: 'Gentle, melodic, roots in tradition' },
] as const

const VIBES = [
  { value: 'slow_melodic', label: 'Slow & Expressive', desc: 'Bends, vibrato, every note counts' },
  { value: 'fast_shreddy', label: 'Fast & Shreddy', desc: 'Runs, hammer-ons, pull-offs at speed' },
  { value: 'mixed', label: 'Balanced', desc: 'Mix of fast passages and melodic phrasing' },
] as const

type GenerateResult = {
  customSolo: string
  soloStyle: string
  guitarHero: string | null
  soloVibe: string
}

interface Props {
  onGenerated: (result: GenerateResult) => void
}

export default function SoloGeneratorClient({ onGenerated }: Props) {
  const [style, setStyle] = useState<string>('')
  const [guitarHero, setGuitarHero] = useState('')
  const [vibe, setVibe] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const canGenerate = style !== '' && vibe !== ''

  const generate = async () => {
    if (!canGenerate) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/my-solo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ style, guitarHero: guitarHero.trim() || undefined, vibe }),
      })
      const data = await res.json() as GenerateResult & { error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Generation failed')
      onGenerated(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <div style={{ fontSize: '3rem', lineHeight: 1 }}>🎸</div>
        <div className="text-center">
          <p className="text-white text-xl font-black mb-2">Composing your solo...</p>
          <p style={{ color: '#a3a3a3' }} className="text-sm">
            Crafting something unique to your style. This takes a moment.
          </p>
        </div>
        <div className="flex gap-1.5 mt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#f59e0b',
                width: 8,
                height: 8,
                borderRadius: '50%',
                animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
        <style>{`@keyframes pulse { 0%,100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1); } }`}</style>
      </div>
    )
  }

  return (
    <div>
      {/* Headline */}
      <div className="text-center mb-10">
        <div style={{ fontSize: '3rem', lineHeight: 1, marginBottom: '1rem' }}>🎸</div>
        <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-3">
          Your First Guitar Solo Starts Here
        </h1>
        <p style={{ color: '#a3a3a3' }} className="text-base max-w-lg mx-auto">
          Tell us your style. We&apos;ll compose a solo built for your hands.
        </p>
      </div>

      {/* Style Picker */}
      <div className="mb-8">
        <p style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider mb-3 font-bold">
          Choose Your Style
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {STYLES.map((s) => (
            <button
              key={s.value}
              onClick={() => setStyle(s.value)}
              style={{
                backgroundColor: style === s.value ? '#1a1000' : '#111111',
                border: style === s.value ? '2px solid #f59e0b' : '1px solid #262626',
                color: style === s.value ? '#f59e0b' : '#a3a3a3',
                transition: 'all 0.15s ease',
              }}
              className="rounded-xl p-4 text-center hover:border-amber-700 focus:outline-none"
            >
              <div style={{ fontSize: '1.75rem', lineHeight: 1, marginBottom: '0.5rem' }}>{s.icon}</div>
              <div className="font-black text-sm">{s.label}</div>
              <div style={{ fontSize: '0.65rem', color: style === s.value ? '#d97706' : '#525252', marginTop: '0.25rem' }} className="leading-tight">
                {s.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Guitar Hero */}
      <div className="mb-8">
        <label style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider mb-2 font-bold block">
          Who Inspires You? <span style={{ color: '#525252', textTransform: 'none', letterSpacing: 0 }} className="normal-case">(optional)</span>
        </label>
        <input
          type="text"
          value={guitarHero}
          onChange={(e) => setGuitarHero(e.target.value)}
          placeholder="e.g. Slash, B.B. King, Jimi Hendrix, Eric Clapton..."
          maxLength={60}
          style={{ backgroundColor: '#111111', border: '1px solid #262626', color: '#ffffff' }}
          className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors"
        />
        <p style={{ color: '#404040' }} className="text-xs mt-1.5">
          Your hero&apos;s influence shapes the phrasing and feel of your solo.
        </p>
      </div>

      {/* Vibe Picker */}
      <div className="mb-10">
        <p style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider mb-3 font-bold">
          Choose the Vibe
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {VIBES.map((v) => (
            <button
              key={v.value}
              onClick={() => setVibe(v.value)}
              style={{
                backgroundColor: vibe === v.value ? '#1a1000' : '#111111',
                border: vibe === v.value ? '2px solid #f59e0b' : '1px solid #262626',
                transition: 'all 0.15s ease',
              }}
              className="rounded-xl p-4 text-left hover:border-amber-700 focus:outline-none"
            >
              <div style={{ color: vibe === v.value ? '#f59e0b' : '#ffffff' }} className="font-black text-sm mb-1">
                {v.label}
              </div>
              <div style={{ color: vibe === v.value ? '#d97706' : '#525252' }} className="text-xs leading-snug">
                {v.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{ backgroundColor: '#1a0000', border: '1px solid #7f1d1d', color: '#ef4444' }}
          className="rounded-lg px-4 py-3 text-sm mb-6"
        >
          {error}
        </div>
      )}

      {/* Generate Button */}
      <div className="text-center">
        <button
          onClick={generate}
          disabled={!canGenerate}
          style={{
            backgroundColor: canGenerate ? '#f59e0b' : '#1a1000',
            color: canGenerate ? '#000000' : '#525252',
            border: canGenerate ? 'none' : '1px solid #262626',
            cursor: canGenerate ? 'pointer' : 'not-allowed',
            transition: 'all 0.15s ease',
          }}
          className="px-10 py-4 rounded-xl text-base font-black uppercase tracking-wider hover:opacity-90 disabled:hover:opacity-100"
        >
          Generate My Solo &#8594;
        </button>
        <p style={{ color: '#404040' }} className="text-xs mt-3">
          Your solo will be unique to you. No two students get the same solo.
        </p>
      </div>
    </div>
  )
}
