import { useEffect, useState, useCallback } from 'react'
import * as db from '../db/db'

export function useJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    db.getAllJobs().then((data) => {
      if (!cancelled) {
        setJobs(data)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const addJob = useCallback(async (job) => {
    await db.addJob(job)
    setJobs((prev) => [...prev, job])
  }, [])

  const updateJob = useCallback(async (job) => {
    await db.updateJob(job)
    setJobs((prev) => prev.map((j) => (j.id === job.id ? job : j)))
  }, [])

  const deleteJob = useCallback(async (id) => {
    await db.deleteJob(id)
    setJobs((prev) => prev.filter((j) => j.id !== id))
  }, [])

  const archiveJob = useCallback(async (job) => {
    await db.updateJob({ ...job, archived: true })
    setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, archived: true } : j)))
  }, [])

  const restoreJob = useCallback(async (job) => {
    await db.updateJob({ ...job, archived: false })
    setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, archived: false } : j)))
  }, [])

  const importJobs = useCallback(async (records) => {
    for (const job of records) {
      await db.addJob(job)
    }
    setJobs(await db.getAllJobs())
  }, [])

  return { jobs, loading, addJob, updateJob, deleteJob, archiveJob, restoreJob, importJobs }
}
