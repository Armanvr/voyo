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

Access code: `ADMIN`

## Pages

| Page | Description |
|------|-------------|
| **Auth** | Access code gate — code `ADMIN` |
| **Voyages** | List all trips — open, export JSON, delete |
| **Créer** | Form to create a new trip (days + steps, dynamic) |
| **Planner** | Day-by-day map + step checklist for a trip |

## Features

- Auth gate — all pages protected, ADMIN code required
- Trip DB via nedb (localStorage) — London seeded on first run
- Interactive Leaflet map (CartoDB Positron tiles):
  - **Cyan** = next stop, **Teal** = done, **Dark** = upcoming
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
  pages/
    AuthPage.tsx       # dark landing + code input
    VoyagesPage.tsx    # trip list
    CreerPage.tsx      # create trip form
    TripPage.tsx       # planner (map + list)
  components/
    Header.tsx         # fixed nav + day picker + back button
    BottomNav.tsx      # Voyages / Créer tabs
    MapView.tsx        # Leaflet map
    StepItem.tsx       # single POI row with SVG icons
    StepList.tsx       # day itinerary list
```

## Color palette

| Token | Hex | Role |
|-------|-----|------|
| `primary` | `#35F0F0` | Cyan — active state, CTA |
| `ink` | `#0B2027` | Deep teal — text, header |
| `paper` | `#FFFFFE` | White — background |
| `sand` | `#5A9FA8` | Mid teal — secondary text |
| `accent` | `#EDD53F` | Gold — available for future use |
