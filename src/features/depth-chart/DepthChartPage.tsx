import { useReducer, useState } from 'react'
import { grades, positions, presets } from '../../domain/rugby'
import type { PositionId } from '../../domain/rugby'
import { PlayerPool } from '../player-pool/PlayerPool'
import { PositionColumn } from './PositionColumn'
import { chartReducer, emptyChart, selectCounts } from './state'

export function DepthChartPage() {
  const [chart, dispatch] = useReducer(chartReducer, emptyChart)
  const [selected, setSelected] = useState<PositionId[]>([1, 2, 3])
  const [notice, setNotice] = useState('')
  const counts = selectCounts(chart, selected)
  const total = Object.keys(chart.placements).length
  function togglePosition(id: PositionId) {
    if (selected.includes(id)) {
      if (selected.length === 1) { setNotice('Keep at least one position selected.'); return }
      setSelected(selected.filter((p) => p !== id))
    } else {
      if (selected.length === 3) { setNotice('Select up to three positions. Deselect a position first, or choose a group preset.'); return }
      setSelected([...selected, id].sort((a, b) => a - b))
    }
    setNotice('')
  }
  return <>
    <a href="#main" className="sr-only focus:not-sr-only focus:block focus:bg-white focus:p-4">Skip to depth chart</a>
    <header className="bg-navy text-white"><div className="mx-auto flex max-w-[1680px] flex-wrap items-center justify-between gap-4 px-5 py-5 lg:px-8"><div className="flex items-center gap-3"><span aria-hidden="true" className="flex size-11 items-center justify-center rounded-xl border border-white/30 text-2xl">✚</span><div><p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-200">Scotland Rugby</p><p className="text-lg font-bold">Squad Selector</p></div></div><span className="rounded-full border border-white/20 px-3 py-1.5 text-xs text-blue-100">Depth chart workspace · Preview</span></div></header>
    <main id="main" className="mx-auto max-w-[1680px] px-4 py-7 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Your selection. Your perspective.</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">Build Scotland's depth chart</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Explore every position. Classify your players. Shape your strongest lineup.</p></div><div className="text-right"><p className="text-3xl font-bold text-navy">{total}<span className="ml-2 text-sm font-normal text-slate-500">players assigned</span></p><p className="mt-1 text-xs text-slate-500">Session only · Refresh clears your chart</p></div></div>
      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900"><strong>Sample catalogue:</strong> All players and clubs are fictional illustrative records. Eligibility and player details are unverified. Grades are your own assessments.</div>
      <section className="panel mb-6 p-4 sm:p-5" aria-labelledby="overview-heading"><div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h2 id="overview-heading" className="font-bold text-navy">All 15 positions</h2><p className="text-xs text-slate-500">Select 1–3 positions to compare below</p></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">{positions.map((position) => {
          const positionCounts = selectCounts(chart, [position.id])
          const count = Object.values(positionCounts).reduce((a, b) => a + b, 0)
          const active = selected.includes(position.id)
          return <button key={position.id} aria-pressed={active} onClick={() => togglePosition(position.id)} className={`flex items-center gap-2 rounded-xl border p-3 text-left transition ${active ? 'border-navy bg-navy text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}><span className={`flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-bold ${active ? 'bg-white/15' : 'bg-slate-100'}`}>{position.id}</span><span className="min-w-0 flex-1 text-xs font-semibold">{position.name}</span><span className={`text-xs ${active ? 'text-blue-200' : 'text-slate-400'}`}>{count}<span className="sr-only"> players</span></span></button>
        })}</div>
      </section>
      <div className="grid items-start gap-6 lg:grid-cols-[290px_minmax(0,1fr)] xl:grid-cols-[310px_minmax(0,1fr)]"><PlayerPool chart={chart} dispatch={dispatch} /><div className="min-w-0">
        <section aria-labelledby="focus-heading"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p className="eyebrow">Position focus</p><h2 id="focus-heading" className="mt-1 text-xl font-bold text-navy">{presets.find((p) => p.positions.join() === selected.join())?.name ?? 'Custom selection'}</h2></div><span className="text-xs text-slate-500">{selected.length} / 3 positions selected</span></div>
          <div className="mb-4 flex flex-wrap gap-2" aria-label="Position group presets">{presets.map((preset) => <button key={preset.name} aria-pressed={preset.positions.join() === selected.join()} onClick={() => { setSelected(preset.positions); setNotice('') }} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${preset.positions.join() === selected.join() ? 'border-navy bg-navy text-white' : 'border-slate-300 bg-white text-slate-600 hover:border-navy'}`}>{preset.name}</button>)}</div>
          <p role="status" className="mb-3 min-h-5 text-xs text-blue-800">{notice}</p>
          <section className="mb-5 rounded-2xl bg-navy p-4 text-white sm:p-5" aria-label="Selected positions classification summary"><div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-semibold">Selected positions · Classification</h3><span className="text-xs text-blue-200">{Object.values(counts).reduce((a, b) => a + b, 0)} players total</span></div><div className="grid grid-cols-5 gap-2">{grades.map((g) => <div key={g.id} className="rounded-xl bg-white/10 p-2 text-center sm:p-3"><span className={`inline-block rounded-md px-2 py-0.5 text-xs font-extrabold ${g.style}`}>{g.id}</span><p className="mt-2 text-2xl font-bold" aria-label={`${g.id}: ${counts[g.id]} players`}>{counts[g.id]}</p></div>)}</div></section>
          <div className={`grid items-start gap-4 ${selected.length === 2 ? 'md:grid-cols-2' : selected.length === 3 ? 'md:grid-cols-2 xl:grid-cols-3' : ''}`}>{selected.map((id) => <PositionColumn key={id} positionId={id} chart={chart} dispatch={dispatch} />)}</div>
        </section>
        <section className="panel mt-6 p-5" aria-labelledby="legend-heading"><h2 id="legend-heading" className="mb-4 text-sm font-bold text-navy">The classification guide</h2><dl className="space-y-3">{grades.map((g) => <div key={g.id} className="flex items-start gap-3"><dt className={`w-10 shrink-0 rounded-md border py-1 text-center text-xs font-bold ${g.style}`}>{g.id}</dt><dd className="pt-1 text-xs leading-5 text-slate-600">{g.description}</dd></div>)}</dl></section>
      </div></div>
      <footer className="mt-8 border-t border-slate-200 pt-5 text-xs text-slate-500">Independent Scotland rugby depth chart · Sample data · Your placements remain in this tab until refresh.</footer>
    </main>
  </>
}
