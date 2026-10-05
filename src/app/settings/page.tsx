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

  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwStatus, setPwStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [pwError, setPwError] = useState('')

  const [resetModal, setResetModal] = useState(false)
  const [resetConfirm, setResetConfirm] = useState('')
  const [resetStatus, setResetStatus] = useState<'idle' | 'resetting' | 'done' | 'error'>('idle')

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name)
  }, [session])

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
