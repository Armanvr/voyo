export type Page = 'voyages' | 'creer'

interface BottomNavProps {
	page: Page
	onNavigate: (p: Page) => void
}

export function BottomNav({ page, onNavigate }: BottomNavProps) {
	return (
		<nav class='fixed bottom-0 left-0 right-0 z-50 bg-ink border-t border-ink/20 flex h-16 safe-area-inset-bottom'>
			<button
				type='button'
				onClick={() => onNavigate('voyages')}
				class={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${page === 'voyages' ? 'text-primary' : 'text-sand/60 hover:text-sand'}`}
				aria-label='Mes voyages'
			>
				<svg
					viewBox='0 0 16 16'
					fill='none'
					stroke='currentColor'
					stroke-width='1.5'
					stroke-linecap='round'
					stroke-linejoin='round'
					class='w-5 h-5'
					aria-hidden='true'
				>
					<rect x='1' y='3' width='14' height='10' rx='1' />
					<path d='M1 7h14M5 3V1M11 3V1' />
				</svg>
				<span class='text-[10px] font-bold uppercase tracking-widest'>Voyages</span>
			</button>

			<button
				type='button'
				onClick={() => onNavigate('creer')}
				class={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${page === 'creer' ? 'text-primary' : 'text-sand/60 hover:text-sand'}`}
				aria-label='Créer un voyage'
			>
				<svg
					viewBox='0 0 16 16'
					fill='none'
					stroke='currentColor'
					stroke-width='1.5'
					stroke-linecap='round'
					stroke-linejoin='round'
					class='w-5 h-5'
					aria-hidden='true'
				>
					<circle cx='8' cy='8' r='6' />
					<path d='M8 5v6M5 8h6' />
				</svg>
				<span class='text-[10px] font-bold uppercase tracking-widest'>Créer</span>
			</button>
		</nav>
	)
}
