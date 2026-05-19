# Voyo – Travel Planner Design

**Date:** 2026-05-19  
**Stack:** Preact + TypeScript + Tailwind CSS v4 + Vite + Leaflet

---

## Overview

Mobile-first travel planning web app. Two views: auth gate + trip planner. London trip data baked in from JSON. Step-by-step POI progression with live map sync.

---

## Architecture

### Views (state-based, no router)
- `AuthView` — code input, `ADMIN` unlocks app, persists `voyo_auth` in localStorage
- `TripView` — main app, requires auth

### File Structure
```
src/
  app.tsx
  types.ts
  data/london.ts
  hooks/useProgress.ts
  pages/AuthPage.tsx
  pages/TripPage.tsx
  components/Header.tsx
  components/MapView.tsx
  components/StepList.tsx
  components/StepItem.tsx
  index.css
```

---

## Data

`src/data/london.ts` exports typed `Trip` object derived from `londres_planning_deplacements.json`.

Types in `src/types.ts`:
```ts
interface Coordonnees { lat: number; lon: number }
interface Transport { mode: string; ligne?: string; trajet?: string; duree_min: number; cout_gbp_par_pers: number }
interface Step { ordre: number; lieu: string; adresse: string; coordonnees: Coordonnees; heure_arrivee?: string; heure_depart?: string; duree_visite_min?: number; duree_min?: number; type: string; gratuit?: boolean; note?: string; transport_depuis_precedent?: Transport }
interface Day { jour: number; date: string; jour_semaine: string; theme: string; depart_hotel: string; retour_hotel?: string; etapes: Step[] }
interface Trip { sejour: { destination: string; hotel: { nom: string; adresse: string; coordonnees: Coordonnees } }; jours: Day[] }
```

---

## State & Persistence

### `useProgress` hook
- localStorage key: `voyo_progress`
- Shape: `Record<number, number[]>` — day index → array of completed step `ordre` values
- Exports: `isCompleted(dayIdx, ordre)`, `toggleStep(dayIdx, ordre)`, `isDayComplete(dayIdx)`

### Auth
- localStorage key: `voyo_auth` = `"1"` when authenticated
- Code: `ADMIN` (hardcoded, case-sensitive)

---

## Components

### `AuthPage`
- Full-screen centered layout
- "Voyo" heading (large, bold, black)
- Single input: `type="text"`, placeholder "Code d'accès"
- Submit button (blue `#1098F7`)
- Wrong code → CSS shake animation, input border turns red briefly
- Correct code → sets localStorage, switches to TripView

### `Header`
- Fixed top, black bg, white "Voyo" wordmark left
- Center: `<select>` day picker (Day 1–5 with theme label)
- Day complete → checkmark badge on option

### `MapView`
- Leaflet + OpenStreetMap tiles
- Container: `h-[40vh]` on mobile
- Markers per day's steps (excluding `depart`/`retour` types)
- Colors: completed = grey `#B89E97`, active (next uncompleted) = blue `#1098F7`, upcoming = black `#000000`
- Auto-fit bounds on day change
- Click marker → scroll to step in list

### `StepList`
- Scrollable list below map
- Groups steps with time, type icon, transport pill
- Each `StepItem`: checkbox left, name + time + note right
- Completed step → strikethrough, reduced opacity
- Active step → left border blue `#1098F7`

### `StepItem`
- Checkbox (custom styled, blue when checked)
- `lieu` + `heure_arrivee`
- Transport pill (mode icon + duration) if `transport_depuis_precedent`
- `note` in small text, blush bg `#DECCCC`
- `gratuit` badge if applicable

---

## Design Tokens

| Name | Hex | Usage |
|------|-----|-------|
| `primary` | `#1098F7` | CTA, active state, checked |
| `ink` | `#000000` | Text, header bg |
| `paper` | `#FFFFFF` | App background |
| `sand` | `#B89E97` | Secondary, transport pills, completed markers |
| `blush` | `#DECCCC` | Cards, note backgrounds, surface |

Defined as CSS custom properties in `index.css`.

---

## Map Library

`leaflet` + `@types/leaflet` installed via npm. Custom `DivIcon` markers (colored circles). Leaflet CSS imported in `index.css`.

---

## Interaction Flow

1. User opens app → AuthPage if not authed
2. Enter `ADMIN` → TripView loads, Day 1 active
3. Day picker → switch day → map re-fits, list scrolls to top
4. Tap checkbox on step → marked done, map marker turns grey, next step marker turns blue
5. All steps done → day badge shows ✓
6. Progress persists across reloads via localStorage
