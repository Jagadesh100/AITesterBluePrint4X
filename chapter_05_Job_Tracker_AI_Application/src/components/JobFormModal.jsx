import { useEffect, useMemo, useState } from 'react'
import TagChip from './TagChip'
import { STATUSES, uuid, todayISO, duplicateMatch, isValidUrl } from '../utils/helpers'

function Section({ title, children }) {
  return (
    <div className="border-b border-slate-200 pb-4 dark:border-slate-700">
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {title}
      </h4>
      {children}
    </div>
  )
}

function Field({ label, required, error, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  )
}

const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'

export default function JobFormModal({ job, defaultStatus, allJobs, onSave, onClose }) {
  const isEdit = Boolean(job)

  const [form, setForm] = useState(() => {
    if (job) return { ...job }
    return {
      id: uuid(),
      company: '',
      role: '',
      linkedinUrl: '',
      resume: '',
      coverLetter: '',
      dateApplied: todayISO(),
      salaryRange: '',
      notes: '',
      status: defaultStatus || 'wishlist',
      archived: false,
      followUpDate: '',
      tags: [],
      contact: { name: '', email: '', linkedinUrl: '' },
      jobDescription: '',
      interviewRounds: [],
    }
  })

  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState({})
  const [duplicate, setDuplicate] = useState(null)
  const [confirmDuplicate, setConfirmDuplicate] = useState(false)

  const resumeOptions = useMemo(() => {
    const set = new Set()
    for (const j of allJobs) {
      if (j.resume) set.add(j.resume)
    }
    return [...set].sort()
  }, [allJobs])

  const coverLetterOptions = useMemo(() => {
    const set = new Set()
    for (const j of allJobs) {
      if (j.coverLetter) set.add(j.coverLetter)
    }
    return [...set].sort()
  }, [allJobs])

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  function addTag() {
    const tag = tagInput.trim()
    if (tag && !form.tags.includes(tag)) {
      set({ tags: [...form.tags, tag] })
    }
    setTagInput('')
  }

  function addRound() {
    set({
      interviewRounds: [
        ...(form.interviewRounds || []),
        { id: uuid(), stage: '', date: '', notes: '', done: false },
      ],
    })
  }

  function updateRound(id, patch) {
    set({
      interviewRounds: (form.interviewRounds || []).map((r) =>
        r.id === id ? { ...r, ...patch } : r
      ),
    })
  }

  function removeRound(id) {
    set({ interviewRounds: (form.interviewRounds || []).filter((r) => r.id !== id) })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!form.company.trim()) errs.company = 'Company is required'
    if (!form.role.trim()) errs.role = 'Role is required'
    if (form.linkedinUrl && !isValidUrl(form.linkedinUrl)) errs.linkedinUrl = 'Enter a valid http(s) URL'
    if (form.contact?.linkedinUrl && !isValidUrl(form.contact.linkedinUrl)) {
      errs.contactLinkedin = 'Enter a valid http(s) URL'
    }
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    const match = duplicateMatch(allJobs, form.company, form.role, form.id)
    if (match && !confirmDuplicate) {
      setDuplicate(match)
      return
    }
    onSave(form)
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="mt-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {isEdit ? 'Edit application' : 'Add application'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {duplicate && !confirmDuplicate && (
          <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
            You already have an application for <strong>{duplicate.company}</strong> —{' '}
            <strong>{duplicate.role}</strong> ({duplicate.status}). Add anyway?
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmDuplicate(true)}
                className="rounded-lg bg-amber-600 px-3 py-1 text-xs font-medium text-white hover:bg-amber-700"
              >
                Add anyway
              </button>
              <button
                type="button"
                onClick={() => setDuplicate(null)}
                className="rounded-lg border border-amber-400 px-3 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100 dark:text-amber-200 dark:hover:bg-amber-900/40"
              >
                Go back
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Section title="Core info">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Company" required error={errors.company}>
                <input className={inputCls} value={form.company} onChange={(e) => set({ company: e.target.value })} placeholder="Acme Corp" />
              </Field>
              <Field label="Role" required error={errors.role}>
                <input className={inputCls} value={form.role} onChange={(e) => set({ role: e.target.value })} placeholder="QA Engineer" />
              </Field>
              <Field label="LinkedIn posting URL" error={errors.linkedinUrl}>
                <input className={inputCls} value={form.linkedinUrl || ''} onChange={(e) => set({ linkedinUrl: e.target.value })} placeholder="https://linkedin.com/jobs/…" />
              </Field>
              <Field label="Salary range">
                <input className={inputCls} value={form.salaryRange || ''} onChange={(e) => set({ salaryRange: e.target.value })} placeholder="₹25-30 LPA" />
              </Field>
              <Field label="Date applied">
                <input type="date" className={inputCls} value={form.dateApplied || ''} onChange={(e) => set({ dateApplied: e.target.value })} />
              </Field>
              <Field label="Follow-up date">
                <input type="date" className={inputCls} value={form.followUpDate || ''} onChange={(e) => set({ followUpDate: e.target.value })} />
              </Field>
              <Field label="Status">
                <select className={inputCls} value={form.status} onChange={(e) => set({ status: e.target.value })}>
                  {STATUSES.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </Section>

          <Section title="Documents">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Resume">
                <input
                  className={inputCls}
                  value={form.resume || ''}
                  onChange={(e) => set({ resume: e.target.value })}
                  placeholder="QA_Resume_2026.pdf"
                  list="resume-options"
                />
                <datalist id="resume-options">
                  {resumeOptions.map((r) => (
                    <option key={r} value={r} />
                  ))}
                </datalist>
              </Field>
              <Field label="Cover letter">
                <input
                  className={inputCls}
                  value={form.coverLetter || ''}
                  onChange={(e) => set({ coverLetter: e.target.value })}
                  placeholder="Cover_Letter_Infosys.pdf"
                  list="cl-options"
                />
                <datalist id="cl-options">
                  {coverLetterOptions.map((r) => (
                    <option key={r} value={r} />
                  ))}
                </datalist>
              </Field>
            </div>
          </Section>

          <Section title="Tags">
            <div className="flex flex-wrap items-center gap-1.5">
              {form.tags.map((tag) => (
                <TagChip key={tag} tag={tag} onRemove={() => set({ tags: form.tags.filter((t) => t !== tag) })} />
              ))}
              <input
                className={`${inputCls} w-40`}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault()
                    addTag()
                  }
                }}
                placeholder="Type + Enter"
              />
            </div>
          </Section>

          <Section title="Contact / recruiter">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Field label="Name">
                <input className={inputCls} value={form.contact?.name || ''} onChange={(e) => set({ contact: { ...form.contact, name: e.target.value } })} />
              </Field>
              <Field label="Email">
                <input className={inputCls} value={form.contact?.email || ''} onChange={(e) => set({ contact: { ...form.contact, email: e.target.value } })} />
              </Field>
              <Field label="LinkedIn profile" error={errors.contactLinkedin}>
                <input className={inputCls} value={form.contact?.linkedinUrl || ''} onChange={(e) => set({ contact: { ...form.contact, linkedinUrl: e.target.value } })} placeholder="https://linkedin.com/in/…" />
              </Field>
            </div>
          </Section>

          <Section title="Interview rounds">
            <div className="space-y-2">
              {(form.interviewRounds || []).map((round) => (
                <div key={round.id} className="grid grid-cols-1 gap-2 rounded-lg border border-slate-200 p-3 sm:grid-cols-[1fr_auto_1.5fr_auto] dark:border-slate-700">
                  <input
                    className={inputCls}
                    value={round.stage}
                    onChange={(e) => updateRound(round.id, { stage: e.target.value })}
                    placeholder="Stage (e.g. Phone Screen)"
                  />
                  <input
                    type="date"
                    className={inputCls}
                    value={round.date || ''}
                    onChange={(e) => updateRound(round.id, { date: e.target.value })}
                  />
                  <input
                    className={inputCls}
                    value={round.notes || ''}
                    onChange={(e) => updateRound(round.id, { notes: e.target.value })}
                    placeholder="Notes"
                  />
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <input
                        type="checkbox"
                        checked={Boolean(round.done)}
                        onChange={(e) => updateRound(round.id, { done: e.target.checked })}
                      />
                      Done
                    </label>
                    <button
                      type="button"
                      onClick={() => removeRound(round.id)}
                      className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                      aria-label="Remove round"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addRound}
                className="rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-xs text-slate-500 hover:border-slate-400 hover:text-slate-700 dark:border-slate-600 dark:hover:text-slate-300"
              >
                + Add round
              </button>
            </div>
          </Section>

          <Section title="Job description snapshot & notes">
            <Field label="Job description (pasted)">
              <textarea
                className={`${inputCls} h-20 resize-y`}
                value={form.jobDescription || ''}
                onChange={(e) => set({ jobDescription: e.target.value })}
                placeholder="Paste the raw JD — postings often get taken down"
              />
            </Field>
            <div className="mt-3">
              <Field label="Notes">
                <textarea
                  className={`${inputCls} h-20 resize-y`}
                  value={form.notes || ''}
                  onChange={(e) => set({ notes: e.target.value })}
                  placeholder="Anything not covered above"
                />
              </Field>
            </div>
          </Section>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {isEdit ? 'Save changes' : 'Add application'}
          </button>
        </div>
      </form>
    </div>
  )
}
