import { useState, useRef } from 'preact/hooks'
import { londonTrip } from '../data/london'
import { useProgress } from '../hooks/useProgress'
import { Header } from '../components/Header'
import { MapView } from '../components/MapView'
import { StepList } from '../components/StepList'

export function TripPage() {
  const trip = londonTrip
  const [activeDayIdx, setActiveDayIdx] = useState(0)
  const { isCompleted, toggleStep, isDayComplete } = useProgress()
  const scrollToRef = useRef<((ordre: number) => void) | null>(null)

  const activeDay = trip.jours[activeDayIdx]

  const checkableSteps = activeDay.etapes.filter(
    s => s.type !== 'depart' && s.type !== 'retour'
  )
  const checkableOrders = checkableSteps.map(s => s.ordre)
  const completedOrders = checkableOrders.filter(o => isCompleted(activeDayIdx, o))
  const activeOrdre = checkableOrders.find(o => !isCompleted(activeDayIdx, o)) ?? null

  function handleMarkerClick(ordre: number) {
    scrollToRef.current?.(ordre)
  }

  function handleDayChange(idx: number) {
    setActiveDayIdx(idx)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div class="min-h-screen bg-paper">
      <Header
        days={trip.jours}
        activeDayIdx={activeDayIdx}
        onDayChange={handleDayChange}
        isDayComplete={idx =>
          isDayComplete(
            idx,
            trip.jours[idx].etapes
              .filter(s => s.type !== 'depart' && s.type !== 'retour')
              .map(s => s.ordre)
          )
        }
      />

      <div class="pt-14">
        <MapView
          day={activeDay}
          completedOrders={completedOrders}
          onMarkerClick={handleMarkerClick}
        />

        <StepList
          day={activeDay}
          dayIdx={activeDayIdx}
          isCompleted={isCompleted}
          onToggle={toggleStep}
          activeOrdre={activeOrdre}
          onScrollTo={fn => { scrollToRef.current = fn }}
        />
      </div>
    </div>
  )
}
