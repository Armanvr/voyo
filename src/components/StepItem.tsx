import type { Step } from '../types'

const TYPE_ICON: Record<string, string> = {
	culture: '🎨',
	attraction: '⭐',
	dejeuner: '🍽️',
	dejeuner_culture: '🍽️',
	diner: '🍷',
	gouter: '🧁',
	gouter_culture: '🧁',
	gouter_attraction: '🧁',
	gouter_shopping: '🛍️',
	shopping: '🛍️',
	marche: '🛒',
	gratuit: '🆓',
	evenement: '🎭',
	logistique: '🧳',
	point_final: '🚄',
}

const TRANSPORT_ICON: Record<string, string> = {
	bus: '🚌',
	metro: '🚇',
	pied: '🚶',
	thames_clipper: '⛵',
}

interface StepItemProps {
	step: Step
	completed: boolean
	active: boolean
	onToggle: () => void
	innerRef?: (el: HTMLElement | null) => void
}

export function StepItem({ step, completed, active, onToggle, innerRef }: StepItemProps) {
	const icon = TYPE_ICON[step.type] ?? '📍'
	const transport = step.transport_depuis_precedent

	return (
		<div
			ref={innerRef}
			class={`flex items-start gap-3 px-4 py-3 border-l-4 transition-all
        ${active ? 'border-primary bg-blush/30' : 'border-transparent'}
        ${completed ? 'opacity-50' : ''}`}
		>
			<button
				type='button'
				onClick={onToggle}
				class={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
          ${completed ? 'bg-primary border-primary text-paper' : 'border-sand bg-paper'}`}
				aria-label={completed ? 'Marquer incomplet' : 'Marquer complété'}
			>
				{completed && (
					<svg class='w-3 h-3' viewBox='0 0 12 12' fill='none'>
						<path
							d='M2 6l3 3 5-5'
							stroke='currentColor'
							stroke-width='2'
							stroke-linecap='round'
							stroke-linejoin='round'
						/>
					</svg>
				)}
			</button>

			<div class='flex-1 min-w-0'>
				<div class='flex items-start justify-between gap-2'>
					<div class='flex items-center gap-1.5'>
						<span class='text-base'>{icon}</span>
						<span class={`font-semibold text-sm text-ink ${completed ? 'line-through' : ''}`}>
							{step.lieu}
						</span>
					</div>
					{step.heure_arrivee && (
						<span class='text-xs text-sand flex-shrink-0 mt-0.5'>{step.heure_arrivee}</span>
					)}
				</div>

				{transport && transport.mode !== 'pied' && (
					<div class='mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blush text-xs text-ink/70'>
						<span>{TRANSPORT_ICON[transport.mode] ?? '🚌'}</span>
						<span>
							{transport.mode}
							{transport.ligne ? ` ${transport.ligne}` : ''}
						</span>
						<span>· {transport.duree_min}min</span>
						{transport.cout_gbp_par_pers > 0 && <span>· £{transport.cout_gbp_par_pers.toFixed(2)}</span>}
					</div>
				)}

				{step.note && <p class='mt-1.5 text-xs text-ink/60 bg-blush/50 rounded-lg px-2 py-1'>{step.note}</p>}

				{step.gratuit && <span class='mt-1 inline-block text-xs font-medium text-primary'>Gratuit</span>}
			</div>
		</div>
	)
}
