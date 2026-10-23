export type PositionId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15
export type Grade = 'S' | 'A' | 'B' | 'C' | 'UP'
export type PlayerId = string
export interface Player {
  id: PlayerId
  name: string
  club: string
  primaryPosition: PositionId
  secondaryPositions: PositionId[]
  sample: true
}
export const positions: { id: PositionId; name: string }[] = [
  { id: 1, name: 'Loosehead prop' }, { id: 2, name: 'Hooker' },
  { id: 3, name: 'Tighthead prop' }, { id: 4, name: 'Loosehead lock' },
  { id: 5, name: 'Tighthead lock' }, { id: 6, name: 'Blindside flanker' },
  { id: 7, name: 'Openside flanker' }, { id: 8, name: 'Number eight' },
  { id: 9, name: 'Scrum-half' }, { id: 10, name: 'Fly-half' },
  { id: 11, name: 'Left wing' }, { id: 12, name: 'Inside centre' },
  { id: 13, name: 'Outside centre' }, { id: 14, name: 'Right wing' },
  { id: 15, name: 'Full-back' },
]
export const grades: { id: Grade; description: string; style: string }[] = [
  { id: 'S', description: 'World class', style: 'bg-amber-100 text-amber-900 border-amber-300' },
  { id: 'A', description: 'Good Tier 1 international player', style: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { id: 'B', description: 'Average Tier 1 international player', style: 'bg-blue-100 text-blue-900 border-blue-300' },
  { id: 'C', description: 'Not quite Tier 1, looks good against Tier 2 opposition', style: 'bg-slate-200 text-slate-800 border-slate-300' },
  { id: 'UP', description: 'Upcoming player showing promise at club level, potential to make international step up.', style: 'bg-violet-100 text-violet-900 border-violet-300' },
]
export const presets: { name: string; positions: PositionId[] }[] = [
  { name: 'Front Row', positions: [1, 2, 3] }, { name: 'Second Row', positions: [4, 5] },
  { name: 'Back Row', positions: [6, 7, 8] }, { name: 'Half-backs', positions: [9, 10] },
  { name: 'Centres', positions: [12, 13] }, { name: 'Back Three', positions: [11, 14, 15] },
]
