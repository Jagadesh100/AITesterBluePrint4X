import { openDB } from 'idb'

const DB_NAME = 'job-tracker'
const DB_VERSION = 1
const STORE = 'jobs'

let dbPromise

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: 'id' })
        }
      },
    })
  }
  return dbPromise
}

export async function getAllJobs() {
  const db = await getDB()
  return (await db.getAll(STORE)) || []
}

export async function addJob(job) {
  const db = await getDB()
  await db.put(STORE, job)
  return job
}

export async function updateJob(job) {
  const db = await getDB()
  await db.put(STORE, job)
  return job
}

export async function deleteJob(id) {
  const db = await getDB()
  await db.delete(STORE, id)
}

export async function clearAllJobs() {
  const db = await getDB()
  const tx = db.transaction(STORE, 'readwrite')
  await tx.objectStore(STORE).clear()
  await tx.done
}
