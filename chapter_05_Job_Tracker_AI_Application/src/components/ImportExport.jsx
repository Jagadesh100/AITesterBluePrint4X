import { useRef, useState } from 'react'
import { isValidUrl } from '../utils/helpers'

export default function ImportExport({ jobs, onImport }) {
  const fileRef = useRef(null)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  function exportJson() {
    const blob = new Blob([JSON.stringify(jobs, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `job-tracker-export-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  async function handleFile(file) {
    setMessage(null)
    setError(null)
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      const list = Array.isArray(data) ? data : data.jobs
      if (!Array.isArray(list)) {
        setError('File does not look like a job tracker export (expected an array of records).')
        return
      }
      const valid = []
      const skipped = []
      for (const rec of list) {
        if (rec && typeof rec.company === 'string' && rec.company.trim() && typeof rec.role === 'string' && rec.role.trim()) {
          const job = { ...rec }
          if (!job.id) job.id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now())
          if (!job.dateApplied) job.dateApplied = new Date().toISOString().slice(0, 10)
          if (job.status === undefined) job.status = 'wishlist'
          if (job.archived === undefined) job.archived = false
          if (!job.tags) job.tags = []
          if (!job.interviewRounds) job.interviewRounds = []
          if (job.linkedinUrl && !isValidUrl(job.linkedinUrl)) {
            skipped.push(`${job.company} — ${job.role} (bad linkedinUrl)`)
            continue
          }
          valid.push(job)
        } else {
          skipped.push(`"${rec?.company || '?'}" — ${rec?.role || '?'}`)
        }
      }
      if (valid.length === 0) {
        setError('No valid job records found in the file.')
        return
      }
      await onImport(valid)
      setMessage(
        `Imported ${valid.length} record${valid.length === 1 ? '' : 's'}${
          skipped.length ? `, skipped ${skipped.length} malformed` : ''
        }.`
      )
      if (fileRef.current) fileRef.current.value = ''
    } catch {
      setError('Could not parse the file — is it valid JSON?')
    }
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Import / Export</h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={exportJson}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Export JSON
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          Import JSON
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
          }}
        />
      </div>
      {message && <p className="text-sm text-green-600 dark:text-green-400">{message}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
