# voyo

Mobile-first travel planning app. Create trips, visualise your itinerary on an interactive map, check off stops as you go.

## Stack

- **Preact** + TypeScript
- **Tailwind CSS v4** — design tokens, utility-first
- **Leaflet** + CartoDB Voyager — map tiles
- **@seald-io/nedb** — embedded document DB (browser localStorage)
- **Vite** — build tool
- **Biome** — linter + formatter

## Getting started

```bash
npm install
npm run dev
```

> Access code is stored in `.env` as `VITE_AUTH_CODE`.

## Pages

| Page | Description |
|------|-------------|
| **Auth** | Access code gate — code set via `VITE_AUTH_CODE` in `.env` |
| **Voyages** | List all trips — open, export JSON, delete |
| **Créer** | Import a JSON trip file, or create one manually (days + steps) |
| **Planner** | Day-by-day map + step checklist for a trip |

## Features

- Auth gate — all pages protected, code loaded from `.env`
- Trip DB via nedb (localStorage) — empty on first run, import or create
- Interactive Leaflet map (CartoDB Voyager tiles):
  - **Yellow** = next stop, **Mint** = done, **Navy** = upcoming
  - Tap marker → map flies to it + list scrolls
  - Tap step icon in list → map flies to that step
- Check off steps → map updates in real time
- Progress namespaced per trip via `localStorage`
- Export trip as JSON download
- Import trip from JSON file (validated on load)
- Create custom trips: dynamic days + steps, optional coordinates

## Project structure

```
src/
  app.tsx              # routing + auth guard + DB init
  db.ts                # nedb wrapper (findAll, insert, remove)
  types.ts             # Trip / Day / Step interfaces
  hooks/useProgress.ts # per-trip localStorage progress
  polyfills/events.ts  # EventEmitter browser polyfill (nedb dep)
  pages/
    AuthPage.tsx       # dark landing + code input (reads VITE_AUTH_CODE)
    VoyagesPage.tsx    # trip list with open/export/delete
    CreerPage.tsx      # import JSON or create trip form
    TripPage.tsx       # planner (map + checklist)
  components/
    Header.tsx         # fixed nav + day picker + back button
    BottomNav.tsx      # Voyages / Créer tabs
    MapView.tsx        # Leaflet map + flyTo
    StepItem.tsx       # single POI row with SVG icons + map focus
    StepList.tsx       # day itinerary list
```

## Color palette

| Token | Hex | Role |
|-------|-----|------|
| `primary` | `#FFC820` | Yellow — active state, CTA, markers |
| `ink` | `#2B2D42` | Dark navy — text, header, nav |
| `paper` | `#F7F7F7` | Off-white — background |
| `blush` / `sand` | `#EF6D8A` | Pink — secondary text, muted |
| `accent` | `#2DDBB0` | Mint — done state |
| `black` | `#000000` | |
| `white` | `#FFFFFF` | |

## JSON trip format

See `types.ts` for the full `Trip` interface. Minimum required structure:

```json
{
  "sejour": {
    "destination": "Paris",
    "hotel": { "nom": "", "adresse": "", "coordonnees": { "lat": 0, "lon": 0 } },
    "dates": { "arrivee": "2026-06-01", "depart": "2026-06-05", "duree_nuits": 4 },
    "infos_transport": { "carte_recommandee": "", "modes_utilises": [], "taux_change": "" }
  },
  "jours": [
    {
      "jour": 1,
      "date": "2026-06-01",
      "jour_semaine": "Lundi",
      "theme": "Arrivée",
      "depart_hotel": "09:00",
      "etapes": []
    }
  ]
}
```
