import records from './players.json'
import { positions } from '../domain/rugby'
import type { Player } from '../domain/rugby'
const ids = new Set<string>()
export const players: Player[] = records.map((record) => {
  if (!record.id || ids.has(record.id) || !record.name || !record.club || record.sample !== true ||
    !positions.some((position) => position.id === record.primaryPosition) ||
    !record.secondaryPositions.every((id) => positions.some((position) => position.id === id))) {
    throw new Error('Invalid sample player catalogue')
  }
  ids.add(record.id)
  return record as Player
})
