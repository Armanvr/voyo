import { useEffect, useRef } from 'preact/hooks'
import type { Day } from '../types'
import { StepItem } from './StepItem'

interface StepListProps {
  day: Day
  dayIdx: number
  isCompleted: (dayIdx: number, ordre: number) => boolean
  onToggle: (dayIdx: number, ordre: number) => void
  activeOrdre: number | null
  onScrollTo?: (scrollFn: (ordre: number) => void) => void
}

export function StepList({ day, dayIdx, isCompleted, onToggle, activeOrdre, onScrollTo }: StepListProps) {
  const itemRefs = useRef<Record<number, HTMLElement | null>>({})

  function scrollTo(ordre: number) {
    itemRefs.current[ordre]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  useEffect(() => {
    if (onScrollTo) onScrollTo(scrollTo)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // scrollTo reads from itemRefs.current which is always current; register once

  const visibleSteps = day.etapes.filter(s => s.type !== 'depart' && s.type !== 'retour')

  return (
    <div class="pb-20">
      <div class="px-4 py-3 border-b border-blush">
        <p class="text-xs font-semibold text-sand uppercase tracking-widest">{day.theme}</p>
        <p class="text-xs text-sand mt-0.5">
          Départ {day.depart_hotel}{day.retour_hotel ? ` · Retour ${day.retour_hotel}` : ''}
        </p>
      </div>

      <div class="divide-y divide-blush/60">
        {visibleSteps.map(step => (
          <StepItem
            key={step.ordre}
            step={step}
            completed={isCompleted(dayIdx, step.ordre)}
            active={step.ordre === activeOrdre}
            onToggle={() => onToggle(dayIdx, step.ordre)}
            innerRef={el => { itemRefs.current[step.ordre] = el }}
          />
        ))}
      </div>
    </div>
  )
}
