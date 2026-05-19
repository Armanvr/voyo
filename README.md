# voyo

Mobile-first travel planning app. Create trips, visualise your itinerary on an interactive map, check off stops as you go.

## Stack

- **Preact** + TypeScript
- **Tailwind CSS v4** — design tokens, utility-first
- **Leaflet** + CartoDB Positron — minimalist map tiles
- **@seald-io/nedb** — embedded document DB (browser localStorage)
- **Vite** — build tool
- **Biome** — linter + formatter

## Getting started

```bash
npm install
npm run dev
```

## Pages

| Page | Description |
|------|-------------|
| **Auth** | Access code gate — code is given by the developer |
| **Voyages** | List all trips — open, export JSON, delete |
| **Créer** | Form to create a new trip (days + steps, dynamic) |
| **Planner** | Day-by-day map + step checklist for a trip |

## Features

- Auth gate — all pages protected, code is given by the developer
- Trip DB via nedb (localStorage) — London seeded on first run
- Interactive Leaflet map (CartoDB Positron tiles):
  - **Gold** = next stop, **Violet** = done, **Indigo** = upcoming
  - Tap marker → map flies to it + list scrolls
  - Tap step icon in list → map flies to that step
- Check off steps → map updates in real time
- Progress namespaced per trip via `localStorage`
- Export trip as JSON download
- Create custom trips: dynamic days + steps, optional coordinates

## Project structure

```
src/
  app.tsx              # routing + auth guard + DB init
  db.ts                # nedb wrapper (findAll, insert, remove)
  types.ts             # Trip / Day / Step interfaces
  data/london.ts       # London demo trip (5 days)
  hooks/useProgress.ts # per-trip localStorage progress
  polyfills/events.ts  # EventEmitter browser polyfill (nedb dep)
  pages/
    AuthPage.tsx       # dark landing + code input
    VoyagesPage.tsx    # trip list with open/export/delete
    CreerPage.tsx      # create trip form (dynamic days + steps)
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
| `primary` | `#FFC857` | Gold — active state, CTA, markers |
| `ink` | `#1E1B3A` | Deep indigo — text, header, nav |
| `paper` | `#FFFFFE` | White — background |
| `sand` | `#5B4E8C` | Violet — secondary text, muted |
| `accent` | `#19B8A6` | Teal — available |
| `blush` | `#EEEAF5` | Light violet — surfaces, dividers |
