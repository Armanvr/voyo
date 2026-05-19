import { useEffect, useState } from 'preact/hooks'
import type { Page } from './components/BottomNav'
import { BottomNav } from './components/BottomNav'
import type { TripDoc } from './db'
import { initDb } from './db'
import { AuthPage } from './pages/AuthPage'
import { CreerPage } from './pages/CreerPage'
import { TripPage } from './pages/TripPage'
import { VoyagesPage } from './pages/VoyagesPage'

const AUTH_KEY = 'voyo_auth'

export function App() {
	const [authed, setAuthed] = useState(() => localStorage.getItem(AUTH_KEY) === '1')
	const [dbReady, setDbReady] = useState(false)
	const [page, setPage] = useState<Page>('voyages')
	const [activeTrip, setActiveTrip] = useState<TripDoc | null>(null)

	useEffect(() => {
		initDb().then(() => setDbReady(true))
	}, [])

	if (!authed) {
		return <AuthPage onAuth={() => setAuthed(true)} />
	}

	if (!dbReady) {
		return (
			<div class='min-h-screen bg-ink flex items-center justify-center'>
				<p class='text-xs text-sand uppercase tracking-widest'>Chargement…</p>
			</div>
		)
	}

	if (activeTrip) {
		return <TripPage trip={activeTrip.trip} tripId={activeTrip._id ?? 'demo'} onBack={() => setActiveTrip(null)} />
	}

	return (
		<div class='min-h-screen bg-paper'>
			{page === 'voyages' && <VoyagesPage onOpenTrip={(doc) => setActiveTrip(doc)} />}
			{page === 'creer' && <CreerPage onSaved={() => setPage('voyages')} onBack={() => setPage('voyages')} />}
			<BottomNav page={page} onNavigate={setPage} />
		</div>
	)
}
