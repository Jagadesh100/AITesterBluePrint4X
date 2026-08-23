import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core'
import { useMemo, useState } from 'react'
import Column from './Column'
import JobCard from './JobCard'
import { STATUSES, ALLOWED_TRANSITIONS } from '../utils/helpers'

export default function Board({ jobs, filter, onAddJob, onEditJob, onArchiveJob, onDeleteJob, onAddRound }) {
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
        // Cards whose status has no allowed transitions are locked — never start a drag.
        delay: 0,
      },
    })
  )

  const activeJob = jobs.find((j) => j.id === activeId)
  const activeAllowed = activeJob ? ALLOWED_TRANSITIONS[activeJob.status] || [] : []

  const visibleJobs = useMemo(() => {
    const q = (filter.query || '').trim().toLowerCase()
    const tagSet = new Set(filter.tags || [])
    return jobs.filter((job) => {
      if (job.archived) return false
      if (q) {
        const haystack = `${job.company} ${job.role}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      if (tagSet.size > 0) {
        const jobTags = job.tags || []
        if (!tagSet.has('__none__') && !jobTags.some((t) => tagSet.has(t))) return false
      }
      return true
    })
  }, [jobs, filter])

  const grouped = useMemo(() => {
    const map = {}
    for (const s of STATUSES) map[s.key] = []
    for (const job of visibleJobs) {
      if (!map[job.status]) map[job.status] = []
      map[job.status].push(job)
    }
    for (const s of STATUSES) {
      map[s.key].sort((a, b) => (b.dateApplied || '').localeCompare(a.dateApplied || ''))
    }
    return map
  }, [visibleJobs])

  function handleDragStart(event) {
    const job = jobs.find((j) => j.id === event.active.id)
    if (!job) return
    // Locked statuses (empty transition list) cannot be dragged at all.
    if (!(ALLOWED_TRANSITIONS[job.status] || []).length) {
      return
    }
    setActiveId(event.active.id)
  }

  function handleDragEnd(event) {
    setActiveId(null)
    const { active, over } = event
    if (!over) return
    const job = jobs.find((j) => j.id === active.id)
    if (!job) return
    const targetStatus = over.id
    // Only apply the move if the transition is explicitly allowed.
    if (targetStatus !== job.status && (ALLOWED_TRANSITIONS[job.status] || []).includes(targetStatus)) {
      onEditJob({ ...job, status: targetStatus })
    }
  }

  function handleDragCancel() {
    setActiveId(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-3 pb-4">
        {STATUSES.map((s) => (
          <Column
            key={s.key}
            status={s.key}
            label={s.label}
            jobs={grouped[s.key] || []}
            activeAllowed={activeAllowed}
            activeFrom={activeJob ? activeJob.status : null}
            onAdd={() => onAddJob(s.key)}
            onEdit={onEditJob}
            onArchive={onArchiveJob}
            onDelete={onDeleteJob}
            onAddRound={onAddRound}
          />
        ))}
      </div>
      <DragOverlay>
        {activeJob ? (
          <div className="opacity-90">
            <JobCard
              job={activeJob}
              onEdit={() => {}}
              onArchive={() => {}}
              onDelete={() => {}}
              onAddRound={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
