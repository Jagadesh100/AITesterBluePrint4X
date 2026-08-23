import { useDroppable } from '@dnd-kit/core'
import JobCard from './JobCard'

const STATUS_DOT = {
  wishlist: 'bg-slate-400',
  applied: 'bg-blue-500',
  followup: 'bg-amber-500',
  interview: 'bg-purple-500',
  offer: 'bg-emerald-500',
  offerRejected: 'bg-orange-500',
  rejected: 'bg-red-500',
}

// Only these statuses can add a brand-new job card via the column "+ Add" button.
const ADD_ALLOWED = ['wishlist', 'applied', 'interview']

export default function Column({ status, label, jobs, activeAllowed = [], activeFrom = null, onAdd, onEdit, onArchive, onDelete, onAddRound }) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const dot = STATUS_DOT[status] || STATUS_DOT.wishlist
  const canAdd = ADD_ALLOWED.includes(status)

  // A drag is in progress and this column is neither the source nor a legal target -> dim it.
  const dragActive = activeAllowed.length > 0
  const dimmed = dragActive && status !== activeFrom && !activeAllowed.includes(status)
  const legalTarget = activeAllowed.includes(status)

  return (
    <div
      ref={setNodeRef}
      className={`flex h-full min-w-0 flex-1 flex-col rounded-2xl border bg-slate-100/80 transition dark:bg-slate-900/50 ${
        isOver && legalTarget
          ? 'border-blue-400 bg-blue-50/70 ring-2 ring-blue-400/40 dark:border-blue-500 dark:bg-blue-950/40'
          : isOver
            ? 'border-red-300 bg-red-50/60 dark:border-red-900/60 dark:bg-red-950/30'
            : dimmed
              ? 'border-slate-300 opacity-50 dark:border-slate-800'
              : 'border-slate-300 dark:border-slate-800'
      }`}
    >
      <div className="flex items-center justify-between px-3 pb-2 pt-3">
        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
          <span className={`h-2 w-2 rounded-full ${dot}`} />
          {label}
        </h3>
        <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-500 shadow-sm ring-1 ring-black/5 dark:bg-slate-800 dark:text-slate-300 dark:ring-white/10">
          {jobs.length}
        </span>
      </div>
      {/* Fixed-height slot so every column is the same size; the button only shows where adding is allowed */}
      <div className="mx-3 mb-2 h-8">
        {canAdd ? (
          <button
            onClick={onAdd}
            className="h-full w-full rounded-lg border border-dashed border-slate-300 text-xs font-medium text-slate-400 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:text-slate-500 dark:hover:border-blue-500 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
          >
            + Add
          </button>
        ) : null}
      </div>
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto overflow-x-hidden px-2 pb-2">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onEdit={onEdit}
            onArchive={onArchive}
            onDelete={onDelete}
            onAddRound={onAddRound}
          />
        ))}
      </div>
    </div>
  )
}
