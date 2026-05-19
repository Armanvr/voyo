export type Page = 'voyages' | 'creer'

interface BottomNavProps {
	page: Page
	onNavigate: (p: Page) => void
}

export function BottomNav({ page, onNavigate }: BottomNavProps) {
	return (
		<nav class='fixed bottom-0 left-0 right-0 z-50 bg-ink flex h-16'>
			{(['voyages', 'creer'] as const).map((p) => {
				const active = page === p
				return (
					<button
						key={p}
						type='button'
						onClick={() => onNavigate(p)}
						class={`relative flex-1 flex flex-col items-center justify-center gap-1 transition-colors
							${active ? 'text-primary' : 'text-sand/50 hover:text-sand active:text-sand'}`}
						aria-label={p === 'voyages' ? 'Mes voyages' : 'Créer un voyage'}
						aria-current={active ? 'page' : undefined}
					>
						{/* Active indicator — top line */}
						{active && <span class='absolute top-0 left-4 right-4 h-0.5 bg-primary' aria-hidden='true' />}

						{p === 'voyages' ? (
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
						) : (
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
						)}

						<span class='text-[10px] font-black uppercase tracking-widest'>
							{p === 'voyages' ? 'Voyages' : 'Créer'}
						</span>
					</button>
				)
			})}
		</nav>
	)
}
