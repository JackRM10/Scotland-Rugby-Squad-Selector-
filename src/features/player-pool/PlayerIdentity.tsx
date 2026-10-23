import type { Player } from '../../domain/rugby'
export function PlayerIdentity({ player }: { player: Player }) {
  return <div className="flex min-w-0 items-center gap-3">
    <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-navy">{player.name.split(' ').map((part) => part[0]).join('')}</span>
    <div className="min-w-0"><p className="font-semibold text-navy">{player.name}</p><p className="text-xs text-slate-500">{player.club} · #{player.primaryPosition}</p></div>
  </div>
}
