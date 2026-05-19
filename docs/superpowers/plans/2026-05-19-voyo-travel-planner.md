# Voyo Travel Planner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first travel planning web app with auth gate, interactive Leaflet map, and step-by-step POI progression backed by localStorage.

**Architecture:** Two views (state-based, no router) — `AuthPage` and `TripPage`. `TripPage` assembles `Header`, `MapView`, and `StepList`. Progress persists via `useProgress` hook writing to `localStorage`. London trip data imported as typed JSON.

**Tech Stack:** Preact 10 + TypeScript + Tailwind CSS v4 + Vite + Leaflet

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/index.css` | Modify | Color tokens, Leaflet CSS import, shake animation |
| `src/types.ts` | Create | Trip/Day/Step/Transport interfaces |
| `src/data/london.json` | Create (copy) | Raw London trip data |
| `src/data/london.ts` | Create | Typed export of london.json |
| `src/hooks/useProgress.ts` | Create | localStorage r/w for step completion |
| `src/pages/AuthPage.tsx` | Create | Code input page, sets voyo_auth in localStorage |
| `src/pages/TripPage.tsx` | Create | Root of app, assembles all components |
| `src/components/Header.tsx` | Create | Logo + day picker `<select>` |
| `src/components/StepItem.tsx` | Create | Single step row (checkbox, name, transport pill) |
| `src/components/StepList.tsx` | Create | Scrollable list of StepItem |
| `src/components/MapView.tsx` | Create | Leaflet map with color-coded markers |
| `src/app.tsx` | Modify | Auth guard, switches between AuthPage and TripPage |
| `package.json` | Modify | Install leaflet + @types/leaflet |

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install leaflet**

```bash
cd /Users/nebula/Projets/voyo
npm install leaflet
npm install -D @types/leaflet
```

Expected: no errors, `node_modules/leaflet` present.

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add leaflet dependency"
```

---

### Task 2: CSS Tokens + Base Styles

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Replace index.css**

```css
@import 'leaflet/dist/leaflet.css';
@import 'tailwindcss';

@theme {
  --color-primary: #1098F7;
  --color-ink: #000000;
  --color-paper: #FFFFFF;
  --color-sand: #B89E97;
  --color-blush: #DECCCC;
  --font-sans: 'Inter', system-ui, sans-serif;
}

html, body {
  background-color: #FFFFFF;
  color: #000000;
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-8px); }
  40%       { transform: translateX(8px); }
  60%       { transform: translateX(-8px); }
  80%       { transform: translateX(8px); }
}

.animate-shake {
  animation: shake 0.4s ease-in-out;
}
```

- [ ] **Step 2: Verify dev server loads**

```bash
cd /Users/nebula/Projets/voyo && npm run dev
```

Expected: server starts, no CSS errors in terminal.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "style: add design tokens, leaflet CSS, shake animation"
```

---

### Task 3: Types + London Data

**Files:**
- Create: `src/types.ts`
- Create: `src/data/london.json` (copy from Downloads)
- Create: `src/data/london.ts`

- [ ] **Step 1: Create src/types.ts**

```ts
export interface Coordonnees {
  lat: number
  lon: number
}

export interface Transport {
  mode: string
  ligne?: string
  trajet?: string
  duree_min: number
  cout_gbp_par_pers: number
}

export interface Step {
  ordre: number
  lieu: string
  adresse: string
  coordonnees: Coordonnees
  heure_arrivee?: string
  heure_depart?: string
  heure_ceremonie?: string
  fin_ceremonie?: string
  heure_train?: string
  duree_visite_min?: number
  duree_min?: number
  type: string
  gratuit?: boolean
  note?: string
  transport_depuis_precedent?: Transport
}

export interface Day {
  jour: number
  date: string
  jour_semaine: string
  theme: string
  contrainte?: string
  evenement_special?: string
  depart_hotel: string
  retour_hotel?: string
  arrivee_gare?: string
  train_depart?: string
  point_final?: string
  etapes: Step[]
}

export interface Hotel {
  nom: string
  adresse: string
  coordonnees: Coordonnees
  metro_proche?: string
}

export interface Trip {
  sejour: {
    destination: string
    hotel: Hotel
    dates: {
      arrivee: string
      depart: string
      duree_nuits: number
    }
    infos_transport: {
      carte_recommandee: string
      modes_utilises: string[]
      taux_change: string
    }
  }
  jours: Day[]
}
```

- [ ] **Step 2: Copy london.json into project**

```bash
mkdir -p /Users/nebula/Projets/voyo/src/data
cp /Users/nebula/Downloads/londres_planning_deplacements.json /Users/nebula/Projets/voyo/src/data/london.json
```

Expected: file at `src/data/london.json`.

- [ ] **Step 3: Create src/data/london.ts**

```ts
import raw from './london.json'
import type { Trip } from '../types'

