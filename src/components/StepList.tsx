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
	onStepClick?: (ordre: number) => void
}

export function StepList({ day, dayIdx, isCompleted, onToggle, activeOrdre, onScrollTo, onStepClick }: StepListProps) {
	const itemRefs = useRef<Record<number, HTMLElement | null>>({})

	function scrollTo(ordre: number) {
		itemRefs.current[ordre]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
	}

	useEffect(() => {
		if (onScrollTo) onScrollTo(scrollTo)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []) // scrollTo reads from itemRefs.current which is always current; register once

	const visibleSteps = day.etapes.filter((s) => s.type !== 'depart' && s.type !== 'retour')

	return (
		<div class='pb-20'>
			<div class='px-4 py-5 border-b border-ink/8'>
				<p class='text-[10px] font-bold text-sand uppercase tracking-widest mb-1'>
					Jour {day.jour} · {day.jour_semaine}
				</p>
				<p class='text-base font-black text-ink leading-tight'>{day.theme.split(' - ')[0]}</p>
				<p class='mt-1 text-xs text-sand'>
					{day.depart_hotel}
					{day.retour_hotel ? ` — ${day.retour_hotel}` : ''}
				</p>
			</div>

			<div class='divide-y divide-ink/8'>
				{visibleSteps.map((step) => (
					<StepItem
						key={step.ordre}
						step={step}
						completed={isCompleted(dayIdx, step.ordre)}
						active={step.ordre === activeOrdre}
						onToggle={() => onToggle(dayIdx, step.ordre)}
						onStepClick={onStepClick ? () => onStepClick(step.ordre) : undefined}
						innerRef={(el) => {
							itemRefs.current[step.ordre] = el
						}}
					/>
				))}
			</div>
		</div>
	)
}
