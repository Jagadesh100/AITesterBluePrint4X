export const STATUSES = [
  { key: 'wishlist', label: 'Wishlist' },
  { key: 'applied', label: 'Applied' },
  { key: 'followup', label: 'Follow-up' },
  { key: 'interview', label: 'Interview' },
  { key: 'offer', label: 'Offer Accepted' },
  { key: 'offerRejected', label: 'Offer Declined' },
  { key: 'rejected', label: 'Rejected' },
]

export const STATUS_ACCENT = {
  wishlist: 'border-slate-300 bg-slate-50/60 dark:border-slate-600 dark:bg-slate-800/60',
  applied: 'border-blue-400 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/30',
  followup: 'border-amber-400 bg-amber-50/50 dark:border-amber-500 dark:bg-amber-950/30',
  interview: 'border-purple-400 bg-purple-50/50 dark:border-purple-500 dark:bg-purple-950/30',
  offer: 'border-emerald-500 bg-emerald-50/50 dark:border-emerald-500 dark:bg-emerald-950/30',
  offerRejected: 'border-orange-400 bg-orange-50/50 dark:border-orange-500 dark:bg-orange-950/30',
  rejected: 'border-red-600 bg-red-50 dark:border-red-600 dark:bg-red-950/40',
}

// Allowed drag-and-drop targets per status. Empty array = locked, card cannot move.
export const ALLOWED_TRANSITIONS = {
  wishlist: ['applied'],
  applied: ['followup', 'interview', 'rejected'],
  followup: ['interview', 'rejected'],
  interview: ['followup', 'offer', 'offerRejected', 'rejected'],
  offer: [],
  offerRejected: [],
  rejected: [],
}

export const TAG_PALETTE = [
  'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
  'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300',
  'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300',
  'bg-lime-100 text-lime-700 dark:bg-lime-900/50 dark:text-lime-300',
  'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
]

export function uuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function tagColor(tag) {
  let hash = 0
  for (let i = 0; i < tag.length; i += 1) {
    hash = (hash * 31 + tag.charCodeAt(i)) | 0
  }
  return TAG_PALETTE[Math.abs(hash) % TAG_PALETTE.length]
}

export function daysSince(dateStr) {
  if (!dateStr) return null
  const then = new Date(dateStr + 'T00:00:00')
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const diff = Math.round((now - then) / 86400000)
  return Number.isFinite(diff) ? diff : null
}

export function isOverdue(job) {
  if (job.followUpDate) {
    const d = new Date(job.followUpDate + 'T00:00:00')
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    return d < now
  }
  if (job.status === 'applied' && job.dateApplied) {
    const days = daysSince(job.dateApplied)
    return days !== null && days >= 7
  }
  return false
}

export function needsFollowUp(job) {
  return !job.archived && isOverdue(job)
}

export function duplicateMatch(jobs, company, role, excludeId) {
  const c = (company || '').trim().toLowerCase()
  const r = (role || '').trim().toLowerCase()
  if (!c || !r) return null
  return jobs.find(
    (j) => !j.archived && j.id !== excludeId && j.company.trim().toLowerCase() === c && j.role.trim().toLowerCase() === r
  )
}

export function isValidUrl(str) {
  if (!str) return true
  try {
    const url = new URL(str)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
