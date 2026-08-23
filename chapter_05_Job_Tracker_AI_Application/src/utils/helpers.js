export const STATUSES = [
  { key: 'wishlist', label: 'Wishlist' },
  { key: 'applied', label: 'Applied' },
  { key: 'followup', label: 'Follow-up' },
  { key: 'interview', label: 'Interview' },
  { key: 'offer', label: 'Offer' },
  { key: 'rejected', label: 'Rejected' },
]

export const STATUS_ACCENT = {
  wishlist: 'border-slate-300',
  applied: 'border-blue-400',
  followup: 'border-amber-400',
  interview: 'border-purple-400',
  offer: 'border-green-500',
  rejected: 'border-red-400',
}

export const TAG_PALETTE = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-purple-100 text-purple-700',
  'bg-pink-100 text-pink-700',
  'bg-cyan-100 text-cyan-700',
  'bg-lime-100 text-lime-700',
  'bg-orange-100 text-orange-700',
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
