'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PracticeReminder from '@/components/PracticeReminder'

export default function SettingsPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  const [name, setName] = useState('')
  const [nameStatus, setNameStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [nameError, setNameError] = useState('')

  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarStatus, setAvatarStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [avatarError, setAvatarError] = useState('')

  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwStatus, setPwStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [pwError, setPwError] = useState('')

  const [resetModal, setResetModal] = useState(false)
  const [resetConfirm, setResetConfirm] = useState('')
  const [resetStatus, setResetStatus] = useState<'idle' | 'resetting' | 'done' | 'error'>('idle')

  const [leaderboardOptIn, setLeaderboardOptIn] = useState(false)
  const [leaderboardStatus, setLeaderboardStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name)
  }, [session])

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data: { avatarUrl?: string | null; leaderboardOptIn?: boolean }) => {
        if (typeof data.avatarUrl === 'string') setAvatarUrl(data.avatarUrl)
        if (typeof data.leaderboardOptIn === 'boolean') setLeaderboardOptIn(data.leaderboardOptIn)
      })
      .catch(() => { /* ignore */ })
  }, [])

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login')
    else if (status === 'authenticated' && session?.user?.purchaseStatus !== 'PAID') router.replace('/success?new=true')
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
      const data = await res.json() as { ok?: boolean; error?: string }
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
      const data = await res.json() as { ok?: boolean; error?: string }
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
      const data = await res.json() as { ok?: boolean; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
      setPwStatus('saved')
      setTimeout(() => setPwStatus('idle'), 3000)
    } catch (err) {
      setPwError(err instanceof Error ? err.message : 'Failed to update password')
      setPwStatus('error')
    }
  }

  const saveLeaderboard = async (value: boolean) => {
    setLeaderboardOptIn(value)
    setLeaderboardStatus('saving')
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leaderboardOptIn: value }),
      })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setLeaderboardStatus('saved')
      setTimeout(() => setLeaderboardStatus('idle'), 3000)
    } catch {
      setLeaderboardStatus('error')
      setLeaderboardOptIn(!value) // revert
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
              <p style={{ color: '#ef4444', backgroundColor: '#1a0000', border: '1px solid #7f1d1d' }} className="text-xs px-3 py-2 rounded-lg">
                {nameError}
              </p>
            )}
            <button
              onClick={saveName}
              disabled={nameStatus === 'saving'}
              style={{
                backgroundColor: nameStatus === 'saved' ? '#14532d' : '#f59e0b',
                color: nameStatus === 'saved' ? '#86efac' : '#000000',
              }}
              className="px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-50"
            >
              {nameStatus === 'saving' ? 'Saving...' : nameStatus === 'saved' ? '✓ Saved' : 'Save Name'}
            </button>
          </div>
        </div>

        {/* Avatar URL */}
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
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
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
              <p style={{ color: '#ef4444', backgroundColor: '#1a0000', border: '1px solid #7f1d1d' }} className="text-xs px-3 py-2 rounded-lg">
                {avatarError}
              </p>
            )}
            <button
              onClick={saveAvatar}
              disabled={avatarStatus === 'saving'}
              style={{
                backgroundColor: avatarStatus === 'saved' ? '#14532d' : '#f59e0b',
                color: avatarStatus === 'saved' ? '#86efac' : '#000000',
              }}
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
              <p style={{ color: '#ef4444', backgroundColor: '#1a0000', border: '1px solid #7f1d1d' }} className="text-xs px-3 py-2 rounded-lg">
                {pwError}
              </p>
            )}
            <button
              onClick={savePassword}
              disabled={pwStatus === 'saving' || !currentPw || !newPw || !confirmPw}
              style={{
                backgroundColor: pwStatus === 'saved' ? '#14532d' : '#f59e0b',
                color: pwStatus === 'saved' ? '#86efac' : '#000000',
              }}
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

        {/* Leaderboard */}
        <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6 mb-6">
          <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Leaderboard</h2>
          <p style={{ color: '#a3a3a3' }} className="text-sm mb-5 leading-relaxed">
            Opt in to appear on the{' '}
            <a href="/leaderboard" style={{ color: '#f59e0b' }} className="hover:underline">student leaderboard</a>.
            Your name, XP, streak, and days completed will be visible to other students. You can opt out at any time.
          </p>
          <div className="flex items-center gap-4">
            <button
              role="switch"
              aria-checked={leaderboardOptIn}
              onClick={() => saveLeaderboard(!leaderboardOptIn)}
              disabled={leaderboardStatus === 'saving'}
              style={{
                backgroundColor: leaderboardOptIn ? '#f59e0b' : '#1a1a1a',
                border: `1px solid ${leaderboardOptIn ? '#d97706' : '#262626'}`,
                borderRadius: 20,
                width: 44,
                height: 24,
                padding: 2,
                transition: 'background-color 0.2s',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  backgroundColor: leaderboardOptIn ? '#000' : '#525252',
                  borderRadius: '50%',
                  width: 18,
                  height: 18,
                  transform: leaderboardOptIn ? 'translateX(20px)' : 'translateX(0)',
                  transition: 'transform 0.2s',
                }}
              />
            </button>
            <span style={{ color: leaderboardOptIn ? '#f59e0b' : '#a3a3a3' }} className="text-sm font-bold">
              {leaderboardOptIn ? 'On leaderboard' : 'Not on leaderboard'}
            </span>
            {leaderboardStatus === 'saved' && (
              <span style={{ color: '#86efac' }} className="text-xs">✓ Saved</span>
            )}
            {leaderboardStatus === 'error' && (
              <span style={{ color: '#ef4444' }} className="text-xs">Failed to save</span>
            )}
          </div>
        </div>

        {/* Accountability Partner */}
        <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6 mb-6">
          <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Accountability Partner</h2>
          <p style={{ color: '#a3a3a3' }} className="text-sm mb-4 leading-relaxed">
            Get matched with a student at a similar level. You will each see the other&apos;s practice streak — keeping each other accountable.
          </p>
          <a
            href="/partners"
            style={{ backgroundColor: '#f59e0b', color: '#000' }}
            className="inline-block px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-all"
          >
            Manage Partner
          </a>
        </div>

        {/* Danger Zone */}
        <div style={{ backgroundColor: '#110000', border: '1px solid #7f1d1d' }} className="rounded-xl p-6">
          <h2 style={{ color: '#ef4444' }} className="font-bold text-sm uppercase tracking-wider mb-2">Danger Zone</h2>
          <p style={{ color: '#a3a3a3' }} className="text-sm mb-5">
            Reset your progress to start the 30-day program from scratch. This permanently deletes all lesson completions, practice sessions, XP, achievements, and coach messages.
          </p>
          <button
            onClick={() => setResetModal(true)}
            style={{ backgroundColor: '#1a0000', border: '1px solid #7f1d1d', color: '#ef4444' }}
            className="px-5 py-2 rounded-lg text-sm font-bold hover:bg-red-950 transition-colors"
          >
            Reset All Progress
          </button>
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
            <h3 style={{ color: '#ef4444' }} className="font-black text-lg uppercase mb-3">Confirm Reset</h3>
            <p style={{ color: '#a3a3a3' }} className="text-sm mb-4 leading-relaxed">
              This will permanently delete all your progress, XP, achievements, and coach history.
              You will restart from Day 1. <strong className="text-white">This cannot be undone.</strong>
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
              <p style={{ color: '#86efac' }} className="text-sm mb-4">Progress reset. Redirecting...</p>
            )}
            {resetStatus === 'error' && (
              <p style={{ color: '#ef4444' }} className="text-sm mb-4">Reset failed. Please try again.</p>
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
                style={{ backgroundColor: resetConfirm === 'RESET' ? '#7f1d1d' : '#1a0000', color: '#ef4444', border: '1px solid #7f1d1d' }}
                className="flex-1 py-2 rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all"
              >
                {resetStatus === 'resetting' ? 'Resetting...' : 'Reset Everything'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
