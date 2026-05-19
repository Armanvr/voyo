import { useEffect, useState } from 'preact/hooks'
import type { TripDoc } from '../db'
import { findAllTrips, removeTrip } from '../db'

interface VoyagesPageProps {
	onOpenTrip: (doc: TripDoc) => void
}

function exportTrip(doc: TripDoc) {
	const json = JSON.stringify(doc.trip, null, 2)
	const blob = new Blob([json], { type: 'application/json' })
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = `voyo_${doc.name.toLowerCase().replace(/\s+/g, '_')}.json`
	a.click()
	URL.revokeObjectURL(url)
}

export function VoyagesPage({ onOpenTrip }: VoyagesPageProps) {
	const [trips, setTrips] = useState<TripDoc[]>([])
	const [loading, setLoading] = useState(true)
	const [deletingId, setDeletingId] = useState<string | null>(null)

	async function load() {
		setLoading(true)
		const docs = await findAllTrips()
		setTrips(docs)
		setLoading(false)
	}

	useEffect(() => {
		load()
	}, [])

	async function handleDelete(doc: TripDoc) {
		if (!doc._id) return
		if (!window.confirm(`Supprimer « ${doc.name} » ?`)) return
		setDeletingId(doc._id)
		await removeTrip(doc._id)
		await load()
		setDeletingId(null)
	}

	if (loading) {
		return (
			<div class='flex items-center justify-center h-48'>
				<p class='text-xs text-sand uppercase tracking-widest'>Chargement…</p>
			</div>
		)
	}

	return (
		<div class='pb-20'>
			<div class='px-4 pt-8 pb-4'>
				<p class='text-[10px] font-bold text-sand uppercase tracking-widest mb-1'>Voyo</p>
				<h1 class='text-3xl font-black text-ink'>Mes voyages</h1>
			</div>

			{trips.length === 0 && (
				<div class='px-4 py-12 text-center'>
					<p class='text-sand text-sm'>Aucun voyage. Créez le premier.</p>
				</div>
			)}

			<ul class='divide-y divide-ink/8'>
				{trips.map((doc) => (
					<li key={doc._id} class='flex items-center gap-3 px-4 py-4'>
						<button type='button' onClick={() => onOpenTrip(doc)} class='flex-1 min-w-0 text-left'>
							<p class='font-black text-ink text-base leading-snug'>{doc.name}</p>
							<p class='text-xs text-sand mt-0.5'>
								{doc.trip.jours.length} jour{doc.trip.jours.length > 1 ? 's' : ''}
								{doc.trip.sejour.dates.arrivee ? ` · ${doc.trip.sejour.dates.arrivee}` : ''}
								{doc.isDemo ? ' · Demo' : ''}
							</p>
						</button>

						<button
							type='button'
							onClick={() => exportTrip(doc)}
							class='flex-shrink-0 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border border-ink/20 text-sand hover:border-primary hover:text-primary transition-colors'
							aria-label={`Exporter ${doc.name}`}
						>
							Export
						</button>

						{!doc.isDemo && (
							<button
								type='button'
								onClick={() => handleDelete(doc)}
								disabled={deletingId === doc._id}
								class='flex-shrink-0 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border border-ink/20 text-sand hover:border-red-400 hover:text-red-400 transition-colors disabled:opacity-40'
								aria-label={`Supprimer ${doc.name}`}
							>
								{deletingId === doc._id ? '…' : 'Suppr.'}
							</button>
						)}
					</li>
				))}
			</ul>
		</div>
	)
}
