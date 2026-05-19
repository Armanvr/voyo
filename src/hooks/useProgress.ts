import { useState } from 'preact/hooks'

type Progress = Record<string, number[]>

const STORAGE_KEY = 'voyo_progress'

function load(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function persist(progress: Progress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(load)

  function isCompleted(dayIdx: number, ordre: number): boolean {
    return progress[String(dayIdx)]?.includes(ordre) ?? false
  }

  function toggleStep(dayIdx: number, ordre: number): void {
    setProgress(prev => {
      const key = String(dayIdx)
      const current = prev[key] ?? []
      const next = current.includes(ordre)
        ? current.filter(o => o !== ordre)
        : [...current, ordre]
      const updated = { ...prev, [key]: next }
      persist(updated)
      return updated
    })
  }

  function isDayComplete(dayIdx: number, allOrders: number[]): boolean {
    const done = progress[String(dayIdx)] ?? []
    return allOrders.length > 0 && allOrders.every(o => done.includes(o))
  }

  return { isCompleted, toggleStep, isDayComplete }
}
