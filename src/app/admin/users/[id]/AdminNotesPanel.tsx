'use client'

import { useState } from 'react'

interface Props {
  userId: string
  initialNotes: string | null
  initialTags: string | null
}

export default function AdminNotesPanel({ userId, initialNotes, initialTags }: Props) {
  const [notes, setNotes] = useState(initialNotes ?? '')
  const [tags, setTags] = useState(initialTags ?? '')
  const [editingTags, setEditingTags] = useState(false)
  const [savingNotes, setSavingNotes] = useState(false)
  const [savingTags, setSavingTags] = useState(false)
  const [notesMsg, setNotesMsg] = useState('')
  const [tagsMsg, setTagsMsg] = useState('')

  async function saveNotes() {
    setSavingNotes(true)
    setNotesMsg('')
    const res = await fetch(`/api/admin/users/${userId}/notes`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminNotes: notes }),
    })
    if (res.ok) setNotesMsg('Saved!')
    else setNotesMsg('Failed to save')
    setSavingNotes(false)
    setTimeout(() => setNotesMsg(''), 2000)
  }

  async function saveTags() {
    setSavingTags(true)
    setTagsMsg('')
    const res = await fetch(`/api/admin/users/${userId}/notes`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tags }),
    })
    if (res.ok) {
      setTagsMsg('Saved!')
      setEditingTags(false)
    } else {
      setTagsMsg('Failed to save')
    }
    setSavingTags(false)
    setTimeout(() => setTagsMsg(''), 2000)
  }

  const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean)

  return (
    <div className="space-y-4 mt-4">
      {/* Tags */}
      <div>
        <p style={{ color: '#525252' }} className="text-xs uppercase tracking-wider mb-2">Tags</p>
        {!editingTags ? (
          <div className="flex items-center gap-2 flex-wrap">
            {tagList.length === 0 ? (
              <span style={{ color: '#404040' }} className="text-xs">No tags</span>
            ) : (
              tagList.map((tag) => (
                <span
                  key={tag}
                  style={{ backgroundColor: '#1a1200', border: '1px solid #d97706', color: '#fbbf24' }}
                  className="text-xs px-2 py-0.5 rounded font-medium"
                >
                  {tag}
                </span>
              ))
            )}
            <button
              onClick={() => setEditingTags(true)}
              style={{ color: '#f59e0b' }}
              className="text-xs hover:underline ml-1"
            >
              Edit tags
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="tag1, tag2, tag3"
              style={{ backgroundColor: '#0a0a0a', border: '1px solid #262626', color: '#fff' }}
              className="flex-1 px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:border-amber-700 placeholder-neutral-600"
            />
            <button
              onClick={() => { void saveTags() }}
              disabled={savingTags}
              style={{ backgroundColor: '#f59e0b', color: '#000' }}
              className="text-xs px-3 py-1.5 rounded font-bold disabled:opacity-50"
            >
              {savingTags ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setEditingTags(false)}
              style={{ color: '#737373' }}
              className="text-xs hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
        {tagsMsg && <p style={{ color: tagsMsg === 'Saved!' ? '#86efac' : '#ef4444' }} className="text-xs mt-1">{tagsMsg}</p>}
      </div>

      {/* Admin Notes */}
      <div>
        <p style={{ color: '#525252' }} className="text-xs uppercase tracking-wider mb-2">Admin Notes</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Private notes about this user..."
          style={{ backgroundColor: '#0a0a0a', border: '1px solid #262626', color: '#fff' }}
          className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-amber-700 placeholder-neutral-600 resize-none"
        />
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => { void saveNotes() }}
            disabled={savingNotes}
            style={{ backgroundColor: '#f59e0b', color: '#000' }}
            className="text-xs px-3 py-1.5 rounded font-bold disabled:opacity-50"
          >
            {savingNotes ? 'Saving...' : 'Save Notes'}
          </button>
          {notesMsg && <p style={{ color: notesMsg === 'Saved!' ? '#86efac' : '#ef4444' }} className="text-xs">{notesMsg}</p>}
        </div>
      </div>
    </div>
  )
}
