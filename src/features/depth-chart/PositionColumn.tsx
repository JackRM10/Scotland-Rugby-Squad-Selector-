import { useState } from 'react'
import type { Dispatch } from 'react'
import { players } from '../../data/players'
import { grades, positions } from '../../domain/rugby'
import type { PositionId } from '../../domain/rugby'
import { PlayerIdentity } from '../player-pool/PlayerIdentity'
import { PlacementForm } from './PlacementForm'
import { selectCounts, selectLane } from './state'
import type { ChartAction, DepthChart } from './state'

export function PositionColumn({ positionId, chart, dispatch }: { positionId: PositionId; chart: DepthChart; dispatch: Dispatch<ChartAction> }) {
  const [editing, setEditing] = useState<string | null>(null)
  const position = positions.find((p) => p.id === positionId)!
  const counts = selectCounts(chart, [positionId])
  return <section className="panel min-w-0 overflow-hidden" aria-labelledby={`position-${positionId}`}>
    <header className="flex items-center gap-3 border-b border-slate-200 p-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-navy font-bold text-white">{positionId}</span><div><h3 id={`position-${positionId}`} className="font-bold text-navy">{position.name}</h3><p className="text-xs text-slate-500">{Object.values(counts).reduce((a, b) => a + b, 0)} players ranked</p></div></header>
    <div className="space-y-3 p-3">{grades.map((grade) => {
      const lane = selectLane(chart, positionId, grade.id)
      return <section key={grade.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3" aria-label={`${position.name}: ${grade.id} grade`}>
        <div className="mb-3 flex items-center justify-between"><span title={grade.description} className={`rounded-md border px-2.5 py-1 text-sm font-extrabold ${grade.style}`}>{grade.id}</span><span className="text-xs text-slate-500">{lane.length} players</span></div>
        <ol className="space-y-2">{lane.map((id, index) => {
          const player = players.find((p) => p.id === id)!
          return <li key={id} className="rounded-lg border border-slate-200 bg-white p-3"><p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Rank {index + 1}</p><PlayerIdentity player={player} />
            <div className="mt-3 flex flex-wrap gap-1"><button className="control px-2 py-1" disabled={index === 0} aria-label={`Move ${player.name} up`} onClick={() => dispatch({ type: 'reorder', playerId: id, direction: -1 })}>↑</button><button className="control px-2 py-1" disabled={index === lane.length - 1} aria-label={`Move ${player.name} down`} onClick={() => dispatch({ type: 'reorder', playerId: id, direction: 1 })}>↓</button><button className="control px-2 py-1 text-xs" aria-expanded={editing === id} aria-label={`Edit placement for ${player.name}`} onClick={() => setEditing(editing === id ? null : id)}>Move</button><button className="control px-2 py-1 text-xs" aria-label={`Remove ${player.name}`} onClick={() => dispatch({ type: 'remove', playerId: id })}>Remove</button></div>
            {editing === id && <PlacementForm player={player} placement={chart.placements[id]} dispatch={dispatch} onDone={() => setEditing(null)} />}
          </li>
        })}</ol>
        {!lane.length && <p className="rounded-lg border border-dashed border-slate-300 px-3 py-5 text-center text-xs text-slate-400">Assign a player from the pool</p>}
      </section>
    })}</div>
  </section>
}
