# Changelog

## [Unreleased]

### Added
- **VoyagesPage** — list all trips with open / export JSON / delete actions
- **CreerPage** — dynamic form: destination, dates, hotel, N days, N steps per day (lieu, time, type, address, lat/lon, note)
- **BottomNav** — 2-tab fixed bottom bar (Voyages | Créer), hidden in planner view
- **nedb** (`@seald-io/nedb`) — embedded document store, browser-persisted via localStorage
- `db.ts` — async wrapper: `initDb` (seeds London on first run), `findAllTrips`, `insertTrip`, `removeTrip`
- Trip export as JSON download
- Step icon click → `map.flyTo()` on that POI (reverse of marker→list scroll)
- `useProgress(tripId)` — progress now namespaced per trip, no cross-trip interference
- Header back button (← Voyages) when in planner view
- Trip name displayed in planner header

### Changed
- `TripPage` now accepts `trip: Trip` + `tripId: string` + `onBack` as props (no longer hardcoded London)
- `App` manages multi-page routing: `auth → voyages | creer | planner`
- `MapView` accepts `focusOrdre?: number | null` to fly to a step from outside
- `StepItem` icon container changed from `<div>` to `<button>` triggering `onStepClick`
- `StepList` propagates `onStepClick` to each item

---

## [0.2.0] — 2026-05-19 — Uber redesign + London palette

### Added
- SVG stroke icons replacing emoji (culture, food, transport, etc.)
- Map `flyTo` animation on POI marker click
- Uber-inspired UI redesign: dark auth page, square checkboxes, monospace times, uppercase nav
- London "dark teal" palette — `#35F0F0` primary cyan, `#0B2027` ink, `#5A9FA8` sand, `#EDD53F` accent

### Changed
- Map tile provider: OpenStreetMap → CartoDB Positron (minimalist, white)
- Blush token `#C8F5F5` → `#2A6670` (visible contrast)
- Dividers: `border-blush` → `border-ink/8`
- StepList header: bolder hierarchy with day number + theme

### Fixed
- `retour` steps were showing checkboxes but weren't tracked — excluded from visible list
- Map re-fitted bounds on every step toggle — `fitBounds` now only fires on day change
- `onScrollTo` was called in render body (side effect) — moved to `useEffect`

---

## [0.1.0] — 2026-05-19 — MVP

### Added
- Auth gate: single access code (`ADMIN`), persisted in `localStorage`
- Fixed header with "voyo" wordmark and day picker `<select>`
- Leaflet map (OpenStreetMap) with color-coded circle markers
- Scrollable step list with checkbox completion per POI
- `useProgress` hook: r/w `localStorage`, `isCompleted`, `toggleStep`, `isDayComplete`
- London trip data: 5 days, 37 steps, typed as `Trip / Day / Step`
- Shake animation on wrong auth code
- Progress persisted across page reloads
- Day complete badge (`✓`) in header picker
- Map marker click scrolls list to corresponding step
- Biome linter + formatter configured
