'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PracticeReminder from '@/components/PracticeReminder'

function Toggle({
  value,
  onChange,
  disabled,
}: {
  value: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      disabled={disabled}
      style={{
        backgroundColor: value ? '#f59e0b' : '#1a1a1a',
        border: `1px solid ${value ? '#d97706' : '#262626'}`,
        borderRadius: 20,
        width: 44,
        height: 24,
        padding: 2,
        transition: 'background-color 0.2s',
        cursor: disabled ? 'not-allowed' : 'pointer',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          backgroundColor: value ? '#000' : '#525252',
          borderRadius: '50%',
          width: 18,
          height: 18,
          transform: value ? 'translateX(20px)' : 'translateX(0)',
          transition: 'transform 0.2s',
        }}
      />
    </button>
  )
}

const pillStyle = (active: boolean) => ({
  backgroundColor: active ? '#f59e0b' : '#111111',
  color: active ? '#000000' : '#525252',
  border: active ? 'none' : '1px solid #1f1f1f',
  borderRadius: 9999,
  padding: '6px 14px',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
})

const saveBtn = (status: string) => ({
  backgroundColor: status === 'saved' ? '#14532d' : '#f59e0b',
  color: status === 'saved' ? '#86efac' : '#000000',
})

export default function SettingsPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  // Profile
  const [name, setName] = useState('')
  const [nameStatus, setNameStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [nameError, setNameError] = useState('')

  // Avatar
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarStatus, setAvatarStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [avatarError, setAvatarError] = useState('')

  // Password
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwStatus, setPwStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [pwError, setPwError] = useState('')

  // Danger zone modals
  const [resetModal, setResetModal] = useState(false)
  const [resetConfirm, setResetConfirm] = useState('')
  const [resetStatus, setResetStatus] = useState<'idle' | 'resetting' | 'done' | 'error'>('idle')
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'deleting' | 'done' | 'error'>('idle')

  // Solo data
  // Subscription
  const [hasStripeCustomer, setHasStripeCustomer] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)

  // Solo data
  const [soloData, setSoloData] = useState<{
    soloStyle: string | null
    guitarHero: string | null
    soloVibe: string | null
    customSolo: string | null
    soloCompleted: boolean
  } | null>(null)

  // Practice preferences
  const [weeklyGoalDays, setWeeklyGoalDays] = useState(5)
  const [reminderTime, setReminderTime] = useState('')
  const [prefStatus, setPrefStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  // Guitar setup
  const [guitarType, setGuitarType] = useState('')
  const [preferredGenre, setPreferredGenre] = useState('')
  const [leftHanded, setLeftHanded] = useState(false)
  const [guitarStatus, setGuitarStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  // Accessibility
  const [fontSize, setFontSize] = useState('Normal')
  const [focusMode, setFocusMode] = useState(false)
  const [accessStatus, setAccessStatus] = useState<'idle' | 'saved'>('idle')

  // Personalization — accent color
  const [accentColor, setAccentColor] = useState('#f59e0b')

  // Personalization — layout density
  const [layoutDensity, setLayoutDensity] = useState<'comfortable' | 'compact'>('comfortable')

  // Learning Preferences — auto-advance
  const [autoAdvance, setAutoAdvance] = useState(false)

  // Privacy
  const [leaderboardOptIn, setLeaderboardOptIn] = useState(false)
  const [publicProfile, setPublicProfile] = useState(false)
  const [privacyStatus, setPrivacyStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name)
  }, [session])

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data: { avatarUrl?: string | null; leaderboardOptIn?: boolean; hasStripeCustomer?: boolean }) => {
        if (typeof data.avatarUrl === 'string') setAvatarUrl(data.avatarUrl)
        if (typeof data.leaderboardOptIn === 'boolean') setLeaderboardOptIn(data.leaderboardOptIn)
        if (typeof data.hasStripeCustomer === 'boolean') setHasStripeCustomer(data.hasStripeCustomer)
      })
      .catch(() => { /* ignore */ })
  }, [])

  useEffect(() => {
    fetch('/api/my-solo')
      .then((r) => (r.ok ? r.json() : null))
      .then(
        (data: {
          soloStyle?: string | null
          guitarHero?: string | null
          soloVibe?: string | null
          customSolo?: string | null
          soloCompleted?: boolean
        } | null) => {
          if (data) {
            setSoloData({
              soloStyle: data.soloStyle ?? null,
              guitarHero: data.guitarHero ?? null,
              soloVibe: data.soloVibe ?? null,
              customSolo: data.customSolo ?? null,
              soloCompleted: data.soloCompleted ?? false,
            })
          }
        },
      )
      .catch(() => { /* ignore */ })
  }, [])

  useEffect(() => {
    fetch('/api/settings/preferences')
      .then((r) => r.json())
      .then(
        (data: {
          weeklyGoalDays?: number
          guitarType?: string
          preferredGenre?: string
          reminderTime?: string
          publicProfile?: boolean
          leaderboardOptIn?: boolean
        }) => {
          if (typeof data.weeklyGoalDays === 'number') setWeeklyGoalDays(data.weeklyGoalDays)
          if (typeof data.guitarType === 'string' && data.guitarType) setGuitarType(data.guitarType)
          if (typeof data.preferredGenre === 'string' && data.preferredGenre) setPreferredGenre(data.preferredGenre)
          if (typeof data.reminderTime === 'string') setReminderTime(data.reminderTime)
          if (typeof data.publicProfile === 'boolean') setPublicProfile(data.publicProfile)
          if (typeof data.leaderboardOptIn === 'boolean') setLeaderboardOptIn(data.leaderboardOptIn)
        },
      )
      .catch(() => { /* ignore */ })
  }, [])

  useEffect(() => {
    try {
      const lh = localStorage.getItem('user-left-handed')
      if (lh === 'true') setLeftHanded(true)
      const fs = localStorage.getItem('user-font-size')
      if (fs) setFontSize(fs)
      const fm = localStorage.getItem('user-focus-mode')
      if (fm === 'true') setFocusMode(true)
      const ac = localStorage.getItem('accent-color')
      if (ac) setAccentColor(ac)
      const ld = localStorage.getItem('layout-density')
      if (ld === 'compact' || ld === 'comfortable') setLayoutDensity(ld)
      const aa = localStorage.getItem('auto-advance')
      if (aa === 'true') setAutoAdvance(true)
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login')
    else if (status === 'authenticated' && session?.user?.purchaseStatus !== 'PAID')
      router.replace('/success?new=true')
  }, [status, session, router])

  const saveName = async () => {
    setNameStatus('saving')
    setNameError('')
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const data = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      await update()
      setNameStatus('saved')
      setTimeout(() => setNameStatus('idle'), 3000)
    } catch (err) {
      setNameError(err instanceof Error ? err.message : 'Failed to save')
      setNameStatus('error')
    }
  }

  const saveAvatar = async () => {
    setAvatarStatus('saving')
    setAvatarError('')
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl: avatarUrl.trim() }),
      })
      const data = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setAvatarStatus('saved')
      setTimeout(() => setAvatarStatus('idle'), 3000)
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : 'Failed to save')
      setAvatarStatus('error')
    }
  }

  const savePassword = async () => {
    setPwError('')
    if (newPw !== confirmPw) { setPwError('Passwords do not match'); return }
    if (newPw.length < 8) { setPwError('Password must be at least 8 characters'); return }
    setPwStatus('saving')
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      })
      const data = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setCurrentPw('')
      setNewPw('')
      setConfirmPw('')
      setPwStatus('saved')
      setTimeout(() => setPwStatus('idle'), 3000)
    } catch (err) {
      setPwError(err instanceof Error ? err.message : 'Failed to update password')
      setPwStatus('error')
    }
  }

  const savePracticePrefs = async () => {
    setPrefStatus('saving')
    try {
      const res = await fetch('/api/settings/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weeklyGoalDays, reminderTime: reminderTime || undefined }),
      })
      const data = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setPrefStatus('saved')
      setTimeout(() => setPrefStatus('idle'), 3000)
    } catch {
      setPrefStatus('error')
    }
  }

  const saveGuitarSetup = async () => {
    try { localStorage.setItem('user-left-handed', String(leftHanded)) } catch { /* ignore */ }
    setGuitarStatus('saving')
    try {
      const res = await fetch('/api/settings/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guitarType: guitarType || undefined,
          preferredGenre: preferredGenre || undefined,
        }),
      })
      const data = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setGuitarStatus('saved')
      setTimeout(() => setGuitarStatus('idle'), 3000)
    } catch {
      setGuitarStatus('error')
    }
  }

  const saveAccessibility = () => {
    try {
      localStorage.setItem('user-font-size', fontSize)
      localStorage.setItem('user-focus-mode', String(focusMode))
    } catch { /* ignore */ }
    setAccessStatus('saved')
    setTimeout(() => setAccessStatus('idle'), 3000)
  }

  const savePrivacy = async () => {
    setPrivacyStatus('saving')
    try {
      const res = await fetch('/api/settings/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicProfile, leaderboardOptIn }),
      })
      const data = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setPrivacyStatus('saved')
      setTimeout(() => setPrivacyStatus('idle'), 3000)
    } catch {
      setPrivacyStatus('error')
    }
  }

  const openPortal = async () => {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = (await res.json()) as { url?: string; error?: string }
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      /* ignore */
    } finally {
      setPortalLoading(false)
    }
  }

  const deleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return
    setDeleteStatus('deleting')
    try {
      const res = await fetch('/api/account/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: 'DELETE' }),
      })
      if (!res.ok) throw new Error('Deletion failed')
      setDeleteStatus('done')
      await signOut({ callbackUrl: '/' })
    } catch {
      setDeleteStatus('error')
    }
  }

  const resetProgress = async () => {
    if (resetConfirm !== 'RESET') return
    setResetStatus('resetting')
    try {
      const res = await fetch('/api/progress/reset', { method: 'DELETE' })
      if (!res.ok) throw new Error('Reset failed')
      setResetStatus('done')
      setTimeout(() => router.replace('/dashboard'), 2000)
    } catch {
      setResetStatus('error')
    }
  }

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
        <Navbar />
        <div className="flex items-center justify-center py-24">
          <div style={{ color: '#a3a3a3' }} className="text-sm">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-black text-white uppercase mb-8">Account Settings</h1>

        {/* Profile */}
        <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6 mb-6">
          <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Profile</h2>
          <div className="space-y-4">
            <div>
              <label style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider block mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                placeholder="Your name"
                style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#ffffff' }}
                className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <div>
              <label style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider block mb-2">
                Email
              </label>
              <input
                type="email"
                value={session?.user?.email ?? ''}
                disabled
                style={{ backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f', color: '#525252' }}
                className="w-full rounded-lg px-3 py-2 text-sm cursor-not-allowed"
              />
              <p style={{ color: '#404040' }} className="text-xs mt-1">Email cannot be changed.</p>
            </div>
            {nameError && (
              <p
                style={{ color: '#ef4444', backgroundColor: '#1a0000', border: '1px solid #7f1d1d' }}
                className="text-xs px-3 py-2 rounded-lg"
              >
                {nameError}
              </p>
            )}
            <button
              onClick={saveName}
              disabled={nameStatus === 'saving'}
              style={saveBtn(nameStatus)}
              className="px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-50"
            >
              {nameStatus === 'saving' ? 'Saving...' : nameStatus === 'saved' ? '✓ Saved' : 'Save Name'}
            </button>
          </div>
        </div>

        {/* Avatar */}
        <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6 mb-6">
          <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Avatar</h2>
          <div className="space-y-4">
            {avatarUrl && (
              <div className="flex items-center gap-4 mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarUrl}
                  alt="Avatar preview"
                  style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid #f59e0b', objectFit: 'cover' }}
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
                <span style={{ color: '#a3a3a3' }} className="text-xs">Current avatar</span>
              </div>
            )}
            <div>
              <label style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider block mb-2">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/your-photo.jpg"
                style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#ffffff' }}
                className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
              <p style={{ color: '#404040' }} className="text-xs mt-1">Paste a direct image URL (JPEG, PNG, etc).</p>
            </div>
            {avatarError && (
              <p
                style={{ color: '#ef4444', backgroundColor: '#1a0000', border: '1px solid #7f1d1d' }}
                className="text-xs px-3 py-2 rounded-lg"
              >
                {avatarError}
              </p>
            )}
            <button
              onClick={saveAvatar}
              disabled={avatarStatus === 'saving'}
              style={saveBtn(avatarStatus)}
              className="px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-50"
            >
              {avatarStatus === 'saving' ? 'Saving...' : avatarStatus === 'saved' ? '✓ Saved' : 'Save Avatar'}
            </button>
          </div>
        </div>

        {/* Password */}
        <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6 mb-6">
          <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Change Password</h2>
          <div className="space-y-4">
            {(['currentPw', 'newPw', 'confirmPw'] as const).map((field) => {
              const labels = { currentPw: 'Current Password', newPw: 'New Password', confirmPw: 'Confirm New Password' }
              const values = { currentPw, newPw, confirmPw }
              const setters = { currentPw: setCurrentPw, newPw: setNewPw, confirmPw: setConfirmPw }
              return (
                <div key={field}>
                  <label style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider block mb-2">
                    {labels[field]}
                  </label>
                  <input
                    type="password"
                    value={values[field]}
                    onChange={(e) => setters[field](e.target.value)}
                    style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#ffffff' }}
                    className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              )
            })}
            {pwError && (
              <p
                style={{ color: '#ef4444', backgroundColor: '#1a0000', border: '1px solid #7f1d1d' }}
                className="text-xs px-3 py-2 rounded-lg"
              >
                {pwError}
              </p>
            )}
            <button
              onClick={savePassword}
              disabled={pwStatus === 'saving' || !currentPw || !newPw || !confirmPw}
              style={saveBtn(pwStatus)}
              className="px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pwStatus === 'saving' ? 'Updating...' : pwStatus === 'saved' ? '✓ Password Updated' : 'Update Password'}
            </button>
          </div>
        </div>

        {/* Practice Reminder */}
        <div className="mb-6">
          <PracticeReminder />
        </div>

        {/* Practice Preferences */}
        <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6 mb-6">
          <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Practice Preferences</h2>
          <div className="space-y-5">
            <div>
              <label style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider block mb-2">
                Practice Reminder Time
              </label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#ffffff' }}
                className="rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
              <p style={{ color: '#404040' }} className="text-xs mt-1">We&apos;ll remind you to practice at this time.</p>
            </div>
            <div>
              <label style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider block mb-2">
                Weekly Goal
              </label>
              <div className="flex flex-wrap gap-2">
                {([3, 5, 7] as const).map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setWeeklyGoalDays(days)}
                    style={pillStyle(weeklyGoalDays === days)}
                  >
                    {days} days
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={savePracticePrefs}
                disabled={prefStatus === 'saving'}
                style={saveBtn(prefStatus)}
                className="px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-50"
              >
                {prefStatus === 'saving' ? 'Saving...' : prefStatus === 'saved' ? '✓ Saved' : 'Save Preferences'}
              </button>
              {prefStatus === 'error' && (
                <span style={{ color: '#ef4444' }} className="text-xs">Failed to save.</span>
              )}
            </div>
          </div>
        </div>

        {/* Guitar Setup */}
        <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6 mb-6">
          <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Guitar Setup</h2>
          <div className="space-y-5">
            <div>
              <label style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider block mb-2">
                Guitar Type
              </label>
              <div className="flex flex-wrap gap-2">
                {['Acoustic', 'Electric', 'Bass'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setGuitarType(opt)}
                    style={pillStyle(guitarType === opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <p style={{ color: '#404040' }} className="text-xs mt-1">Affects tip text throughout the course.</p>
            </div>
            <div>
              <label style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider block mb-2">
                Preferred Genre
              </label>
              <div className="flex flex-wrap gap-2">
                {['Blues', 'Rock', 'Metal', 'Country', 'Pop'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setPreferredGenre(opt)}
                    style={pillStyle(preferredGenre === opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider block mb-3">
                Left-Handed Mode
              </label>
              <div className="flex items-center gap-3">
                <Toggle value={leftHanded} onChange={setLeftHanded} />
                <span style={{ color: leftHanded ? '#f59e0b' : '#a3a3a3' }} className="text-sm font-bold">
                  {leftHanded ? 'Left-handed' : 'Right-handed'}
                </span>
              </div>
              <p style={{ color: '#404040' }} className="text-xs mt-2">Mirrors all fretboard diagrams.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={saveGuitarSetup}
                disabled={guitarStatus === 'saving'}
                style={saveBtn(guitarStatus)}
                className="px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-50"
              >
                {guitarStatus === 'saving' ? 'Saving...' : guitarStatus === 'saved' ? '✓ Saved' : 'Save Guitar Setup'}
              </button>
              {guitarStatus === 'error' && (
                <span style={{ color: '#ef4444' }} className="text-xs">Failed to save.</span>
              )}
            </div>
          </div>
        </div>

        {/* Accessibility */}
        <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6 mb-6">
          <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Accessibility</h2>
          <div className="space-y-5">
            <div>
              <label style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider block mb-2">
                Font Size
              </label>
              <div className="flex flex-wrap gap-2">
                {['Small', 'Normal', 'Large'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFontSize(opt)}
                    style={pillStyle(fontSize === opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider block mb-3">
                Focus Mode
              </label>
              <div className="flex items-center gap-3">
                <Toggle value={focusMode} onChange={setFocusMode} />
                <span style={{ color: focusMode ? '#f59e0b' : '#a3a3a3' }} className="text-sm font-bold">
                  {focusMode ? 'Focus mode on' : 'Focus mode off'}
                </span>
              </div>
              <p style={{ color: '#404040' }} className="text-xs mt-2">Hides XP and gamification elements during lessons.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={saveAccessibility}
                style={saveBtn(accessStatus)}
                className="px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-all"
              >
                {accessStatus === 'saved' ? '✓ Saved' : 'Save Accessibility'}
              </button>
            </div>
          </div>
        </div>

        {/* Personalization */}
        <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6 mb-6">
          <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Personalization</h2>
          <div className="space-y-6">

            {/* Accent Color */}
            <div>
              <label style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider block mb-3">
                Accent Color
              </label>
              <div className="flex flex-wrap gap-3 mb-2">
                {[
                  { name: 'Amber',   hex: '#f59e0b' },
                  { name: 'Emerald', hex: '#10b981' },
                  { name: 'Sky',     hex: '#0ea5e9' },
                  { name: 'Violet',  hex: '#8b5cf6' },
                  { name: 'Rose',    hex: '#f43f5e' },
                  { name: 'Slate',   hex: '#94a3b8' },
                ].map(({ name, hex }) => (
                  <button
                    key={hex}
                    type="button"
                    title={name}
                    onClick={() => {
                      setAccentColor(hex)
                      try { localStorage.setItem('accent-color', hex) } catch { /* ignore */ }
                    }}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: hex,
                      border: 'none',
                      cursor: 'pointer',
                      outline: accentColor === hex ? '2px solid #ffffff' : '2px solid transparent',
                      outlineOffset: 2,
                      transition: 'outline-color 0.15s',
                    }}
                  />
                ))}
              </div>
              <p style={{ color: '#404040' }} className="text-xs">
                Color accent applies to highlights and buttons — full theming coming soon
              </p>
            </div>

            {/* Layout Density */}
            <div>
              <label style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider block mb-3">
                Layout Density
              </label>
              <div className="flex gap-3">
                {([
                  { key: 'comfortable' as const, label: 'Comfortable', desc: 'More spacing, easier reading' },
                  { key: 'compact' as const,     label: 'Compact',     desc: 'More content visible at once' },
                ] as const).map(({ key, label, desc }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setLayoutDensity(key)
                      try { localStorage.setItem('layout-density', key) } catch { /* ignore */ }
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: layoutDensity === key ? '#1a0f00' : '#0a0a0a',
                      border: `1px solid ${layoutDensity === key ? '#f59e0b' : '#262626'}`,
                      borderRadius: '0.5rem',
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <p style={{ color: layoutDensity === key ? '#f59e0b' : '#ffffff', fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                      {label}
                    </p>
                    <p style={{ color: '#525252', fontSize: '0.7rem' }}>{desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Learning Preferences */}
        <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6 mb-6">
          <style>{`
            .auto-advance-thumb {
              transition: transform 0.2s ease;
            }
          `}</style>
          <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Learning Preferences</h2>
          <div>
            <div className="flex items-start gap-4">
              <button
                type="button"
                role="switch"
                aria-checked={autoAdvance}
                onClick={() => {
                  const next = !autoAdvance
                  setAutoAdvance(next)
                  try { localStorage.setItem('auto-advance', String(next)) } catch { /* ignore */ }
                }}
                style={{
                  backgroundColor: autoAdvance ? '#f59e0b' : '#1a1a1a',
                  border: `1px solid ${autoAdvance ? '#d97706' : '#262626'}`,
                  borderRadius: 20,
                  width: 44,
                  height: 24,
                  padding: 2,
                  transition: 'background-color 0.2s',
                  cursor: 'pointer',
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                <div
                  className="auto-advance-thumb"
                  style={{
                    backgroundColor: autoAdvance ? '#000' : '#525252',
                    borderRadius: '50%',
                    width: 18,
                    height: 18,
                    transform: autoAdvance ? 'translateX(20px)' : 'translateX(0)',
                  }}
                />
              </button>
              <div>
                <p style={{ color: autoAdvance ? '#f59e0b' : '#ffffff', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  Auto-advance to next lesson after completing
                </p>
                <p style={{ color: '#404040', fontSize: '0.75rem' }}>
                  Automatically opens the next day&apos;s lesson when you mark one complete
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6 mb-6">
          <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Privacy</h2>
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Toggle value={publicProfile} onChange={setPublicProfile} />
                <span style={{ color: publicProfile ? '#f59e0b' : '#a3a3a3' }} className="text-sm font-bold">
                  {publicProfile ? 'Public profile on' : 'Public profile off'}
                </span>
              </div>
              <p style={{ color: '#404040' }} className="text-xs">
                Let others see your progress at /profile/{session?.user?.id ?? 'your-id'}.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Toggle value={leaderboardOptIn} onChange={setLeaderboardOptIn} />
                <span style={{ color: leaderboardOptIn ? '#f59e0b' : '#a3a3a3' }} className="text-sm font-bold">
                  {leaderboardOptIn ? 'On leaderboard' : 'Not on leaderboard'}
                </span>
              </div>
              <p style={{ color: '#404040' }} className="text-xs">
                Show your name on the{' '}
                <a href="/leaderboard" style={{ color: '#737373' }} className="hover:underline">
                  leaderboard
                </a>
                .
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={savePrivacy}
                disabled={privacyStatus === 'saving'}
                style={saveBtn(privacyStatus)}
                className="px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-50"
              >
                {privacyStatus === 'saving' ? 'Saving...' : privacyStatus === 'saved' ? '✓ Saved' : 'Save Privacy'}
              </button>
              {privacyStatus === 'error' && (
                <span style={{ color: '#ef4444' }} className="text-xs">Failed to save.</span>
              )}
            </div>
          </div>
        </div>

        {/* Accountability Partner */}
        <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6 mb-6">
          <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Accountability Partner</h2>
          <p style={{ color: '#a3a3a3' }} className="text-sm mb-4 leading-relaxed">
            Get matched with a student at a similar level. You will each see the other&apos;s practice streak — keeping
            each other accountable.
          </p>
          <a
            href="/partners"
            style={{ backgroundColor: '#f59e0b', color: '#000' }}
            className="inline-block px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-all"
          >
            Manage Partner
          </a>
        </div>

        {/* Subscription */}
        {hasStripeCustomer && (
          <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6 mb-6">
            <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Subscription</h2>
            <p style={{ color: '#a3a3a3' }} className="text-sm mb-4 leading-relaxed">
              Update your billing details, download invoices, or cancel your subscription.
            </p>
            <button
              onClick={openPortal}
              disabled={portalLoading}
              style={{
                backgroundColor: portalLoading ? '#262626' : '#f59e0b',
                color: portalLoading ? '#a3a3a3' : '#000000',
              }}
              className="inline-block px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
              {portalLoading ? 'Loading...' : 'Manage Subscription'}
            </button>
          </div>
        )}

        {/* Your Solo */}
        <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6 mb-6">
          <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Your Solo</h2>
          {soloData?.customSolo ? (
            <div>
              <p style={{ color: '#a3a3a3' }} className="text-sm mb-4 leading-relaxed">
                Your personalized guitar solo has been generated.
              </p>
              <div className="space-y-1 mb-5">
                {soloData.soloStyle && (
                  <div className="flex gap-2 text-sm">
                    <span style={{ color: '#525252' }} className="w-20 shrink-0">Style</span>
                    <span style={{ color: '#f59e0b' }} className="font-bold capitalize">{soloData.soloStyle}</span>
                  </div>
                )}
                {soloData.guitarHero && (
                  <div className="flex gap-2 text-sm">
                    <span style={{ color: '#525252' }} className="w-20 shrink-0">Inspired by</span>
                    <span className="text-white">{soloData.guitarHero}</span>
                  </div>
                )}
                {soloData.soloVibe && (
                  <div className="flex gap-2 text-sm">
                    <span style={{ color: '#525252' }} className="w-20 shrink-0">Vibe</span>
                    <span className="text-white">
                      {soloData.soloVibe === 'slow_melodic'
                        ? 'Slow & Expressive'
                        : soloData.soloVibe === 'fast_shreddy'
                          ? 'Fast & Shreddy'
                          : 'Balanced'}
                    </span>
                  </div>
                )}
                {soloData.soloCompleted && (
                  <div className="flex gap-2 text-sm">
                    <span style={{ color: '#525252' }} className="w-20 shrink-0">Status</span>
                    <span style={{ color: '#22c55e' }} className="font-bold">Completed</span>
                  </div>
                )}
              </div>
              <div className="flex gap-3 flex-wrap">
                <a
                  href="/my-solo"
                  style={{ backgroundColor: '#f59e0b', color: '#000' }}
                  className="inline-block px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-all"
                >
                  View My Solo
                </a>
                <a
                  href="/my-solo?regen=1"
                  style={{ border: '1px solid #262626', color: '#a3a3a3' }}
                  className="inline-block px-5 py-2 rounded-lg text-sm font-bold hover:text-white hover:border-gray-400 transition-all"
                >
                  Edit Preferences
                </a>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ color: '#a3a3a3' }} className="text-sm mb-4 leading-relaxed">
                You haven&apos;t generated your personalized guitar solo yet. It&apos;s the goal the entire 30-day
                course builds toward.
              </p>
              <a
                href="/my-solo"
                style={{ backgroundColor: '#f59e0b', color: '#000' }}
                className="inline-block px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-all"
              >
                Create My Solo &#8594;
              </a>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div style={{ backgroundColor: '#0d0000', border: '1px solid #7f1d1d' }} className="rounded-xl p-6">
          <h2 style={{ color: '#ef4444' }} className="font-bold text-sm uppercase tracking-wider mb-5">
            Danger Zone
          </h2>

          <div className="mb-6">
            <h3 className="text-white font-bold text-sm mb-1">Reset Progress</h3>
            <p style={{ color: '#a3a3a3' }} className="text-sm mb-4">
              Reset your progress to start the 30-day program from scratch. This permanently deletes all lesson
              completions, practice sessions, XP, achievements, and coach messages.
            </p>
            <button
              onClick={() => setResetModal(true)}
              style={{ backgroundColor: '#1a0000', border: '1px solid #7f1d1d', color: '#ef4444' }}
              className="px-5 py-2 rounded-lg text-sm font-bold hover:bg-red-950 transition-colors"
            >
              Reset All Progress
            </button>
          </div>

          <div style={{ borderTop: '1px solid #3f0000' }} className="pt-6">
            <h3 className="text-white font-bold text-sm mb-1">Delete Account</h3>
            <p style={{ color: '#a3a3a3' }} className="text-sm mb-2">
              Permanently deletes your account and all associated data including:
            </p>
            <ul style={{ color: '#737373' }} className="text-sm list-disc list-inside mb-4 space-y-1">
              <li>All progress and lesson completions</li>
              <li>All AI coach messages</li>
              <li>Your profile and practice session history</li>
              <li>Achievements and XP</li>
            </ul>
            <p style={{ color: '#ef4444' }} className="text-xs font-bold mb-4 uppercase tracking-wider">
              This is permanent and cannot be undone.
            </p>
            <button
              onClick={() => setDeleteModal(true)}
              style={{ backgroundColor: '#1a0000', border: '1px solid #7f1d1d', color: '#ef4444' }}
              className="px-5 py-2 rounded-lg text-sm font-bold hover:bg-red-950 transition-colors"
            >
              Delete My Account
            </button>
          </div>
        </div>
      </main>

      {/* Reset Confirmation Modal */}
      {resetModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 px-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
          onClick={() => setResetModal(false)}
        >
          <div
            style={{ backgroundColor: '#111111', border: '1px solid #7f1d1d', maxWidth: 420, width: '100%' }}
            className="rounded-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ color: '#ef4444' }} className="font-black text-lg uppercase mb-3">
              Confirm Reset
            </h3>
            <p style={{ color: '#a3a3a3' }} className="text-sm mb-4 leading-relaxed">
              This will permanently delete all your progress, XP, achievements, and coach history. You will restart from
              Day 1. <strong className="text-white">This cannot be undone.</strong>
            </p>
            <p style={{ color: '#a3a3a3' }} className="text-sm mb-2">
              Type <span className="text-white font-bold">RESET</span> to confirm:
            </p>
            <input
              type="text"
              value={resetConfirm}
              onChange={(e) => setResetConfirm(e.target.value)}
              placeholder="RESET"
              style={{ backgroundColor: '#1a1a1a', border: '1px solid #7f1d1d', color: '#ffffff' }}
              className="w-full rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none"
            />
            {resetStatus === 'done' && (
              <p style={{ color: '#86efac' }} className="text-sm mb-4">
                Progress reset. Redirecting...
              </p>
            )}
            {resetStatus === 'error' && (
              <p style={{ color: '#ef4444' }} className="text-sm mb-4">
                Reset failed. Please try again.
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setResetModal(false); setResetConfirm('') }}
                style={{ border: '1px solid #262626', color: '#a3a3a3' }}
                className="flex-1 py-2 rounded-lg text-sm font-bold hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={resetProgress}
                disabled={resetConfirm !== 'RESET' || resetStatus === 'resetting'}
                style={{
                  backgroundColor: resetConfirm === 'RESET' ? '#7f1d1d' : '#1a0000',
                  color: '#ef4444',
                  border: '1px solid #7f1d1d',
                }}
                className="flex-1 py-2 rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all"
              >
                {resetStatus === 'resetting' ? 'Resetting...' : 'Reset Everything'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {deleteModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 px-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
          onClick={() => setDeleteModal(false)}
        >
          <div
            style={{ backgroundColor: '#111111', border: '1px solid #7f1d1d', maxWidth: 420, width: '100%' }}
            className="rounded-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ color: '#ef4444' }} className="font-black text-lg uppercase mb-3">
              Delete Account
            </h3>
            <p style={{ color: '#a3a3a3' }} className="text-sm mb-4 leading-relaxed">
              This will permanently delete your account, all progress, coach messages, profile data, and practice
              sessions. <strong className="text-white">This cannot be undone.</strong>
            </p>
            <p style={{ color: '#a3a3a3' }} className="text-sm mb-2">
              Type <span className="text-white font-bold">DELETE</span> to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
              style={{ backgroundColor: '#1a1a1a', border: '1px solid #7f1d1d', color: '#ffffff' }}
              className="w-full rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none"
            />
            {deleteStatus === 'done' && (
              <p style={{ color: '#86efac' }} className="text-sm mb-4">
                Account deleted. Signing out...
              </p>
            )}
            {deleteStatus === 'error' && (
              <p style={{ color: '#ef4444' }} className="text-sm mb-4">
                Deletion failed. Please try again.
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setDeleteModal(false); setDeleteConfirm('') }}
                style={{ border: '1px solid #262626', color: '#a3a3a3' }}
                className="flex-1 py-2 rounded-lg text-sm font-bold hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteAccount}
                disabled={deleteConfirm !== 'DELETE' || deleteStatus === 'deleting'}
                style={{
                  backgroundColor: deleteConfirm === 'DELETE' ? '#7f1d1d' : '#1a0000',
                  color: '#ef4444',
                  border: '1px solid #7f1d1d',
                }}
                className="flex-1 py-2 rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all"
              >
                {deleteStatus === 'deleting' ? 'Deleting...' : 'Delete My Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
