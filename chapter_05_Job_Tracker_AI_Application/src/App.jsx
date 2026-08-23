import { useMemo, useState } from 'react'
import { useJobs } from './hooks/useJobs'
import Board from './components/Board'
import SearchBar from './components/SearchBar'
import JobFormModal from './components/JobFormModal'
import ThemeToggle from './components/ThemeToggle'
import ArchiveView from './components/ArchiveView'
import AnalyticsView from './components/AnalyticsView'
import CalendarView from './components/CalendarView'
import ImportExport from './components/ImportExport'
import { needsFollowUp } from './utils/helpers'

const TABS = [
  { key: 'board', label: 'Board' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'archive', label: 'Archive' },
  { key: 'data', label: 'Import/Export' },
]

export default function App() {
  const { jobs, loading, addJob, updateJob, deleteJob, archiveJob, restoreJob, importJobs } = useJobs()

  const [tab, setTab] = useState('board')
  const [filter, setFilter] = useState({ query: '', tags: [] })
  const [modal, setModal] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const followUpCount = useMemo(() => jobs.filter(needsFollowUp).length, [jobs])
  const archivedCount = useMemo(() => jobs.filter((j) => j.archived).length, [jobs])

  function handleSave(jobData) {
    const existing = jobs.find((j) => j.id === jobData.id)
    if (existing) {
      updateJob(jobData)
    } else {
      addJob(jobData)
    }
    setModal(null)
  }

  function handleDeleteConfirmed() {
    if (confirmDelete) {
      deleteJob(confirmDelete.id)
      setConfirmDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading…</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Job Application Tracker
              </h1>
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Local-first Kanban
              </p>
            </div>
            {followUpCount > 0 && (
              <span className="flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 ring-1 ring-red-200 dark:bg-red-950/50 dark:text-red-300 dark:ring-red-900">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                {followUpCount} need follow-up
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <nav className="flex gap-1 rounded-xl bg-slate-100 p-1 shadow-inner dark:bg-slate-800/70">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    tab === t.key
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5 dark:bg-slate-700 dark:text-white dark:ring-white/10'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  {t.label}
                  {t.key === 'archive' && archivedCount > 0 && (
                    <span className="ml-1 rounded-full bg-slate-200 px-1.5 text-[10px] font-bold text-slate-600 dark:bg-slate-600 dark:text-slate-200">
                      {archivedCount}
                    </span>
                  )}
                </button>
              ))}
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-4">
        {tab === 'board' && (
          <div className="flex h-full flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <SearchBar allJobs={jobs} filter={filter} onChange={setFilter} />
              <button
                onClick={() => setModal({ job: null, defaultStatus: 'wishlist' })}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition hover:from-blue-700 hover:to-indigo-700 active:scale-95"
              >
                + Add job
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <Board
                jobs={jobs}
                filter={filter}
                onAddJob={(status) => setModal({ job: null, defaultStatus: status })}
                onEditJob={(job) => setModal({ job, defaultStatus: job.status })}
                onArchiveJob={archiveJob}
                onDeleteJob={(job) => setConfirmDelete(job)}
                onAddRound={(job) => setModal({ job: { ...job, status: job.status }, defaultStatus: job.status })}
              />
            </div>
          </div>
        )}
        {tab === 'calendar' && (
          <CalendarView jobs={jobs} onOpenJob={(job) => setModal({ job, defaultStatus: job.status })} />
        )}
        {tab === 'analytics' && <AnalyticsView jobs={jobs} />}
        {tab === 'archive' && <ArchiveView jobs={jobs} onRestore={restoreJob} onDelete={deleteJob} />}
        {tab === 'data' && <ImportExport jobs={jobs} onImport={importJobs} />}
      </main>

      {modal && (
        <JobFormModal
          job={modal.job}
          defaultStatus={modal.defaultStatus}
          allJobs={jobs}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Delete application?
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              <strong>{confirmDelete.company}</strong> — {confirmDelete.role}. This permanently
              removes the record. Consider archiving instead if you might need it again.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
