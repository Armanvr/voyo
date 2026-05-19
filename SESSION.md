# Session — 2026-05-19

## Contexte

Construction de **Voyo** from scratch : une web app mobile-first de planification de voyage, à partir d'un planning Londres fourni en JSON.

## Ce qu'on a construit

### Archi
- Preact + TypeScript + Tailwind CSS v4 + Vite + Leaflet
- 2 vues (state-based, pas de router) : `AuthPage` + `TripPage`
- Hook `useProgress` → localStorage, shape `Record<string, number[]>`
- Données Londres : 5 jours, 37 étapes, importées comme JSON typé

### Flow de développement
1. **Brainstorming** → design validé avant tout code
2. **Plan** → 10 tâches détaillées avec code complet dans `docs/superpowers/plans/`
3. **Subagent-Driven Development** → 1 subagent par tâche, double review (spec + qualité) après chaque
4. **Finishing branch** → lint, gitignore, options de merge

### Bugs corrigés en review
- `retour` steps affichaient des checkboxes mais n'étaient pas trackées → exclues du rendu
- `fitBounds` se déclenchait à chaque toggle → isolé sur changement de jour uniquement
- Side effect dans render body (`onScrollTo`) → déplacé en `useEffect`
- `node_modules` non gitignorés → `.gitignore` corrigé

## Iterations post-MVP

### Palette London
- Ancienne palette générique (bleu, taupe) → palette "London" Coolors
- `#35F0F0` cyan vif (primary), `#0B2027` teal foncé (ink), `#5A9FA8` (sand), `#EDD53F` (accent)
- Tiles Leaflet : OpenStreetMap → **CartoDB Positron** (minimaliste, blanc)

### Redesign Uber
- AuthPage : fond noir, input underline, "voyo" en cyan géant
- Header : "voyo" en primary, select uppercase
- StepItems : checkbox carrée, SVG icons stroke, heure en mono/cyan, notes en texte brut
- StepList : hiérarchie bolder (jour + thème)
- Emoji → SVG minimalistes (culture, food, transport, pin…)
- Marker click → `map.flyTo()` animé
- Blush : `#C8F5F5` (invisible) → `#2A6670` (lisible)

## Décisions techniques notables

| Décision | Raison |
|----------|--------|
| State-based routing (pas de router) | Scope à 2 vues, zero overhead |
| `useProgress` avec string keys | JSON.stringify/parse ne supporte pas Set |
| `fitBounds` dans effect séparé | Évite le snap map à chaque checkbox |
| `onScrollTo` via ref callback | Évite prop drilling d'un imperatif scroll |
| CartoDB Positron | Map minimaliste sans config API key |
| Biome v2 | Linter + formatter all-in-one, fast |

### Multi-pages + DB (v0.3)
- App passe de 2 pages à 4 : Auth → Voyages → Créer → Planner
- `@seald-io/nedb` : DB embarquée persistée dans localStorage
- `db.ts` : wrapper async (init, find, insert, remove) + seed London au premier lancement
- `useProgress(tripId)` : progress namespaced par trip (avant = global)
- `VoyagesPage` : liste tous les voyages, export JSON, suppression (trips demo non supprimables)
- `CreerPage` : formulaire dynamique — destination, dates, hôtel, jours (add/remove), étapes par jour (add/remove)
- `BottomNav` : 2 onglets (Voyages / Créer), masqué dans le planner
- Step icon → `map.flyTo()` (sens inverse : liste → carte)
- Header : bouton retour + nom du trip dans le planner

## Décisions techniques notables

| Décision | Raison |
|----------|--------|
| State-based routing (pas de router) | Scope à 4 vues, zero overhead |
| `useProgress(tripId)` namespace | Évite collision progress entre trips |
| `fitBounds` dans effect séparé | Évite le snap map à chaque checkbox |
| `onScrollTo` via ref callback | Évite prop drilling d'un impératif scroll |
| `focusOrdre` prop sur MapView | Déclaratif, un seul state → flyTo sans ref exposed |
| nedb `inMemoryOnly=false` browser | localStorage auto via browser bundle de @seald-io/nedb |
| CartoDB Positron | Map minimaliste sans config API key |
| Biome v2 | Linter + formatter all-in-one, fast |

## Fichiers clés

```
src/app.tsx                   routing + auth guard + DB init
src/db.ts                     nedb wrapper
src/hooks/useProgress.ts      progress par trip via localStorage
src/components/MapView.tsx    Leaflet + flyTo (marker ET step click)
src/components/StepItem.tsx   SVG icons + Uber UI + onStepClick
src/components/BottomNav.tsx  navigation bas de page
src/pages/AuthPage.tsx        dark landing
src/pages/VoyagesPage.tsx     liste trips
src/pages/CreerPage.tsx       formulaire création
src/pages/TripPage.tsx        planner (map + liste)
docs/superpowers/plans/       plan d'implémentation initial
docs/superpowers/specs/       spec design
```
