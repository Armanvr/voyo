import { useState } from 'preact/hooks'
import { AuthPage } from './pages/AuthPage'
import { TripPage } from './pages/TripPage'

const AUTH_KEY = 'voyo_auth'

export function App() {
	const [authed, setAuthed] = useState(() => localStorage.getItem(AUTH_KEY) === '1')

	if (!authed) {
		return <AuthPage onAuth={() => setAuthed(true)} />
	}

	return <TripPage />
}

