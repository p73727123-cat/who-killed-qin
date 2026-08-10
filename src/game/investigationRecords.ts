import type { InvestigationRecord } from '../types/game'

const RECORDS_KEY = 'who-killed-qin-de-can:investigation-records'

export function getInvestigationRecords(): InvestigationRecord[] {
  const storedRecords = localStorage.getItem(RECORDS_KEY)

  if (!storedRecords) {
    return []
  }

  try {
    const parsedRecords = JSON.parse(storedRecords)
    return Array.isArray(parsedRecords)
      ? parsedRecords.filter(isInvestigationRecord)
      : []
  } catch {
    return []
  }
}

export function saveInvestigationRecord(record: InvestigationRecord) {
  const records = [...getInvestigationRecords(), record]
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records))
  return record
}

export function getLatestInvestigationRecord(studentId: string | null, ending: string | null) {
  if (!studentId || !ending) {
    return null
  }

  return [...getInvestigationRecords()]
    .reverse()
    .find((record) => record.studentId === studentId && record.ending === ending) ?? null
}

function isInvestigationRecord(value: unknown): value is InvestigationRecord {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const record = value as Record<string, unknown>
  return (
    typeof record.studentId === 'string' &&
    typeof record.ending === 'string' &&
    typeof record.suspect === 'string' &&
    Array.isArray(record.causes) &&
    record.causes.every((cause) => typeof cause === 'string') &&
    typeof record.symbolism === 'string' &&
    typeof record.completedAt === 'string'
  )
}
