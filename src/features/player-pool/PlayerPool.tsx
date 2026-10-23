import { useState } from 'react'
import type { Dispatch } from 'react'
import { players } from '../../data/players'
import { positions } from '../../domain/rugby'
import { PlacementForm } from '../depth-chart/PlacementForm'
import type { ChartAction, DepthChart } from '../depth-chart/state'
import { PlayerIdentity } from './PlayerIdentity'

export function PlayerPool({ chart, dispatch }: { chart: DepthChart; dispatch: Dispatch<ChartAction> }) {
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [unassignedOnly, setUnassignedOnly] = useState(false)
  const filtered = players.filter((p) => {
    const position = positions.find((position) => position.id === p.primaryPosition)!
    return `${p.name} ${p.club} ${position.name} ${p.primaryPosition}`.toLowerCase().includes(query.trim().toLowerCase()) && (!unassignedOnly || !chart.placements[p.id])
  })
  return <aside className="panel self-start lg:sticky lg:top-4" aria-labelledby="pool-heading">
    <div className="border-b border-slate-200 p-5"><div className="flex items-center justify-between"><h2 id="pool-heading" className="text-lg font-bold text-navy">Player pool</h2><span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{players.length} players</span></div>
      <p className="mt-1 text-xs text-slate-500">Fictional, unverified sample records</p>
      <label className="mt-4 block text-xs font-semibold" htmlFor="player-search">Search players, clubs or positions</label>
      <input id="player-search" type="search" className="control mt-2 w-full" placeholder="Find a player…" value={query} onChange={(e) => setQuery(e.target.value)} />
      <label className="mt-3 flex items-center gap-2 text-xs"><input type="checkbox" checked={unassignedOnly} onChange={(e) => setUnassignedOnly(e.target.checked)} /> Unassigned players only</label>
    </div>
    <p className="px-5 pt-3 text-xs text-slate-500" role="status">{filtered.length} results</p>
    <ul className="max-h-[36rem] divide-y divide-slate-100 overflow-y-auto p-2">{filtered.map((player) => {
      const placement = chart.placements[player.id]
      return <li key={player.id} className="p-3"><PlayerIdentity player={player} />
        <div className="mt-2 flex items-center justify-between gap-2"><span className="text-xs text-slate-500">{placement ? `Assigned: #${placement.positionId} · ${placement.grade}` : 'Available to assign'}</span><button className="control px-2 py-1 text-xs" aria-label={`${placement ? 'Move' : 'Assign'} ${player.name}`} aria-expanded={editing === player.id} onClick={() => setEditing(editing === player.id ? null : player.id)}>{placement ? 'Move' : '+ Assign'}</button></div>
        {editing === player.id && <PlacementForm player={player} placement={placement} dispatch={dispatch} onDone={() => setEditing(null)} />}
      </li>
    })}</ul>
    {filtered.length === 0 && <p className="p-5 text-sm text-slate-500">No players match. Try another search or show assigned players.</p>}
  </aside>
}
