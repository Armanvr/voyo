import type { Day } from '../types'

interface HeaderProps {
	days: Day[]
	activeDayIdx: number
	onDayChange: (idx: number) => void
	isDayComplete: (idx: number) => boolean
}

export function Header({ days, activeDayIdx, onDayChange, isDayComplete }: HeaderProps) {
	return (
		<header class='fixed top-0 left-0 right-0 z-50 bg-ink text-paper flex items-center justify-between px-4 h-14 shadow-sm'>
			<span class='text-xl font-black tracking-tighter'>voyo</span>

			<select
				value={activeDayIdx}
				onChange={(e) => onDayChange(Number((e.target as HTMLSelectElement).value))}
				class='bg-ink text-paper text-sm font-medium pr-2 outline-none cursor-pointer max-w-[200px] truncate'
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
