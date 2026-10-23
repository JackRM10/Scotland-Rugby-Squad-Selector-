import { grades, positions } from '../../domain/rugby'
import type { Grade, PlayerId, PositionId } from '../../domain/rugby'
export interface Placement { positionId: PositionId; grade: Grade; order: number }
export interface DepthChart { placements: Record<PlayerId, Placement> }
export const emptyChart: DepthChart = { placements: {} }
export type ChartAction =
  | { type: 'place'; playerId: PlayerId; positionId: PositionId; grade: Grade; index?: number }
  | { type: 'remove'; playerId: PlayerId }
  | { type: 'reorder'; playerId: PlayerId; direction: -1 | 1 }
export function selectLane(state: DepthChart, positionId: PositionId, grade: Grade) {
  return Object.entries(state.placements)
    .filter(([, p]) => p.positionId === positionId && p.grade === grade)
    .sort((a, b) => a[1].order - b[1].order).map(([id]) => id)
}
export function selectCounts(state: DepthChart, selected: readonly PositionId[]) {
  const counts: Record<Grade, number> = { S: 0, A: 0, B: 0, C: 0, UP: 0 }
  for (const p of Object.values(state.placements)) {
    if (selected.includes(p.positionId)) counts[p.grade]++
  }
  return counts
}
export function chartReducer(state: DepthChart, action: ChartAction): DepthChart {
  const current = state.placements[action.playerId]
  if (action.type === 'reorder') {
    if (!current) return state
    const lane = selectLane(state, current.positionId, current.grade)
    const index = lane.indexOf(action.playerId)
    const next = index + action.direction
    if (next < 0 || next >= lane.length) return state
    const placements = { ...state.placements }
    ;[lane[index], lane[next]] = [lane[next], lane[index]]
    lane.forEach((id, order) => { placements[id] = { ...placements[id], order } })
    return { placements }
  }
  if (action.type === 'place' && (!positions.some((p) => p.id === action.positionId) || !grades.some((g) => g.id === action.grade))) return state
  const placements = { ...state.placements }
  delete placements[action.playerId]
  if (current) selectLane({ placements }, current.positionId, current.grade).forEach((id, order) => {
    placements[id] = { ...placements[id], order }
  })
  if (action.type === 'place') {
    const lane = selectLane({ placements }, action.positionId, action.grade)
    const sameLane = current?.positionId === action.positionId && current.grade === action.grade
    const requested = action.index ?? (sameLane ? current.order : lane.length)
    const index = Number.isFinite(requested) ? Math.max(0, Math.min(lane.length, Math.trunc(requested))) : lane.length
    lane.splice(index, 0, action.playerId)
    lane.forEach((id, order) => { placements[id] = { positionId: action.positionId, grade: action.grade, order } })
  }
  return { placements }
}
