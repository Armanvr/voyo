import { useRef, useState } from 'preact/hooks'
import { Header } from '../components/Header'
import { MapView } from '../components/MapView'
import { StepList } from '../components/StepList'
import { useProgress } from '../hooks/useProgress'
import type { Trip } from '../types'

interface TripPageProps {
	trip: Trip
	tripId: string
	onBack: () => void
}

export function TripPage({ trip, tripId, onBack }: TripPageProps) {
	const [activeDayIdx, setActiveDayIdx] = useState(0)
	const [focusOrdre, setFocusOrdre] = useState<number | null>(null)
	const { isCompleted, toggleStep, isDayComplete } = useProgress(tripId)
	const scrollToRef = useRef<((ordre: number) => void) | null>(null)

	const activeDay = trip.jours[activeDayIdx]

	const checkableSteps = activeDay.etapes.filter((s) => s.type !== 'depart' && s.type !== 'retour')
	const checkableOrders = checkableSteps.map((s) => s.ordre)
	const completedOrders = checkableOrders.filter((o) => isCompleted(activeDayIdx, o))
	const activeOrdre = checkableOrders.find((o) => !isCompleted(activeDayIdx, o)) ?? null

	function handleMarkerClick(ordre: number) {
		scrollToRef.current?.(ordre)
	}

	function handleStepClick(ordre: number) {
		setFocusOrdre(ordre)
		// Reset after flyTo triggers so next click on same step still fires
		setTimeout(() => setFocusOrdre(null), 600)
	}

	function handleDayChange(idx: number) {
		setActiveDayIdx(idx)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	return (
		<div class='min-h-screen bg-paper'>
			<Header
				days={trip.jours}
				activeDayIdx={activeDayIdx}
				onDayChange={handleDayChange}
				isDayComplete={(idx) =>
					isDayComplete(
						idx,
						trip.jours[idx].etapes
							.filter((s) => s.type !== 'depart' && s.type !== 'retour')
							.map((s) => s.ordre),
					)
				}
				onBack={onBack}
				tripName={trip.sejour.destination}
			/>

			<div class='pt-14'>
				<MapView
					day={activeDay}
					completedOrders={completedOrders}
					onMarkerClick={handleMarkerClick}
					focusOrdre={focusOrdre}
				/>

				<StepList
					day={activeDay}
					dayIdx={activeDayIdx}
					isCompleted={isCompleted}
					onToggle={toggleStep}
					activeOrdre={activeOrdre}
					onScrollTo={(fn) => {
						scrollToRef.current = fn
					}}
					onStepClick={handleStepClick}
				/>
			</div>
		</div>
	)
}
