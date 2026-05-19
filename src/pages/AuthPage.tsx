import { useState } from 'preact/hooks'

const AUTH_KEY = 'voyo_auth'
const CORRECT_CODE = 'ADMIN'

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
    <div class="min-h-screen bg-paper flex flex-col items-center justify-center px-6">
      <div class="w-full max-w-xs space-y-10">
        <div class="text-center">
          <h1 class="text-5xl font-black tracking-tighter text-ink">voyo</h1>
          <p class="mt-2 text-sm text-sand">Plan. Explore. Remember.</p>
        </div>

        <form onSubmit={handleSubmit} class="space-y-4">
          <div class={`${shaking ? 'animate-shake' : ''}`}>
            <input
              type="text"
              value={code}
              onInput={e => setCode((e.target as HTMLInputElement).value)}
              placeholder="Code d'accès"
              autocomplete="off"
              class={`w-full px-4 py-3 text-center text-lg font-medium rounded-xl border-2 outline-none transition-colors bg-paper text-ink placeholder:text-sand
                ${error ? 'border-red-400' : 'border-blush focus:border-primary'}`}
            />
          </div>
          <button
            type="submit"
            class="w-full py-3 rounded-xl bg-primary text-paper font-semibold text-base tracking-wide active:scale-95 transition-transform"
          >
            Accéder
          </button>
        </form>
      </div>
    </div>
  )
}
