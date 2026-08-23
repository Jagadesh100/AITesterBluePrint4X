import { useDroppable } from '@dnd-kit/core'
import JobCard from './JobCard'

export default function Column({ status, label, jobs, onAdd, onEdit, onArchive, onDelete, onAddRound }) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      className={`flex h-full min-w-0 flex-1 flex-col rounded-xl bg-slate-100 dark:bg-slate-900/60 ${isOver ? 'ring-2 ring-blue-400' : ''}`}
    >
      <div className="flex items-center justify-between px-3 py-2.5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          {label}
        </h3>
        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {jobs.length}
        </span>
      </div>
      <button
        onClick={onAdd}
        className="mx-3 mb-2 rounded-lg border border-dashed border-slate-300 py-1.5 text-xs text-slate-400 hover:border-slate-400 hover:text-slate-600 dark:border-slate-700 dark:hover:border-slate-500"
      >
        + Add
      </button>
      <div className="flex-1 space-y-2 overflow-y-auto px-2 pb-2">
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
