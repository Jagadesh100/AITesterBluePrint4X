import { useMemo, useState } from 'react'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function CalendarView({ jobs, onOpenJob }) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const events = useMemo(() => {
    const map = {}
    for (const job of jobs) {
      if (job.archived) continue
      if (job.followUpDate) {
        const key = job.followUpDate
        map[key] = map[key] || []
        map[key].push({ job, kind: 'Follow-up' })
      }
      for (const round of job.interviewRounds || []) {
        if (round.date) {
          const key = round.date
          map[key] = map[key] || []
          map[key].push({ job, kind: round.stage || 'Interview' })
        }
      }
    }
    return map
  }, [jobs])

  const cells = useMemo(() => {
    const first = new Date(year, month, 1)
    const startPad = first.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cellsArr = []
    for (let i = 0; i < startPad; i += 1) cellsArr.push(null)
    for (let d = 1; d <= daysInMonth; d += 1) {
      cellsArr.push(new Date(year, month, d))
    }
    return cellsArr
  }, [year, month])

  const iso = (d) => {
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${d.getFullYear()}-${m}-${day}`
  }

  function prev() {
    if (month === 0) {
      setMonth(11)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }

  function next() {
    if (month === 11) {
      setMonth(0)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Calendar</h2>
        <div className="flex items-center gap-2">
          <button onClick={prev} className="rounded-lg border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:text-slate-300">
            ←
          </button>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {MONTHS[month]} {year}
          </span>
          <button onClick={next} className="rounded-lg border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:text-slate-300">
            →
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((d) => (
          <div key={d} className="py-1 text-center text-[11px] font-medium uppercase text-slate-400">
            {d}
          </div>
        ))}
        {cells.map((date, idx) => {
          if (!date) return <div key={`pad-${idx}`} />
          const key = iso(date)
          const dayEvents = events[key] || []
          const isToday = key === iso(now)
          return (
            <div
              key={key}
              className={`min-h-16 rounded-lg border p-1 ${
                isToday ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{date.getDate()}</p>
              <div className="mt-0.5 space-y-0.5">
                {dayEvents.map((ev, i) => (
                  <button
                    key={i}
                    onClick={() => onOpenJob(ev.job)}
                    className="block w-full truncate rounded bg-slate-100 px-1 text-left text-[10px] text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                    title={`${ev.job.company} — ${ev.kind}`}
                  >
                    {ev.kind === 'Follow-up' ? '↗ ' : '● '}
                    {ev.job.company}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
