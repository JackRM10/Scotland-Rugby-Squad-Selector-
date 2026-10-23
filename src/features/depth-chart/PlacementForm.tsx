import { useState } from 'react'
import type { Dispatch } from 'react'
import { grades, positions } from '../../domain/rugby'
import type { Grade, Player, PositionId } from '../../domain/rugby'
import type { ChartAction, Placement } from './state'

export function PlacementForm({ player, placement, dispatch, onDone }: {
  player: Player; placement?: Placement; dispatch: Dispatch<ChartAction>; onDone: () => void
}) {
  const [positionId, setPositionId] = useState<PositionId>(placement?.positionId ?? player.primaryPosition)
  const [grade, setGrade] = useState<Grade>(placement?.grade ?? 'B')
  return <form className="mt-3 space-y-2 border-t border-slate-200 pt-3" onSubmit={(event) => {
    event.preventDefault()
    dispatch({ type: 'place', playerId: player.id, positionId, grade })
    onDone()
  }}>
    <label className="block text-xs font-semibold">Position for {player.name}
      <select className="control mt-1 w-full" value={positionId} onChange={(event) => setPositionId(Number(event.target.value) as PositionId)}>
        {positions.map((p) => <option key={p.id} value={p.id}>{p.id}. {p.name}</option>)}
      </select>
    </label>
    <label className="block text-xs font-semibold">Grade for {player.name}
      <select className="control mt-1 w-full" value={grade} onChange={(event) => setGrade(event.target.value as Grade)}>
        {grades.map((g) => <option key={g.id} value={g.id}>{g.id} — {g.description}</option>)}
      </select>
    </label>
    <p className="text-xs text-slate-500">Any position is allowed. Changes move this player's existing assignment.</p>
    <div className="flex flex-wrap gap-2"><button className="rounded-lg bg-navy px-3 py-2 text-white" type="submit">{placement ? 'Save move' : 'Assign player'}</button><button className="control" type="button" onClick={onDone}>Cancel</button></div>
  </form>
}
