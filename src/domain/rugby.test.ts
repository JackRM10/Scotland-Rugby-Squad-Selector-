import { expect, it } from 'vitest'
import { grades, positions, presets } from './rugby'
import { players } from '../data/players'

it('defines each position exactly once, with complete preset coverage', () => {
  expect(positions.map((p) => p.id)).toEqual(Array.from({ length: 15 }, (_, i) => i + 1))
  expect(presets.flatMap((p) => p.positions).sort((a, b) => a - b)).toEqual(positions.map((p) => p.id))
  expect(grades.map((g) => g.id)).toEqual(['S', 'A', 'B', 'C', 'UP'])
})

it('loads unique, explicitly labelled sample players with valid positions', () => {
  expect(players.length).toBeGreaterThan(0)
  expect(new Set(players.map((p) => p.id)).size).toBe(players.length)
  expect(players.every((p) => p.sample && positions.some((position) => position.id === p.primaryPosition))).toBe(true)
})
