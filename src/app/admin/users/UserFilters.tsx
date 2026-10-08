'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function UserFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const q = searchParams.get('q') ?? ''
  const status = searchParams.get('status') ?? ''
  const activity = searchParams.get('activity') ?? ''
  const sort = searchParams.get('sort') ?? ''

  const [searchInput, setSearchInput] = useState(q)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const hasActive = q || status || activity || sort

  function buildUrl(overrides: Record<string, string>) {
    const params = new URLSearchParams()
    const merged: Record<string, string> = { q, status, activity, sort, ...overrides }
    for (const [k, v] of Object.entries(merged)) if (v) params.set(k, v)
    const qs = params.toString()
    return qs ? `${pathname}?${qs}` : pathname
  }

  function handleSearchChange(val: string) {
    setSearchInput(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      router.push(buildUrl({ q: val, page: '' }))
    }, 300)
  }

  function handleStatusChange(val: string) {
    router.push(buildUrl({ status: val, page: '' }))
  }

  function handleActivityChange(val: string) {
    router.push(buildUrl({ activity: val, page: '' }))
  }

  function handleSortChange(val: string) {
    router.push(buildUrl({ sort: val, page: '' }))
  }

  // Sync search input when URL params change (e.g. browser back/forward)
  useEffect(() => {
    setSearchInput(q)
  }, [q])

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <input
        value={searchInput}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder="Search email or name..."
        style={{ backgroundColor: '#111111', border: '1px solid #262626', color: '#fff' }}
        className="px-3 py-2 rounded-lg text-sm flex-1 min-w-48 focus:outline-none placeholder-neutral-600"
      />
      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        style={{ backgroundColor: '#111111', border: '1px solid #262626', color: '#fff' }}
        className="px-3 py-2 rounded-lg text-sm focus:outline-none"
      >
        <option value="">All statuses</option>
        <option value="PAID">Paid</option>
        <option value="FREE">Free</option>
      </select>
      <select
        value={activity}
        onChange={(e) => handleActivityChange(e.target.value)}
        style={{ backgroundColor: '#111111', border: '1px solid #262626', color: '#fff' }}
        className="px-3 py-2 rounded-lg text-sm focus:outline-none"
      >
        <option value="">All activity</option>
        <option value="active">Active (7d)</option>
        <option value="at-risk">At risk (2–4d)</option>
        <option value="churned">Churned (5d+)</option>
        <option value="inactive">Inactive (7d+)</option>
        <option value="never">Never practiced</option>
      </select>
      <select
        value={sort}
        onChange={(e) => handleSortChange(e.target.value)}
        style={{ backgroundColor: '#111111', border: '1px solid #262626', color: '#fff' }}
        className="px-3 py-2 rounded-lg text-sm focus:outline-none"
      >
        <option value="">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="xp">Most XP</option>
        <option value="streak">Longest streak</option>
      </select>
      {hasActive && (
        <Link
          href="/admin/users"
          style={{ border: '1px solid #262626', color: '#737373' }}
          className="px-4 py-2 rounded-lg text-sm hover:text-white transition-colors"
        >
          Clear
        </Link>
      )}
    </div>
  )
}
