'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import Navbar from '@/components/Navbar'
import type { AudioAssetRecord } from '@/types'

export default function AdminUploadPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated' && session?.user.role !== 'ADMIN') router.push('/dashboard')
  }, [session, status, router])

  const [assets, setAssets] = useState<AudioAssetRecord[]>([])
  const [loadingAssets, setLoadingAssets] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const [type, setType] = useState('Technique Demo')
  const [label, setLabel] = useState('')
  const [url, setUrl] = useState('')
  const [day, setDay] = useState('')
  const [section, setSection] = useState('')
  const [speed, setSpeed] = useState('')
  const [published, setPublished] = useState(false)

  const fetchAssets = async () => {
    setLoadingAssets(true)
    try {
      const res = await fetch('/api/admin/upload')
      const data = await res.json() as { assets: AudioAssetRecord[] }
      setAssets(data.assets ?? [])
    } catch {
      // ignore
    } finally {
      setLoadingAssets(false)
    }
  }

  useEffect(() => {
    if (session?.user.role === 'ADMIN') fetchAssets()
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          label,
          url,
          day: day ? parseInt(day) : undefined,
          section: section ? parseInt(section) : undefined,
          speed: speed || undefined,
          published,
        }),
      })

      if (!res.ok) {
        const data = await res.json() as { error?: string }
        setError(data.error ?? 'Failed to save')
        return
      }

      setSuccess('Asset saved successfully.')
      setLabel('')
      setUrl('')
      setDay('')
      setSection('')
      setSpeed('')
      setPublished(false)
      fetchAssets()
    } catch {
      setError('Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this asset?')) return
    await fetch(`/api/admin/upload?id=${id}`, { method: 'DELETE' })
    fetchAssets()
  }

  if (status === 'loading') return null

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <h1 className="text-2xl font-black text-white uppercase mb-2">Audio Assets</h1>
          <div style={{ backgroundColor: '#1a1200', border: '1px solid #a16207', color: '#fef08a' }} className="rounded-lg px-4 py-3 text-sm mb-6">
            Upload your audio files to your preferred host (Cloudinary, S3, etc.) then paste the URL here. Supported formats: MP3, WAV, OGG.
          </div>

          {/* Upload form */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6 mb-8">
            <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Add New Asset</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label style={{ color: '#a3a3a3' }} className="block text-xs uppercase tracking-wider mb-2">Asset Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#ffffff' }}
                    className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                  >
                    <option>Technique Demo</option>
                    <option>Solo Section</option>
                    <option>Full Solo</option>
                    <option>Backing Track</option>
                  </select>
                </div>
                <div>
                  <label style={{ color: '#a3a3a3' }} className="block text-xs uppercase tracking-wider mb-2">Label</label>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    required
                    placeholder="e.g. Section 1 - Slow"
                    style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#ffffff' }}
                    className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none placeholder-gray-600"
                  />
                </div>
              </div>

              <div>
                <label style={{ color: '#a3a3a3' }} className="block text-xs uppercase tracking-wider mb-2">Audio URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  placeholder="https://your-host.com/audio-file.mp3"
                  style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#ffffff' }}
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none placeholder-gray-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label style={{ color: '#a3a3a3' }} className="block text-xs uppercase tracking-wider mb-2">Day (optional)</label>
                  <input
                    type="number"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    min="1"
                    max="30"
                    placeholder="1-30"
                    style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#ffffff' }}
                    className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none placeholder-gray-600"
                  />
                </div>
                <div>
                  <label style={{ color: '#a3a3a3' }} className="block text-xs uppercase tracking-wider mb-2">Section (optional)</label>
                  <input
                    type="number"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    min="1"
                    max="4"
                    placeholder="1-4"
                    style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#ffffff' }}
                    className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none placeholder-gray-600"
                  />
                </div>
                <div>
                  <label style={{ color: '#a3a3a3' }} className="block text-xs uppercase tracking-wider mb-2">Speed</label>
                  <select
                    value={speed}
                    onChange={(e) => setSpeed(e.target.value)}
                    style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#ffffff' }}
                    className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                  >
                    <option value="">—</option>
                    <option>Slow</option>
                    <option>Full Speed</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  style={{ accentColor: '#f59e0b' }}
                />
                <span style={{ color: '#a3a3a3' }} className="text-sm">Published (visible to students)</span>
              </label>

              {error && <p style={{ color: '#fca5a5' }} className="text-sm">{error}</p>}
              {success && <p style={{ color: '#86efac' }} className="text-sm">{success}</p>}

              <button
                type="submit"
                disabled={submitting}
                style={{ backgroundColor: submitting ? '#262626' : '#f59e0b', color: submitting ? '#a3a3a3' : '#000' }}
                className="px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors disabled:cursor-not-allowed"
              >
                {submitting ? 'Saving...' : 'Save Asset'}
              </button>
            </form>
          </div>

          {/* Assets table */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl overflow-hidden">
            <div className="px-5 py-4" style={{ borderBottom: '1px solid #262626' }}>
              <h2 className="text-white font-bold text-sm uppercase tracking-wider">Existing Assets</h2>
            </div>
            {loadingAssets ? (
              <p style={{ color: '#a3a3a3' }} className="p-5 text-sm">Loading...</p>
            ) : assets.length === 0 ? (
              <p style={{ color: '#a3a3a3' }} className="p-5 text-sm">No assets yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #262626', backgroundColor: '#1a1a1a' }}>
                      {['Label', 'Type', 'Day', 'Speed', 'Status', 'Actions'].map((h) => (
                        <th key={h} style={{ color: '#a3a3a3' }} className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((asset) => (
                      <tr key={asset.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                        <td className="px-4 py-3">
                          <p className="text-white text-xs">{asset.label}</p>
                          <a href={asset.url} target="_blank" rel="noopener noreferrer" style={{ color: '#0ea5e9' }} className="text-xs hover:underline truncate block max-w-xs">
                            {asset.url}
                          </a>
                        </td>
                        <td style={{ color: '#a3a3a3' }} className="px-4 py-3 text-xs">{asset.type}</td>
                        <td style={{ color: '#a3a3a3' }} className="px-4 py-3 text-xs">{asset.day ?? '—'}</td>
                        <td style={{ color: '#a3a3a3' }} className="px-4 py-3 text-xs">{asset.speed ?? '—'}</td>
                        <td className="px-4 py-3">
                          <span style={{ color: asset.published ? '#86efac' : '#a3a3a3' }} className="text-xs">
                            {asset.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDelete(asset.id)}
                            style={{ color: '#fca5a5' }}
                            className="text-xs hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
