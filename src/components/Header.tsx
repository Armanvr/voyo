import type { Day } from '../types'

interface HeaderProps {
	days: Day[]
	activeDayIdx: number
	onDayChange: (idx: number) => void
	isDayComplete: (idx: number) => boolean
	onBack?: () => void
	tripName?: string
}

export function Header({ days, activeDayIdx, onDayChange, isDayComplete, onBack, tripName }: HeaderProps) {
	return (
		<header class='fixed top-0 left-0 right-0 z-50 bg-ink text-paper flex items-center gap-3 px-4 h-14'>
			{onBack && (
				<button
					type='button'
					onClick={onBack}
					class='flex-shrink-0 flex items-center justify-center w-8 h-8 text-sand hover:text-primary transition-colors'
					aria-label='Retour aux voyages'
				>
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
						<path d='M10 3L5 8l5 5' />
					</svg>
				</button>
			)}

			<span class='text-lg font-black tracking-tight text-primary flex-shrink-0'>voyo</span>

			{tripName && <span class='text-xs text-sand font-bold uppercase tracking-wider truncate'>{tripName}</span>}

			<div class='flex-1' />

			<select
				value={activeDayIdx}
				onChange={(e) => onDayChange(Number((e.target as HTMLSelectElement).value))}
				class='bg-ink text-sand text-xs font-bold uppercase tracking-wider pr-2 outline-none cursor-pointer max-w-[220px] truncate'
			>
				{days.map((day, idx) => (
					<option key={idx} value={idx}>
						{isDayComplete(idx) ? '✓ ' : ''}
						{day.jour_semaine} — {day.theme.split(' - ')[0]}
					</option>
				))}
			</select>
		</header>
	)
}
