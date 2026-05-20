# Changelog

## [0.6.0] — 2026-05-20 — Session 2

### Added
- **Import JSON** — bouton "Importer un JSON" dans CreerPage, avant le formulaire
  - File picker `.json`, validation structure (`sejour.destination` + `jours[].etapes`)
  - Erreur explicite si JSON mal formé (syntaxe ou structure)
  - Import valide → `insertTrip` direct → redirection Voyages
  - Séparateur "ou créer manuellement" entre import et formulaire

### Changed
- **Auth code** déplacé dans `.env` (`VITE_AUTH_CODE`) — retiré du code source
- **London démo** supprimé — `src/data/london.ts`, `src/data/london.json` retirés, `initDb()` simplifiée (no-op)
- **Palette Voyo** (navy/pink/yellow/mint) — remplace palette indigo/violet/or/teal
  - `primary` `#FFC820` jaune | `ink` `#2B2D42` navy | `paper` `#F7F7F7` off-white
  - `blush`/`sand` `#EF6D8A` rose | `accent` `#2DDBB0` mint
  - Ajout `black` `#000000` + `white` `#FFFFFF`
- **Marqueurs carte** : jaune (actif), mint (fait), navy (à venir)
- **Tiles Leaflet** : CartoDB Positron → CartoDB Voyager (puis Dark testé)
- `isDemo` retiré de `TripDoc` (plus de trip démo)

---

## [0.5.0] — 2026-05-20 — Palette Voyo v5

### Changed
- Palette : indigo `#1E1B3A` (ink), violet `#5B4E8C` (sand), or `#FFC857` (primary), teal `#19B8A6` (accent), violet clair `#EEEAF5` (blush)
- Markers carte : or (actif), violet (fait), indigo (à venir)
- Fond de page → blanc `#FFFFFE` (remplace gris chaud)

---

## [0.4.0] — 2026-05-20 — Palette Voyo v4 + UX interactions

### Added
- Trip cards VoyagesPage : pleine largeur clickable, chevron →, icône pin, hover/active states évidents
- BottomNav : indicateur actif (ligne top + text-primary), aria-current
- AuthPage : `autofocus` input, hint "Tapez votre code · Entrée pour valider"
- StepItem icon : bg teinté + title "Voir sur la carte" + hover/active states

### Changed
- Palette : ambre `#E89C12` (primary), quasi-noir `#04060D` (ink), marine `#062540` (sand), gris chaud `#DDD8D3` (paper), cramoisi `#8C0D31` (accent)
- `docs/` + `SESSION.md` retirés du tracking git (→ `.gitignore`)
- `SESSION.md` déplacé dans `.claude/`

---

## [0.3.0] — 2026-05-19 — Multi-pages + nedb

### Added
- **VoyagesPage** — liste tous les trips, open / export JSON / delete
- **CreerPage** — formulaire dynamique : destination, dates, hôtel, N jours, N étapes/jour
- **BottomNav** — 2 onglets fixes (Voyages | Créer), masqués dans le planner
- **nedb** (`@seald-io/nedb`) — DB embarquée persistée localStorage
- `db.ts` — wrapper async : `initDb` (seed London), `findAllTrips`, `insertTrip`, `removeTrip`
- `src/polyfills/events.ts` — EventEmitter browser polyfill (nedb dep)
- Vite `define` : `process.*` + `global` polyfills
- Vite `resolve.alias` : `events` → polyfill local
- Export trip → download JSON
- Step icon click → `map.flyTo()` (liste → carte)
- `useProgress(tripId)` — progress namespaced par trip
- Header : back button + trip name dans le planner

### Changed
- `TripPage` accepte `trip: Trip` + `tripId` + `onBack` (fini hardcodé London)
- `App` routing : `auth → voyages | creer | planner`
- `MapView` prop `focusOrdre?: number | null`
- `StepItem` icon `<div>` → `<button>` avec `onStepClick`

---

## [0.2.0] — 2026-05-19 — Redesign Uber + Palette London

### Added
- SVG stroke icons (culture, food, transport, pin…) remplacent les emoji
- `map.flyTo()` animé sur clic marker
- UI Uber : AuthPage sombre, checkbox carrée, heure mono/primary, nav uppercase
- Palette London cyan : `#35F0F0` primary, `#0B2027` ink, `#5A9FA8` sand

### Changed
- Tiles : OpenStreetMap → CartoDB Positron
- `fitBounds` uniquement sur changement de jour (plus sur chaque toggle)
- StepList : header hiérarchie bolder (jour + thème)

### Fixed
- Steps `retour` affichaient checkbox sans être trackées
- `onScrollTo` appelé dans render body → déplacé en `useEffect`

---

## [0.1.0] — 2026-05-19 — MVP

### Added
- Auth gate code (localStorage)
- Header fixe + day picker `<select>`
- Leaflet map + markers couleurs, scroll list sur clic marker
- Checklist étapes par jour, progression localStorage
- `useProgress` hook : `isCompleted`, `toggleStep`, `isDayComplete`
- Données Londres : 5 jours, 37 étapes, typées `Trip / Day / Step`
- Shake animation sur mauvais code
- Badge jour complet `✓` dans le picker
- Biome v2 configuré
