import { useDraggable } from '@dnd-kit/core'
import TagChip from './TagChip'
import { STATUS_ACCENT, daysSince, isOverdue, STATUSES } from '../utils/helpers'

export default function JobCard({ job, onEdit, onArchive, onDelete, onAddRound }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: job.id,
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
      className={`group relative cursor-grab rounded-lg border-l-4 ${accent} bg-white p-3 shadow-sm ring-1 ring-black/5 transition hover:shadow-md active:cursor-grabbing dark:bg-slate-800 dark:ring-white/10`}
    >
      {overdue && (
        <span
          className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500"
          title="Needs follow-up"
        />
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
            className="shrink-0 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
            title="View job posting"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-8 16v-8H9v8h2zm-1-9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18 19v-4.5c0-2.2-1.2-3.5-3-3.5-1.4 0-2 .8-2.5 1.4V11h-2v8h2v-4.2c0-1.1.5-1.8 1.5-1.8s1.5.7 1.5 1.8V19h2z" />
            </svg>
          </a>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {job.resume && (
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
            {job.resume}
          </span>
        )}
        {(job.tags || []).slice(0, 3).map((tag) => (
          <TagChip key={tag} tag={tag} />
        ))}
        {roundCount > 0 && (
          <span
            className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300"
            title="Interview rounds"
          >
            {roundsDone}/{roundCount} rounds
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
        <span>{days !== null ? `${days}d` : statusLabel}</span>
        {overdue && <span className="font-medium text-red-500">Follow up</span>}
      </div>

      <div className="mt-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit(job)
          }}
          className="rounded px-1.5 py-0.5 text-[11px] text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAddRound(job)
          }}
          className="rounded px-1.5 py-0.5 text-[11px] text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
        >
          + Round
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onArchive(job)
          }}
          className="rounded px-1.5 py-0.5 text-[11px] text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
        >
          Archive
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(job)
          }}
          className="rounded px-1.5 py-0.5 text-[11px] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
        >
          Delete
        </button>
      </div>
      {isDragging && <div className="sr-only">Dragging</div>}
    </div>
  )
}
