import { useState } from 'react'
import TagChip from './TagChip'
import { STATUSES } from '../utils/helpers'

export default function ArchiveView({ jobs, onRestore, onDelete }) {
  const [confirmId, setConfirmId] = useState(null)
  const archived = jobs.filter((j) => j.archived)

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
        Archived ({archived.length})
      </h2>
      {archived.length === 0 && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No archived applications. Archive a card from the board to move it here.
        </p>
      )}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {archived.map((job) => {
          const statusLabel = STATUSES.find((s) => s.key === job.status)?.label || job.status
          return (
            <div
              key={job.id}
              className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-black/5 dark:bg-slate-800 dark:ring-white/10"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {job.company}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">{job.role}</p>
                </div>
                <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  {statusLabel}
                </span>
              </div>
              {(job.tags || []).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {job.tags.map((tag) => (
                    <TagChip key={tag} tag={tag} />
                  ))}
                </div>
              )}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => onRestore(job)}
                  className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                >
                  Restore
                </button>
                {confirmId === job.id ? (
                  <button
                    onClick={() => {
                      onDelete(job.id)
                      setConfirmId(null)
                    }}
                    className="rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
                  >
                    Confirm delete
                  </button>
                ) : (
                  <button
                    onClick={() => setConfirmId(job.id)}
                    className="rounded-lg border border-red-300 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/30"
                  >
                    Delete permanently
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
