import { useMemo } from 'react'
import { daysSince } from '../utils/helpers'

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-slate-800 dark:ring-white/10">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
    </div>
  )
}

export default function AnalyticsView({ jobs }) {
  const stats = useMemo(() => {
    const active = jobs.filter((j) => !j.archived)
    const all = jobs

    const now = new Date()
    const weekAgo = new Date(now)
    weekAgo.setDate(weekAgo.getDate() - 7)
    const monthAgo = new Date(now)
    monthAgo.setDate(monthAgo.getDate() - 30)

    const inRange = (dateStr, start) => {
      if (!dateStr) return false
      const d = new Date(dateStr + 'T00:00:00')
      return d >= start && d <= now
    }

    const appliedThisWeek = all.filter((j) => inRange(j.dateApplied, weekAgo)).length
    const appliedThisMonth = all.filter((j) => inRange(j.dateApplied, monthAgo)).length

    const appliedCount = all.filter((j) => ['applied', 'followup', 'interview', 'offer'].includes(j.status)).length
    const reachedInterviewOrOffer = all.filter((j) => ['interview', 'offer'].includes(j.status)).length
    const rejectedCount = all.filter((j) => j.status === 'rejected').length
    const activeCount = active.length

    const responseRate = appliedCount > 0 ? Math.round((reachedInterviewOrOffer / appliedCount) * 100) : 0
    const rejectionRate = appliedCount > 0 ? Math.round((rejectedCount / appliedCount) * 100) : 0

    // Approximate avg days from dateApplied to current status (no status-change history tracked)
    const progressed = all.filter((j) => j.dateApplied && ['interview', 'offer', 'rejected'].includes(j.status))
    const avgDays =
      progressed.length > 0
        ? Math.round(progressed.reduce((sum, j) => sum + (daysSince(j.dateApplied) || 0), 0) / progressed.length)
        : null

    const byStatus = {}
    for (const job of active) {
      byStatus[job.status] = (byStatus[job.status] || 0) + 1
    }

    return {
      appliedThisWeek,
      appliedThisMonth,
      responseRate,
      rejectionRate,
      avgDays,
      activeCount,
      rejectedCount,
      byStatus,
    }
  }, [jobs])

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Analytics</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Active applications" value={stats.activeCount} />
        <StatCard label="Applied this week" value={stats.appliedThisWeek} />
        <StatCard label="Applied this month" value={stats.appliedThisMonth} />
        <StatCard label="Response rate" value={`${stats.responseRate}%`} sub="reached interview/offer" />
        <StatCard label="Rejection rate" value={`${stats.rejectionRate}%`} />
        <StatCard
          label="Avg days to outcome"
          value={stats.avgDays === null ? '—' : `${stats.avgDays}d`}
          sub="interview / offer / rejected"
        />
        <StatCard label="Rejections" value={stats.rejectedCount} />
      </div>
      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-slate-800 dark:ring-white/10">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Active by status
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(stats.byStatus).map(([status, count]) => (
            <span
              key={status}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200"
            >
              {status}: {count}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
