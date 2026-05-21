import { useEffect, useState } from 'preact/hooks'
import londonTrip from '../data/londres_planning_v2.json'
import type { TripDoc } from '../db'
import { findAllTrips, removeTrip } from '../db'
import type { Trip } from '../types'

interface VoyagesPageProps {
	onOpenTrip: (doc: TripDoc) => void
}

interface ListedTripDoc extends TripDoc {
	isShared?: boolean
}

const SHARED_TRIPS: ListedTripDoc[] = [
	{
		_id: 'shared-london',
		name: 'Londres',
		trip: londonTrip as Trip,
		createdAt: '2026-05-27T00:00:00.000Z',
		isShared: true,
	},
]

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
	const listedTrips: ListedTripDoc[] = [...SHARED_TRIPS, ...trips]

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

			{listedTrips.length === 0 && (
				<div class='px-4 py-12 text-center'>
					<p class='text-sand text-sm'>Aucun voyage. Créez le premier.</p>
				</div>
			)}

			<ul class='divide-y divide-ink/8'>
				{listedTrips.map((doc) => (
					<li key={doc._id} class='group'>
						{/* Card — clickable zone clearly separated */}
						<button
							type='button'
							onClick={() => onOpenTrip(doc)}
							class='w-full flex items-center gap-4 px-4 py-5 text-left transition-colors hover:bg-primary/5 active:bg-primary/10 cursor-pointer'
						>
							{/* Destination icon */}
							<div class='flex-shrink-0 w-10 h-10 bg-ink flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-ink transition-colors'>
								<svg
									viewBox='0 0 16 16'
									fill='none'
									stroke='currentColor'
									stroke-width='1.5'
									stroke-linecap='round'
									stroke-linejoin='round'
									class='w-4 h-4'
									aria-hidden='true'
								>
									<path d='M8 14s-5-4.2-5-7a5 5 0 1 1 10 0c0 2.8-5 7-5 7z' />
									<circle cx='8' cy='7' r='1.5' fill='currentColor' stroke='none' />
								</svg>
							</div>

							{/* Info */}
							<div class='flex-1 min-w-0'>
								<p class='font-black text-ink text-base leading-snug group-hover:text-primary transition-colors'>
									{doc.name}
								</p>
								<p class='text-xs text-sand mt-0.5'>
									{doc.trip.jours.length} jour{doc.trip.jours.length > 1 ? 's' : ''}
									{doc.trip.sejour.dates.arrivee ? ` · ${doc.trip.sejour.dates.arrivee}` : ''}
									{doc.isShared ? ' · Partagé' : ''}
								</p>
							</div>

							{/* Chevron — clear tap affordance */}
							<svg
								viewBox='0 0 16 16'
								fill='none'
								stroke='currentColor'
								stroke-width='2'
								stroke-linecap='round'
								stroke-linejoin='round'
								class='flex-shrink-0 w-4 h-4 text-sand/40 group-hover:text-primary transition-colors'
								aria-hidden='true'
							>
								<path d='M6 4l4 4-4 4' />
							</svg>
						</button>

						{/* Actions — visually distinct from card */}
						<div class='flex gap-2 px-4 pb-4 border-t border-ink/5'>
							<button
								type='button'
								onClick={(e) => {
									e.stopPropagation()
									exportTrip(doc)
								}}
								class='flex items-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-sand hover:text-primary hover:bg-primary/5 transition-colors'
								aria-label={`Exporter ${doc.name}`}
							>
								<svg
									viewBox='0 0 16 16'
									fill='none'
									stroke='currentColor'
									stroke-width='1.5'
									stroke-linecap='round'
									stroke-linejoin='round'
									class='w-3 h-3'
									aria-hidden='true'
								>
									<path d='M8 2v8M5 7l3 3 3-3M2 12v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1' />
								</svg>
								Exporter
							</button>

							{!doc.isShared && (
								<button
									type='button'
									onClick={(e) => {
										e.stopPropagation()
										handleDelete(doc)
									}}
									disabled={deletingId === doc._id}
									class='flex items-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-sand hover:text-red-400 hover:bg-red-400/5 transition-colors disabled:opacity-40'
									aria-label={`Supprimer ${doc.name}`}
								>
									<svg
										viewBox='0 0 16 16'
										fill='none'
										stroke='currentColor'
										stroke-width='1.5'
										stroke-linecap='round'
										stroke-linejoin='round'
										class='w-3 h-3'
										aria-hidden='true'
									>
										<path d='M3 4h10M6 4V2h4v2M5 4v9a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V4' />
									</svg>
									{deletingId === doc._id ? '…' : 'Supprimer'}
								</button>
							)}
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}
