import { useState } from 'preact/hooks'

const AUTH_KEY = 'voyo_auth'
const CORRECT_CODE = import.meta.env.VITE_AUTH_CODE

interface AuthPageProps {
	onAuth: () => void
}

export function AuthPage({ onAuth }: AuthPageProps) {
	const [code, setCode] = useState('')
	const [shaking, setShaking] = useState(false)
	const [error, setError] = useState(false)

	function handleSubmit(e: Event) {
		e.preventDefault()
		if (code === CORRECT_CODE) {
			localStorage.setItem(AUTH_KEY, '1')
			onAuth()
		} else {
			setError(true)
			setShaking(true)
			setCode('')
			setTimeout(() => {
				setShaking(false)
				setError(false)
			}, 600)
		}
	}

	return (
		<div class='min-h-screen bg-ink flex flex-col justify-center px-8'>
			<div class='w-full max-w-sm'>
				<div class='mb-14'>
					<h1 class='text-8xl font-black tracking-tight text-primary leading-none'>voyo</h1>
					<p class='mt-3 text-xs text-sand uppercase tracking-widest font-medium'>Travel Planner</p>
				</div>

				<form onSubmit={handleSubmit} class='space-y-8'>
					<div class={shaking ? 'animate-shake' : ''}>
						<label
							for='access-code'
							class='block text-[10px] font-bold text-sand uppercase tracking-widest mb-3'
						>
							Code d'accès
						</label>
						<input
							id='access-code'
							type='text'
							value={code}
							onInput={(e) => setCode((e.target as HTMLInputElement).value)}
							placeholder='••••••'
							autocomplete='off'
							autofocus
							class={`w-full bg-transparent border-b-2 pb-3 text-paper text-2xl font-black outline-none placeholder:text-ink/30 transition-colors ${error ? 'border-red-400' : 'border-ink/30 focus:border-primary'}`}
						/>
						<p
							class={`mt-2 text-[10px] uppercase tracking-widest transition-colors ${error ? 'text-red-400' : 'text-sand/40'}`}
						>
							{error ? 'Code incorrect' : 'Tapez votre code · Entrée pour valider'}
						</p>
					</div>
					<button
						type='submit'
						class='w-full py-4 bg-primary text-ink font-black text-sm uppercase tracking-widest active:scale-95 transition-transform'
					>
						Accéder →
					</button>
				</form>
			</div>
		</div>
	)
}
