import { useState } from 'preact/hooks'

type Progress = Record<string, number[]>

function storageKey(ns: string) {
	return `voyo_progress_${ns}`
}

function load(ns: string): Progress {
	try {
		const raw = localStorage.getItem(storageKey(ns))
		return raw ? JSON.parse(raw) : {}
	} catch {
		return {}
	}
}

function persist(ns: string, progress: Progress): void {
	localStorage.setItem(storageKey(ns), JSON.stringify(progress))
}

export function useProgress(tripId = 'default') {
	const [progress, setProgress] = useState<Progress>(() => load(tripId))

	function isCompleted(dayIdx: number, ordre: number): boolean {
		return progress[String(dayIdx)]?.includes(ordre) ?? false
	}

	function toggleStep(dayIdx: number, ordre: number): void {
		setProgress((prev) => {
			const key = String(dayIdx)
			const current = prev[key] ?? []
			const next = current.includes(ordre) ? current.filter((o) => o !== ordre) : [...current, ordre]
			const updated = { ...prev, [key]: next }
			persist(tripId, updated)
			return updated
		})
	}

	function isDayComplete(dayIdx: number, allOrders: number[]): boolean {
		const done = progress[String(dayIdx)] ?? []
		return allOrders.length > 0 && allOrders.every((o) => done.includes(o))
	}

	return { isCompleted, toggleStep, isDayComplete }
}
