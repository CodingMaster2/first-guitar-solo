'use client'

import { useState } from 'react'

interface FeatureFlag {
  id: string
  key: string
  enabled: boolean
  rollout: number
  createdAt: Date
  updatedAt: Date
}

async function patchFlag(id: string, update: { enabled?: boolean; rollout?: number }) {
  const res = await fetch('/api/admin/flags', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...update }),
  })
  if (!res.ok) throw new Error('Failed to update flag')
  return res.json()
}

export default function FlagsList({ initialFlags }: { initialFlags: FeatureFlag[] }) {
  const [flags, setFlags] = useState<FeatureFlag[]>(initialFlags)
  const [newKey, setNewKey] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  const toggle = async (flag: FeatureFlag) => {
    const prev = flags
    setFlags(flags.map((f) => (f.id === flag.id ? { ...f, enabled: !f.enabled } : f)))
    try {
      await patchFlag(flag.id, { enabled: !flag.enabled })
    } catch {
      setFlags(prev)
    }
  }

  const updateRollout = async (flag: FeatureFlag, value: number) => {
    try {
      await patchFlag(flag.id, { rollout: value })
    } catch {
      // silently revert
      setFlags((prev) => prev.map((f) => (f.id === flag.id ? { ...f, rollout: flag.rollout } : f)))
    }
  }

  const createFlag = async () => {
    if (!newKey.trim()) {
      setError('Key is required')
      return
    }
    setCreating(true)
    setError('')
    try {
      const res = await fetch('/api/admin/flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: newKey.trim(), enabled: false, rollout: 100 }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Failed to create flag')
      }
      const created: FeatureFlag = await res.json()
      setFlags((prev) => [...prev, created].sort((a, b) => a.key.localeCompare(b.key)))
      setNewKey('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create flag')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div>
      {/* Create new flag */}
      <div
        style={{
          backgroundColor: '#111111',
          border: '1px solid #1f1f1f',
          borderRadius: '8px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        <p
          style={{
            color: '#a3a3a3',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.75rem',
          }}
        >
          Create Flag
        </p>
        <div className="flex gap-3">
          <input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createFlag()}
            placeholder="feature_key"
            style={{
              flex: 1,
              backgroundColor: '#0a0a0a',
              border: '1px solid #262626',
              borderRadius: '6px',
              color: '#d4d4d4',
              fontSize: '0.875rem',
              padding: '8px 12px',
              outline: 'none',
              fontFamily: 'monospace',
            }}
          />
          <button
            onClick={createFlag}
            disabled={creating}
            style={{
              backgroundColor: '#f59e0b',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: creating ? 'not-allowed' : 'pointer',
              opacity: creating ? 0.7 : 1,
              whiteSpace: 'nowrap',
            }}
          >
            {creating ? 'Adding…' : 'Add Flag'}
          </button>
        </div>
        {error && (
          <p style={{ color: '#fca5a5', fontSize: '0.75rem', marginTop: '0.5rem' }}>{error}</p>
        )}
      </div>

      {/* Flags table */}
      <div
        style={{
          backgroundColor: '#111111',
          border: '1px solid #1f1f1f',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1f1f1f' }}>
                {['Key', 'Enabled', 'Rollout %', 'Status'].map((h) => (
                  <th
                    key={h}
                    style={{
                      color: '#525252',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {flags.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      color: '#525252',
                      fontSize: '0.875rem',
                      padding: '2rem',
                      textAlign: 'center',
                    }}
                  >
                    No feature flags yet.
                  </td>
                </tr>
              )}
              {flags.map((flag) => (
                <tr key={flag.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                  {/* Key */}
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <code
                      style={{
                        color: '#d4d4d4',
                        fontSize: '0.8rem',
                        backgroundColor: '#1a1a1a',
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      {flag.key}
                    </code>
                  </td>

                  {/* Toggle */}
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <button
                      onClick={() => toggle(flag)}
                      aria-label={flag.enabled ? 'Disable flag' : 'Enable flag'}
                      style={{
                        width: 44,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: flag.enabled ? '#f59e0b' : '#262626',
                        border: 'none',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          top: 2,
                          left: flag.enabled ? 22 : 2,
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          backgroundColor: '#fff',
                          transition: 'left 0.2s',
                        }}
                      />
                    </button>
                  </td>

                  {/* Rollout */}
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={flag.rollout}
                        onChange={(e) => {
                          const v = Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                          setFlags((prev) =>
                            prev.map((f) => (f.id === flag.id ? { ...f, rollout: v } : f)),
                          )
                        }}
                        onBlur={(e) => {
                          const v = Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                          updateRollout(flag, v)
                        }}
                        style={{
                          width: 64,
                          backgroundColor: '#0a0a0a',
                          border: '1px solid #262626',
                          borderRadius: '4px',
                          color: '#d4d4d4',
                          fontSize: '0.8rem',
                          padding: '4px 8px',
                          outline: 'none',
                        }}
                      />
                      <span style={{ color: '#525252', fontSize: '0.75rem' }}>%</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span
                      style={{
                        color: flag.enabled ? '#4ade80' : '#525252',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {flag.enabled ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
