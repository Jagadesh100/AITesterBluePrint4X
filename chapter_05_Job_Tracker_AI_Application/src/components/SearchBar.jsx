import { useState, useMemo } from 'react'
import TagChip from './TagChip'
import { tagColor } from '../utils/helpers'

export default function SearchBar({ allJobs, filter, onChange }) {
  const [tagInput, setTagInput] = useState('')

  const allTags = useMemo(() => {
    const set = new Set()
    for (const job of allJobs) {
      for (const tag of job.tags || []) set.add(tag)
    }
    return [...set].sort()
  }, [allJobs])

  const toggleTag = (tag) => {
    const current = filter.tags || []
    const next = current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag]
    onChange({ ...filter, tags: next })
  }

  function addTagFromInput() {
    const tag = tagInput.trim()
    if (tag && !(filter.tags || []).includes(tag)) {
      onChange({ ...filter, tags: [...(filter.tags || []), tag] })
    }
    setTagInput('')
  }

  const inputCls =
    'w-56 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500'

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
          </svg>
          <input
            type="text"
            value={filter.query || ''}
            onChange={(e) => onChange({ ...filter, query: e.target.value })}
            placeholder="Search company or role…"
            className={`${inputCls} pl-8`}
          />
        </div>
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault()
                addTagFromInput()
              }
            }}
            placeholder="Filter by tag (Enter to add)…"
            className={`${inputCls} pl-8`}
          />
        </div>
        {(filter.tags || []).map((tag) => (
          <TagChip key={tag} tag={tag} onRemove={() => toggleTag(tag)} />
        ))}
      </div>
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          <span className="mr-1 text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Tags
          </span>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`rounded-full px-2 py-0.5 text-[11px] transition ${
                (filter.tags || []).includes(tag)
                  ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-white dark:ring-offset-slate-900'
                  : 'opacity-70 hover:opacity-100 hover:scale-105'
              } ${tagColor(tag)}`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
