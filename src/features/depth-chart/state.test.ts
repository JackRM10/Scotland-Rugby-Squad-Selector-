import { describe, expect, it } from 'vitest'
import { chartReducer, emptyChart, selectCounts, selectLane } from './state'
import type { DepthChart } from './state'
import type { Grade, PositionId } from '../../domain/rugby'
const place = (state: DepthChart, playerId: string, positionId: PositionId = 1, grade: Grade = 'A', index?: number) =>
  chartReducer(state, { type: 'place', playerId, positionId, grade, index })

describe('depth chart rules', () => {
  it('keeps a unique assignment and permits any position', () => {
    const initial = place(emptyChart, 'player-1')
    const moved = place(initial, 'player-1', 15, 'UP')
    expect(Object.keys(moved.placements)).toEqual(['player-1'])
    expect(selectLane(moved, 1, 'A')).toEqual([])
    expect(selectLane(moved, 15, 'UP')).toEqual(['player-1'])
    expect(initial.placements['player-1'].positionId).toBe(1)
    expect(emptyChart.placements).toEqual({})
  })
  it('moves grades and normalises source and destination ordering', () => {
    let chart = place(place(place(emptyChart, 'a'), 'b'), 'c')
    chart = place(chart, 'b', 1, 'S')
    expect(selectLane(chart, 1, 'A')).toEqual(['a', 'c'])
    expect(chart.placements.c.order).toBe(1)
    expect(selectLane(chart, 1, 'S')).toEqual(['b'])
    chart = place(chart, 'b', 1, 'A', 1)
    expect(selectLane(chart, 1, 'A')).toEqual(['a', 'b', 'c'])
  })
  it('reorders both directions and respects boundaries', () => {
    const original = place(place(place(emptyChart, 'a'), 'b'), 'c')
    const up = chartReducer(original, { type: 'reorder', playerId: 'b', direction: -1 })
    expect(selectLane(up, 1, 'A')).toEqual(['b', 'a', 'c'])
    const down = chartReducer(up, { type: 'reorder', playerId: 'b', direction: 1 })
    expect(selectLane(down, 1, 'A')).toEqual(['a', 'b', 'c'])
    expect(chartReducer(original, { type: 'reorder', playerId: 'a', direction: -1 })).toBe(original)
    expect(chartReducer(original, { type: 'reorder', playerId: 'c', direction: 1 })).toBe(original)
  })
  it('removes assignments and closes ordering gaps', () => {
    const chart = chartReducer(place(place(emptyChart, 'a'), 'b'), { type: 'remove', playerId: 'a' })
    expect(chart.placements.a).toBeUndefined()
    expect(chart.placements.b.order).toBe(0)
  })
  it('derives all classifications for only the selected positions', () => {
    let chart = place(place(place(emptyChart, 'a', 1, 'S'), 'b', 2, 'UP'), 'c', 15, 'B')
    chart = place(chart, 'd', 1, 'A')
    chart = place(chart, 'e', 2, 'C')
    expect(selectCounts(chart, [1, 2])).toEqual({ S: 1, A: 1, B: 0, C: 1, UP: 1 })
    expect(selectCounts(chart, [15])).toEqual({ S: 0, A: 0, B: 1, C: 0, UP: 0 })
    expect(selectCounts(chart, [])).toEqual({ S: 0, A: 0, B: 0, C: 0, UP: 0 })
  })
  it('keeps independent charts isolated', () => {
    const first = place(emptyChart, 'a', 1)
    const second = place(emptyChart, 'a', 15)
    expect(first.placements.a.positionId).toBe(1)
    expect(second.placements.a.positionId).toBe(15)
  })
  it('clamps insertion indexes and safely ignores unknown reorders', () => {
    const chart = place(place(emptyChart, 'a'), 'b', 1, 'A', -20)
    expect(selectLane(chart, 1, 'A')).toEqual(['b', 'a'])
    expect(selectLane(place(chart, 'c', 1, 'A', 100), 1, 'A')).toEqual(['b', 'a', 'c'])
    expect(chartReducer(chart, { type: 'reorder', playerId: 'missing', direction: 1 })).toBe(chart)
  })
  it('preserves rank when saving unchanged placement controls', () => {
    const chart = place(place(emptyChart, 'a'), 'b')
    expect(selectLane(place(chart, 'a'), 1, 'A')).toEqual(['a', 'b'])
  })
})
