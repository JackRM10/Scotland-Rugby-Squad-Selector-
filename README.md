# Scotland Rugby Squad Selector

React + TypeScript + Vite depth-chart workspace, styled with Tailwind CSS.

## Run locally

Use Node.js 22.13+ or 24+. The existing ESLint 10 toolchain requires at least Node 22.13 on the Node 22 release line.

```sh
npm install
npm run dev
```

On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`.

## Checks

```sh
npm run lint
npm test
npm run build
npm run preview
```

## Using the chart

- Select one to three positions in the overview, or select a position-group preset.
- Search the player pool by name, club, position name or number.
- Choose Assign, select any position and grade, then confirm.
- Use Move to change a placement, arrow buttons to change order within a lane, or Remove to return a player to the unassigned pool.
- Counts and classification summaries update from actual placements.

All catalogue records are fictional, unverified sample data, not assertions about real players or Scottish eligibility. Edit `src/data/players.json` to maintain the local catalogue. IDs must be stable and unique. Every record is explicitly marked `sample: true`.

## Structure

- `src/domain/rugby.ts`: position, grade and player definitions.
- `src/data/`: local sample JSON and catalogue validation.
- `src/features/depth-chart/`: page, position columns, placement controls, pure reducer and selectors, unit tests.
- `src/features/player-pool/`: searchable pool and shared initials identity.

The chart stores one primary placement per player ID. Player position metadata is advisory; users may assign any position. Independent chart objects can place the same player differently. Optional additional-position ratings are not part of this model.

## Current scope

Phases 1 and 2 only. Charts start empty and live in React state; refreshing clears placements. No browser persistence, drag-and-drop, authentication, Supabase, community statistics, photos, sharing, or World Cup squad selection. The local JSON catalogue is maintained by the project administrator; there is no administrator UI.