export const londonTrip = raw as Trip
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd /Users/nebula/Projets/voyo && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/types.ts src/data/
git commit -m "feat: add Trip types and London trip data"
```

---

### Task 4: useProgress Hook

**Files:**
- Create: `src/hooks/useProgress.ts`

- [ ] **Step 1: Create useProgress**

```bash
mkdir -p /Users/nebula/Projets/voyo/src/hooks
```

Create `src/hooks/useProgress.ts`:

```ts
import { useState } from 'preact/hooks'

type Progress = Record<string, number[]>

const STORAGE_KEY = 'voyo_progress'

function load(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function persist(progress: Progress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(load)

  function isCompleted(dayIdx: number, ordre: number): boolean {
    return progress[String(dayIdx)]?.includes(ordre) ?? false
  }

  function toggleStep(dayIdx: number, ordre: number): void {
    setProgress(prev => {
      const key = String(dayIdx)
      const current = prev[key] ?? []
      const next = current.includes(ordre)
        ? current.filter(o => o !== ordre)
        : [...current, ordre]
      const updated = { ...prev, [key]: next }
      persist(updated)
      return updated
    })
  }

  function isDayComplete(dayIdx: number, allOrders: number[]): boolean {
    const done = progress[String(dayIdx)] ?? []
    return allOrders.length > 0 && allOrders.every(o => done.includes(o))
  }

  return { isCompleted, toggleStep, isDayComplete }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useProgress.ts
git commit -m "feat: add useProgress hook with localStorage persistence"
```

---

### Task 5: AuthPage

**Files:**
- Create: `src/pages/AuthPage.tsx`

- [ ] **Step 1: Create src/pages directory and AuthPage**

```bash
mkdir -p /Users/nebula/Projets/voyo/src/pages
```

Create `src/pages/AuthPage.tsx`:

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/AuthPage.tsx
git commit -m "feat: add AuthPage with shake animation on wrong code"
```

---

### Task 6: Header

**Files:**
- Create: `src/components/Header.tsx`

- [ ] **Step 1: Create src/components directory and Header**

```bash
mkdir -p /Users/nebula/Projets/voyo/src/components
```

Create `src/components/Header.tsx`:

```tsx
import type { Day } from '../types'

interface HeaderProps {
  days: Day[]
  activeDayIdx: number
  onDayChange: (idx: number) => void
  isDayComplete: (idx: number) => boolean
}

export function Header({ days, activeDayIdx, onDayChange, isDayComplete }: HeaderProps) {
  return (
    <header class="fixed top-0 left-0 right-0 z-50 bg-ink text-paper flex items-center justify-between px-4 h-14 shadow-sm">
      <span class="text-xl font-black tracking-tighter">voyo</span>

      <select
        value={activeDayIdx}
        onChange={e => onDayChange(Number((e.target as HTMLSelectElement).value))}
        class="bg-ink text-paper text-sm font-medium pr-2 outline-none cursor-pointer max-w-[200px] truncate"
      >
        {days.map((day, idx) => (
          <option key={idx} value={idx}>
            {isDayComplete(idx) ? '✓ ' : ''}{day.jour_semaine} — {day.theme.split(' - ')[0]}
          </option>
        ))}
      </select>
    </header>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat: add Header with day picker"
```

---

### Task 7: StepItem + StepList

**Files:**
- Create: `src/components/StepItem.tsx`
- Create: `src/components/StepList.tsx`

- [ ] **Step 1: Create StepItem**

Create `src/components/StepItem.tsx`:

```tsx
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
        type="button"
        onClick={onToggle}
        class={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
          ${completed ? 'bg-primary border-primary text-paper' : 'border-sand bg-paper'}`}
        aria-label={completed ? 'Marquer incomplet' : 'Marquer complété'}
      >
        {completed && (
          <svg class="w-3 h-3" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        )}
      </button>

      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-center gap-1.5">
            <span class="text-base">{icon}</span>
            <span class={`font-semibold text-sm text-ink ${completed ? 'line-through' : ''}`}>
              {step.lieu}
            </span>
          </div>
          {step.heure_arrivee && (
            <span class="text-xs text-sand flex-shrink-0 mt-0.5">{step.heure_arrivee}</span>
          )}
        </div>

        {transport && transport.mode !== 'pied' && (
          <div class="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blush text-xs text-ink/70">
            <span>{TRANSPORT_ICON[transport.mode] ?? '🚌'}</span>
            <span>{transport.mode}{transport.ligne ? ` ${transport.ligne}` : ''}</span>
            <span>· {transport.duree_min}min</span>
            {transport.cout_gbp_par_pers > 0 && (
              <span>· £{transport.cout_gbp_par_pers.toFixed(2)}</span>
            )}
          </div>
        )}

        {step.note && (
          <p class="mt-1.5 text-xs text-ink/60 bg-blush/50 rounded-lg px-2 py-1">
            {step.note}
          </p>
        )}

        {step.gratuit && (
          <span class="mt-1 inline-block text-xs font-medium text-primary">Gratuit</span>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create StepList**

Create `src/components/StepList.tsx`:

```tsx
import { useRef } from 'preact/hooks'
import type { Day } from '../types'
import { StepItem } from './StepItem'

interface StepListProps {
  day: Day
  dayIdx: number
  isCompleted: (dayIdx: number, ordre: number) => boolean
  onToggle: (dayIdx: number, ordre: number) => void
  activeOrdre: number | null
  onScrollTo?: (scrollFn: (ordre: number) => void) => void
}

export function StepList({ day, dayIdx, isCompleted, onToggle, activeOrdre, onScrollTo }: StepListProps) {
  const itemRefs = useRef<Record<number, HTMLElement | null>>({})

  function scrollTo(ordre: number) {
    itemRefs.current[ordre]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  if (onScrollTo) onScrollTo(scrollTo)

  const visibleSteps = day.etapes.filter(s => s.type !== 'depart')

  return (
    <div class="pb-20">
      <div class="px-4 py-3 border-b border-blush">
        <p class="text-xs font-semibold text-sand uppercase tracking-widest">{day.theme}</p>
        <p class="text-xs text-sand mt-0.5">
          Départ {day.depart_hotel}{day.retour_hotel ? ` · Retour ${day.retour_hotel}` : ''}
        </p>
      </div>

      <div class="divide-y divide-blush/60">
        {visibleSteps.map(step => (
          <StepItem
            key={step.ordre}
            step={step}
            completed={isCompleted(dayIdx, step.ordre)}
            active={step.ordre === activeOrdre}
            onToggle={() => onToggle(dayIdx, step.ordre)}
            innerRef={el => { itemRefs.current[step.ordre] = el }}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/StepItem.tsx src/components/StepList.tsx
git commit -m "feat: add StepItem and StepList components"
```

---

### Task 8: MapView

**Files:**
- Create: `src/components/MapView.tsx`

- [ ] **Step 1: Create MapView**

Create `src/components/MapView.tsx`:

```tsx
import { useEffect, useRef } from 'preact/hooks'
import L from 'leaflet'
import type { Day } from '../types'

interface MapViewProps {
  day: Day
  completedOrders: number[]
  onMarkerClick: (ordre: number) => void
}

function makeMarkerIcon(color: string, size: number): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2.5px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.25);cursor:pointer"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })
}

export function MapView({ day, completedOrders, onMarkerClick }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const map = L.map(containerRef.current, { zoomControl: false })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    const mappable = day.etapes.filter(
      s => s.type !== 'depart' && s.type !== 'retour' && s.coordonnees
    )
    if (mappable.length === 0) return

    const nextOrdre = mappable.find(s => !completedOrders.includes(s.ordre))?.ordre ?? null

    mappable.forEach(step => {
      const done = completedOrders.includes(step.ordre)
      const isActive = step.ordre === nextOrdre

      const color = done ? '#B89E97' : isActive ? '#1098F7' : '#000000'
      const size = isActive ? 18 : 12

      const marker = L.marker([step.coordonnees.lat, step.coordonnees.lon], {
        icon: makeMarkerIcon(color, size),
        title: step.lieu,
        zIndexOffset: isActive ? 1000 : done ? 0 : 500,
      })
        .addTo(map)
        .on('click', () => onMarkerClick(step.ordre))

      markersRef.current.push(marker)
    })

    const bounds = L.latLngBounds(
      mappable.map(s => [s.coordonnees.lat, s.coordonnees.lon] as [number, number])
    )
    map.fitBounds(bounds, { padding: [24, 24], maxZoom: 15 })
  }, [day, completedOrders])

  return (
    <div
      ref={containerRef}
      class="w-full z-10"
      style={{ height: '40vh' }}
    />
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/MapView.tsx
git commit -m "feat: add MapView with Leaflet, color-coded markers by completion state"
```

---

### Task 9: TripPage

**Files:**
- Create: `src/pages/TripPage.tsx`

- [ ] **Step 1: Create TripPage**

Create `src/pages/TripPage.tsx`:

```tsx
import { useState, useRef } from 'preact/hooks'
import { londonTrip } from '../data/london'
import { useProgress } from '../hooks/useProgress'
import { Header } from '../components/Header'
import { MapView } from '../components/MapView'
import { StepList } from '../components/StepList'

export function TripPage() {
  const trip = londonTrip
  const [activeDayIdx, setActiveDayIdx] = useState(0)
  const { isCompleted, toggleStep, isDayComplete } = useProgress()
  const scrollToRef = useRef<((ordre: number) => void) | null>(null)

  const activeDay = trip.jours[activeDayIdx]

  const checkableSteps = activeDay.etapes.filter(
    s => s.type !== 'depart' && s.type !== 'retour'
  )
  const checkableOrders = checkableSteps.map(s => s.ordre)
  const completedOrders = checkableOrders.filter(o => isCompleted(activeDayIdx, o))
  const activeOrdre = checkableOrders.find(o => !isCompleted(activeDayIdx, o)) ?? null

  function handleMarkerClick(ordre: number) {
    scrollToRef.current?.(ordre)
  }

  function handleDayChange(idx: number) {
    setActiveDayIdx(idx)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div class="min-h-screen bg-paper">
      <Header
        days={trip.jours}
        activeDayIdx={activeDayIdx}
        onDayChange={handleDayChange}
        isDayComplete={idx =>
          isDayComplete(
            idx,
            trip.jours[idx].etapes
              .filter(s => s.type !== 'depart' && s.type !== 'retour')
              .map(s => s.ordre)
          )
        }
      />

      <div class="pt-14">
        <MapView
          day={activeDay}
          completedOrders={completedOrders}
          onMarkerClick={handleMarkerClick}
        />

        <StepList
          day={activeDay}
          dayIdx={activeDayIdx}
          isCompleted={isCompleted}
          onToggle={toggleStep}
          activeOrdre={activeOrdre}
          onScrollTo={fn => { scrollToRef.current = fn }}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/TripPage.tsx
git commit -m "feat: add TripPage assembling Header, MapView, StepList"
```

---

### Task 10: App Auth Guard

**Files:**
- Modify: `src/app.tsx`

- [ ] **Step 1: Replace app.tsx with auth guard**

```tsx
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/nebula/Projets/voyo && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Run dev server and verify full flow**

```bash
cd /Users/nebula/Projets/voyo && npm run dev
```

Open browser at the local URL. Verify:
1. Auth page shows on first load
2. Wrong code → input shakes, clears
3. `ADMIN` → navigates to TripPage
4. Map shows markers for Day 1
5. Day picker changes active day + map
6. Checking a step → marker turns grey, next marker turns blue
7. Progress persists after reload

- [ ] **Step 4: Final commit**

```bash
git add src/app.tsx
git commit -m "feat: wire auth guard in App, complete Voyo MVP"
```

---

## Self-Review

**Spec coverage:**
- [x] Auth page with ADMIN code
- [x] Mobile-first layout
- [x] Header with day picker
- [x] Leaflet map with OSM tiles
- [x] Color-coded markers (completed/active/upcoming)
- [x] Step list with checkboxes
- [x] localStorage persistence
- [x] Shake animation on wrong auth code
- [x] London JSON data loaded
- [x] Color palette (#000, #1098F7, #FFF, #B89E97, #DECCCC) via Tailwind v4 tokens

**Placeholder scan:** None found.

**Type consistency:**
- `useProgress` returns `{ isCompleted, toggleStep, isDayComplete }` — used consistently in TripPage
- `MapView` receives `day: Day`, `completedOrders: number[]`, `onMarkerClick: (ordre: number) => void` — matches usage in TripPage
- `StepList` receives `onScrollTo: (fn) => void` — matches `scrollToRef` pattern in TripPage
- `isDayComplete(dayIdx, allOrders[])` — called correctly in TripPage Header prop

**Edge cases covered:**
- Day with all steps done → header shows `✓`
- Last step checked → `activeOrdre` is `null`, all markers grey
- Wrong auth code multiple times → shake resets correctly via `setTimeout`
