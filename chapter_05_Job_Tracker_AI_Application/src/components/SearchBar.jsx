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

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={filter.query || ''}
          onChange={(e) => onChange({ ...filter, query: e.target.value })}
          placeholder="Search company or role…"
          className="w-56 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        />
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
          className="w-56 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        />
        {(filter.tags || []).map((tag) => (
          <TagChip key={tag} tag={tag} onRemove={() => toggleTag(tag)} />
        ))}
      </div>
      <div className="flex flex-wrap gap-1">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`rounded-full px-2 py-0.5 text-[11px] ${
              (filter.tags || []).includes(tag)
                ? 'ring-2 ring-blue-400'
                : 'opacity-70 hover:opacity-100'
            } ${tagColor(tag)}`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}
