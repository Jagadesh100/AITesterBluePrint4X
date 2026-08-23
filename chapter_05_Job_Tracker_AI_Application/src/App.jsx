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
import { needsFollowUp, STATUSES } from './utils/helpers'

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
  const [modal, setModal] = useState(null) // { job, defaultStatus }
  const [confirmDelete, setConfirmDelete] = useState(null) // job awaiting confirm

  const followUpCount = useMemo(() => jobs.filter(needsFollowUp).length, [jobs])

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
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold">Job Application Tracker</h1>
            {followUpCount > 0 && (
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">
                {followUpCount} need follow-up
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <nav className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                    tab === t.key
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  {t.label}
                  {t.key === 'archive' && jobs.filter((j) => j.archived).length > 0 && (
                    <span className="ml-1 text-xs opacity-70">
                      {jobs.filter((j) => j.archived).length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-4">
        {tab === 'board' && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <SearchBar allJobs={jobs} filter={filter} onChange={setFilter} />
              <button
                onClick={() => setModal({ job: null, defaultStatus: 'wishlist' })}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                + Add job
              </button>
            </div>
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
        )}
        {tab === 'calendar' && (
          <CalendarView jobs={jobs} onOpenJob={(job) => setModal({ job, defaultStatus: job.status })} />
        )}
        {tab === 'analytics' && <AnalyticsView jobs={jobs} />}
        {tab === 'archive' && (
          <ArchiveView jobs={jobs} onRestore={restoreJob} onDelete={deleteJob} />
        )}
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
