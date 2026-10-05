'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const TOTAL_STEPS = 5

export default function OnboardingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [experienceLevel, setExperienceLevel] = useState('')
  const [instrument, setInstrument] = useState('')
  const [hasBasicChords, setHasBasicChords] = useState('')
  const [hasLearnedSolo, setHasLearnedSolo] = useState('')
  const [tabComfort, setTabComfort] = useState(3)
  const [pickingLevel, setPickingLevel] = useState(3)
  const [hammerOnLevel, setHammerOnLevel] = useState(3)
  const [pullOffLevel, setPullOffLevel] = useState(3)
  const [slideLevel, setSlideLevel] = useState(3)
  const [bendLevel, setBendLevel] = useState(1)
  const [vibratoLevel, setVibratoLevel] = useState(1)
  const [pentatonicLevel, setPentatonicLevel] = useState(1)
  const [styles, setStyles] = useState<string[]>([])
  const [practiceMinutes, setPracticeMinutes] = useState('')

  const experienceToMonths: Record<string, number> = {
    'lt6': 3,
    '6-12': 9,
    '1-2': 18,
    '2+': 30,
  }

  const practiceToMinutes: Record<string, number> = {
    '10': 10,
    '15': 15,
    '20': 20,
    '30+': 30,
  }

  const toggleStyle = (s: string) => {
    setStyles((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])
  }

  const handleSubmit = async () => {
    if (!session?.user) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instrument,
          experienceMonths: experienceToMonths[experienceLevel] ?? 12,
          tabComfort,
          hasBasicChords: hasBasicChords === 'yes',
          hasLearnedSolo: hasLearnedSolo !== 'no',
          pickingLevel,
          hammerOnLevel,
          pullOffLevel,
          slideLevel,
          bendLevel,
          vibratoLevel,
          pentatonicLevel,
          styles: styles.join(','),
          practiceMinutes: practiceToMinutes[practiceMinutes] ?? 20,
        }),
      })

      if (!res.ok) {
        const data = await res.json() as { error?: string }
        setError(data.error ?? 'Failed to save')
        return
      }

      router.push('/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    if (step === 1) return experienceLevel && instrument && hasBasicChords && hasLearnedSolo
    if (step === 5) return !!practiceMinutes
    return true
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }} className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <span style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-widest">
            Onboarding
          </span>
          <h1 className="text-2xl font-black text-white uppercase mt-1">Tell Us About Yourself</h1>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              style={{
                backgroundColor: i < step ? '#f59e0b' : '#262626',
                height: '4px',
                flex: 1,
              }}
              className="rounded-full transition-all"
            />
          ))}
        </div>
        <p style={{ color: '#a3a3a3' }} className="text-xs mb-6">Step {step} of {TOTAL_STEPS}</p>

        <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6 sm:p-8">

          {/* Step 1: Experience */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-black text-white uppercase mb-6">Your Experience</h2>

              <div className="space-y-5">
                <div>
                  <label style={{ color: '#a3a3a3' }} className="block text-xs font-medium uppercase tracking-wider mb-3">
                    How long have you played guitar?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ val: 'lt6', label: 'Less than 6 months' }, { val: '6-12', label: '6-12 months' }, { val: '1-2', label: '1-2 years' }, { val: '2+', label: '2+ years' }].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => setExperienceLevel(opt.val)}
                        style={{
                          backgroundColor: experienceLevel === opt.val ? '#f59e0b' : '#1a1a1a',
                          color: experienceLevel === opt.val ? '#000' : '#a3a3a3',
                          border: `1px solid ${experienceLevel === opt.val ? '#f59e0b' : '#262626'}`,
                        }}
                        className="px-3 py-2 rounded-lg text-sm text-left transition-colors"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ color: '#a3a3a3' }} className="block text-xs font-medium uppercase tracking-wider mb-3">
                    What do you primarily play?
                  </label>
                  <div className="flex gap-2">
                    {['Acoustic', 'Electric', 'Both'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setInstrument(opt)}
                        style={{
                          backgroundColor: instrument === opt ? '#f59e0b' : '#1a1a1a',
                          color: instrument === opt ? '#000' : '#a3a3a3',
                          border: `1px solid ${instrument === opt ? '#f59e0b' : '#262626'}`,
                        }}
                        className="px-4 py-2 rounded-lg text-sm flex-1 transition-colors"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ color: '#a3a3a3' }} className="block text-xs font-medium uppercase tracking-wider mb-3">
                    Can you play basic chords?
                  </label>
                  <div className="flex gap-2">
                    {[{ val: 'yes', label: 'Yes' }, { val: 'getting-there', label: 'Getting there' }].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => setHasBasicChords(opt.val)}
                        style={{
                          backgroundColor: hasBasicChords === opt.val ? '#f59e0b' : '#1a1a1a',
                          color: hasBasicChords === opt.val ? '#000' : '#a3a3a3',
                          border: `1px solid ${hasBasicChords === opt.val ? '#f59e0b' : '#262626'}`,
                        }}
                        className="px-4 py-2 rounded-lg text-sm flex-1 transition-colors"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ color: '#a3a3a3' }} className="block text-xs font-medium uppercase tracking-wider mb-3">
                    Have you ever learned a complete solo?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[{ val: 'no', label: 'No' }, { val: 'almost', label: 'Almost' }, { val: 'yes', label: 'Yes, want to improve' }].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => setHasLearnedSolo(opt.val)}
                        style={{
                          backgroundColor: hasLearnedSolo === opt.val ? '#f59e0b' : '#1a1a1a',
                          color: hasLearnedSolo === opt.val ? '#000' : '#a3a3a3',
                          border: `1px solid ${hasLearnedSolo === opt.val ? '#f59e0b' : '#262626'}`,
                        }}
                        className="px-3 py-2 rounded-lg text-sm transition-colors"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Tab comfort */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-black text-white uppercase mb-2">Reading Tabs</h2>
              <p style={{ color: '#a3a3a3' }} className="text-sm mb-6">
                How comfortable are you reading guitar tabs?
              </p>
              <div className="flex gap-2 justify-between">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setTabComfort(n)}
                    style={{
                      backgroundColor: tabComfort === n ? '#f59e0b' : '#1a1a1a',
                      color: tabComfort === n ? '#000' : '#a3a3a3',
                      border: `1px solid ${tabComfort === n ? '#f59e0b' : '#262626'}`,
                      width: '56px',
                      height: '56px',
                    }}
                    className="rounded-lg text-lg font-bold transition-colors"
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <span style={{ color: '#a3a3a3' }} className="text-xs">Beginner</span>
                <span style={{ color: '#a3a3a3' }} className="text-xs">Expert</span>
              </div>
            </div>
          )}

          {/* Step 3: Technique levels */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-black text-white uppercase mb-2">Technique Confidence</h2>
              <p style={{ color: '#a3a3a3' }} className="text-sm mb-6">Rate each technique 1-5 (1 = never tried, 5 = solid)</p>
              <div className="space-y-4">
                {[
                  { label: 'Picking / Alternate Picking', val: pickingLevel, set: setPickingLevel },
                  { label: 'Hammer-ons', val: hammerOnLevel, set: setHammerOnLevel },
                  { label: 'Pull-offs', val: pullOffLevel, set: setPullOffLevel },
                  { label: 'Slides', val: slideLevel, set: setSlideLevel },
                  { label: 'Bends', val: bendLevel, set: setBendLevel },
                  { label: 'Vibrato', val: vibratoLevel, set: setVibratoLevel },
                  { label: 'Pentatonic scales', val: pentatonicLevel, set: setPentatonicLevel },
                ].map((tech) => (
                  <div key={tech.label}>
                    <label style={{ color: '#a3a3a3' }} className="block text-xs mb-2">{tech.label}</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          onClick={() => tech.set(n)}
                          style={{
                            backgroundColor: n <= tech.val ? '#f59e0b' : '#1a1a1a',
                            color: n <= tech.val ? '#000' : '#a3a3a3',
                            border: `1px solid ${n <= tech.val ? '#f59e0b' : '#262626'}`,
                          }}
                          className="flex-1 h-8 rounded text-xs font-bold transition-colors"
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Styles */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-black text-white uppercase mb-2">Style Preferences</h2>
              <p style={{ color: '#a3a3a3' }} className="text-sm mb-6">What styles do you enjoy? (Select all that apply)</p>
              <div className="grid grid-cols-3 gap-2">
                {['Rock', 'Blues', 'Metal', 'Alternative', 'Pop', 'Other'].map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleStyle(s)}
                    style={{
                      backgroundColor: styles.includes(s) ? '#f59e0b' : '#1a1a1a',
                      color: styles.includes(s) ? '#000' : '#a3a3a3',
                      border: `1px solid ${styles.includes(s) ? '#f59e0b' : '#262626'}`,
                    }}
                    className="px-3 py-3 rounded-lg text-sm transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Practice time */}
          {step === 5 && (
            <div>
              <h2 className="text-xl font-black text-white uppercase mb-2">Practice Time</h2>
              <p style={{ color: '#a3a3a3' }} className="text-sm mb-6">
                How much time can you practice daily?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[{ val: '10', label: '10 min' }, { val: '15', label: '15 min' }, { val: '20', label: '20 min' }, { val: '30+', label: '30+ min' }].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => setPracticeMinutes(opt.val)}
                    style={{
                      backgroundColor: practiceMinutes === opt.val ? '#f59e0b' : '#1a1a1a',
                      color: practiceMinutes === opt.val ? '#000' : '#a3a3a3',
                      border: `1px solid ${practiceMinutes === opt.val ? '#f59e0b' : '#262626'}`,
                    }}
                    className="py-4 rounded-lg text-base font-bold transition-colors"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div style={{ backgroundColor: '#1a0000', border: '1px solid #7f1d1d', color: '#fca5a5' }} className="rounded-lg px-4 py-3 text-sm mt-4">
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                style={{ color: '#a3a3a3', border: '1px solid #262626' }}
                className="px-6 py-2 rounded-lg text-sm hover:text-white transition-colors"
              >
                Back
              </button>
            ) : <div />}

            {step < TOTAL_STEPS ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                style={{
                  backgroundColor: canProceed() ? '#f59e0b' : '#262626',
                  color: canProceed() ? '#000' : '#a3a3a3',
                }}
                className="px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !canProceed()}
                style={{
                  backgroundColor: loading || !canProceed() ? '#262626' : '#f59e0b',
                  color: loading || !canProceed() ? '#a3a3a3' : '#000',
                }}
                className="px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Start Program'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
