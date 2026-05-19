# voyo

Mobile-first travel planning app. Visualise your itinerary day by day on an interactive map, check off stops as you go, and pick up exactly where you left off.

## Stack

- **Preact** + TypeScript
- **Tailwind CSS v4** — design tokens, utility-first
- **Leaflet** + CartoDB Positron — minimalist map tiles
- **Vite** — build tool
- **Biome** — linter + formatter

## Getting started

```bash
npm install
npm run dev
```

Access code: `ADMIN`

## Features

- Auth gate with access code
- Day picker — 5 days, 37 POIs for London
- Interactive map with color-coded markers
  - **Cyan** = next stop
  - **Teal** = done
  - **Dark** = upcoming
- Tap a marker → map flies to it, list scrolls to that step
- Check off a step → map updates in real time
- Progress persisted via `localStorage`

## Project structure

```
src/
  app.tsx              # auth guard
  types.ts             # Trip / Day / Step interfaces
  data/london.ts       # London trip data (5 days)
  hooks/useProgress.ts # localStorage persistence
  pages/
    AuthPage.tsx
    TripPage.tsx
  components/
    Header.tsx          # fixed nav + day picker
    MapView.tsx         # Leaflet map
    StepItem.tsx        # single POI row with SVG icons
    StepList.tsx        # day itinerary list
```

## Color palette

| Token | Hex | Role |
|-------|-----|------|
| `primary` | `#35F0F0` | Cyan — active state, CTA |
| `ink` | `#0B2027` | Deep teal — text, header |
| `paper` | `#FFFFFE` | White — background |
| `sand` | `#5A9FA8` | Mid teal — secondary text |
| `accent` | `#EDD53F` | Gold — available for future use |
