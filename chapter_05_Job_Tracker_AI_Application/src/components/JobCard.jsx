import { useDraggable } from '@dnd-kit/core'
import TagChip from './TagChip'
import { STATUS_ACCENT, daysSince, isOverdue, STATUSES, ALLOWED_TRANSITIONS } from '../utils/helpers'

export default function JobCard({ job, onEdit, onArchive, onDelete, onAddRound }) {
  // Locked statuses (empty transition list) cannot be dragged.
  const locked = !(ALLOWED_TRANSITIONS[job.status] || []).length
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: job.id,
    disabled: locked,
  })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  const accent = STATUS_ACCENT[job.status] || STATUS_ACCENT.wishlist
  const days = daysSince(job.dateApplied)
  const overdue = isOverdue(job)
  const statusLabel = STATUSES.find((s) => s.key === job.status)?.label || job.status
  const roundCount = (job.interviewRounds || []).length
  const roundsDone = (job.interviewRounds || []).filter((r) => r.done).length

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative ${locked ? 'cursor-default' : 'cursor-grab'} rounded-xl border-l-4 ${accent} border-y border-r border-slate-300 p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing dark:border-y-slate-700/60 dark:border-r-slate-700/60 dark:shadow-black/20`}
    >
      {overdue && (
        <span
          className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white"
          title="Needs follow-up"
        >
          !
        </span>
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
            {job.company}
          </p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">{job.role}</p>
        </div>
        {job.linkedinUrl && (
          <a
            href={job.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 text-slate-400 transition hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400"
            title="View job posting"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-8 16v-8H9v8h2zm-1-9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18 19v-4.5c0-2.2-1.2-3.5-3-3.5-1.4 0-2 .8-2.5 1.4V11h-2v8h2v-4.2c0-1.1.5-1.8 1.5-1.8s1.5.7 1.5 1.8V19h2z" />
            </svg>
          </a>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5 overflow-hidden">
        {job.resume && (
          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-700/70 dark:text-slate-300">
            {job.resume}
          </span>
        )}
        {(job.tags || []).slice(0, 3).map((tag) => (
          <TagChip key={tag} tag={tag} />
        ))}
        {roundCount > 0 && (
          <span
            className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-700/70 dark:text-slate-300"
            title="Interview rounds"
          >
            {roundsDone}/{roundCount} rounds
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="truncate rounded-md bg-slate-200/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-700/60 dark:text-slate-300">
          {statusLabel}
        </span>
        <span className="shrink-0 text-[11px] text-slate-400 dark:text-slate-500">
          {days !== null ? `${days}d` : ''}
        </span>
        {overdue && <span className="shrink-0 text-[11px] font-semibold text-red-500">Follow up</span>}
      </div>

      <div className="mt-2 grid grid-cols-4 gap-0.5 opacity-0 transition group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit(job)
          }}
          title="Edit"
          className="flex items-center justify-center rounded-md px-1 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        {job.status === 'interview' && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAddRound(job)
            }}
            title="Add interview round"
            className="flex items-center justify-center rounded-md px-1 py-1 text-purple-500 hover:bg-purple-50 hover:text-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/30 dark:hover:text-purple-300"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onArchive(job)
          }}
          title="Archive"
          className="flex items-center justify-center rounded-md px-1 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M7 8v10a2 2 0 002 2h6a2 2 0 002-2V8m-9 4h6" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(job)
          }}
          title="Delete"
          className="flex items-center justify-center rounded-md px-1 py-1 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      {isDragging && <div className="sr-only">Dragging</div>}
    </div>
  )
}
