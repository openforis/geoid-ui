'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import {
  ArrowLeft,
  Braces,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Map as MapIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/ui/copy-button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { areaHa } from '@/lib/draw/geometry'
import type { MapConfig } from '@/lib/server/env'
import type { ConverterResult } from '@/types/converter'

const GeojsonMap = dynamic(() => import('@/components/draw/geojson-map').then((m) => m.GeojsonMap), {
  ssr: false,
})

const CARD = 'min-h-0 overflow-hidden rounded-sm border border-border'
const TH = 'h-10 border-b border-border bg-surface px-3 text-[10px] font-semibold tracking-[0.08em] text-text-muted uppercase'
const TD = 'border-b border-border px-3 py-2'

interface ResultsViewProps {
  successLabel: string
  failedLabel: string
  result: ConverterResult
  mapConfig: MapConfig
  onStartOver: () => void
  onDownload: () => void
  downloadLabel: string
  copyText?: string
}

export function ResultsView({
  successLabel,
  failedLabel,
  result: { geojson, failed },
  mapConfig,
  onStartOver,
  onDownload,
  downloadLabel,
  copyText,
}: ResultsViewProps) {
  const text = JSON.stringify(geojson, null, 2)
  const { features } = geojson
  const showMap = features.length <= mapConfig.maxFeatures
  const [view, setView] = useState<'map' | 'geojson'>(showMap ? 'map' : 'geojson')
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selected, setSelected] = useState<number | null>(null)

  const rows = [...failed, ...features.map((feature, index) => ({ id: String(feature.id), feature, index }))]
  const pages = Math.ceil(rows.length / rowsPerPage)
  const start = (page - 1) * rowsPerPage

  const select = (index: number | null) => {
    setSelected(index)
    if (index !== null) setPage(Math.floor((failed.length + index) / rowsPerPage) + 1)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-text-primary">
          {features.length} {features.length === 1 ? 'feature' : 'features'} {successLabel}
          {failed.length > 0 && (
            <span className="font-normal text-destructive">
              {' '}
              · {failed.length} {failedLabel}
            </span>
          )}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={onStartOver}>
            <ArrowLeft />
            Start over
          </Button>
          {copyText && (
            <CopyButton text={copyText} variant="outline" size="sm">
              Copy
            </CopyButton>
          )}
          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download />
            {downloadLabel}
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 md:flex-row">
        <div className={`${CARD} flex flex-1 flex-col md:max-w-[50%] md:flex-none`}>
          <div className="min-h-0 flex-1 overflow-auto">
            <table className="w-full border-separate border-spacing-0 text-xs">
              <thead className="sticky top-0">
                <tr>
                  <th className={`${TH} text-left`}>GeoID</th>
                  <th className={`${TH} text-left`}>Type</th>
                  <th className={`${TH} text-right`}>Area (ha)</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(start, start + rowsPerPage).map((row, i) => {
                  if ('reason' in row) {
                    return (
                      <tr key={start + i}>
                        <td className={`${TD} font-mono text-[11px] text-text-muted`}>{row.id}</td>
                        <td colSpan={2} className={`${TD} text-destructive`}>
                          {row.reason}
                        </td>
                      </tr>
                    )
                  }
                  const isSelected = selected === row.index
                  const area = areaHa(row.feature.geometry)
                  return (
                    <tr
                      key={start + i}
                      data-selected={isSelected || undefined}
                      onClick={() => select(isSelected ? null : row.index)}
                      className="group cursor-pointer transition-colors hover:bg-surface data-selected:bg-accent-green/[0.06]"
                    >
                      <td className={cn(TD, 'py-1.5 font-mono text-[11px]', isSelected && 'border-l-2 border-l-accent-green')}>
                        <span className="flex items-center gap-1">
                          {row.id}
                          <CopyButton
                            text={row.id}
                            className="size-6 opacity-0 group-hover:opacity-100 group-data-selected:opacity-100 focus-visible:opacity-100"
                          />
                        </span>
                      </td>
                      <td className={TD}>{row.feature.geometry?.type ?? '—'}</td>
                      <td className={`${TD} text-right tabular-nums`}>{area > 0 ? area.toFixed(2) : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-2 border-t border-border bg-surface px-3 py-2 text-xs text-text-muted">
            <div className="flex items-center gap-1.5">
              Rows
              <Select
                value={String(rowsPerPage)}
                onValueChange={(v) => {
                  if (!v) return
                  setRowsPerPage(Number(v))
                  setPage(1)
                }}
              >
                <SelectTrigger size="sm" className="w-[60px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 25, 50].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <span className="whitespace-nowrap">
              Page {page} of {pages}
            </span>
            <div className="flex items-center justify-end gap-2">
              <span className="whitespace-nowrap">
                {start + 1}–{Math.min(start + rowsPerPage, rows.length)} of {rows.length}
              </span>
              {(
                [
                  ['First page', ChevronsLeft, 1],
                  ['Previous page', ChevronLeft, page - 1],
                  ['Next page', ChevronRight, page + 1],
                  ['Last page', ChevronsRight, pages],
                ] as const
              ).map(([label, Icon, to]) => (
                <Button
                  key={label}
                  variant="outline"
                  size="icon-sm"
                  title={label}
                  disabled={to < 1 || to > pages || to === page}
                  onClick={() => setPage(to)}
                >
                  <Icon />
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className={`${CARD} flex min-w-0 flex-1 flex-col`}>
          <div className="flex h-10 shrink-0 items-center gap-1.5 border-b border-border bg-surface px-1.5">
            <Button size="sm" variant="outline" aria-pressed={view === 'map'} onClick={() => setView('map')}>
              <MapIcon />
              Map
            </Button>
            <Button size="sm" variant="outline" aria-pressed={view === 'geojson'} onClick={() => setView('geojson')}>
              <Braces />
              GeoJSON
            </Button>
            {view === 'geojson' && <CopyButton text={text} className="ml-auto" />}
          </div>

          {view === 'geojson' ? (
            <Textarea
              readOnly
              value={text}
              aria-label="GeoJSON"
              className="min-h-0 flex-1 rounded-none border-0 font-mono"
            />
          ) : showMap ? (
            <div className="relative min-h-0 flex-1">
              <GeojsonMap geojson={geojson} selected={selected} onSelect={select} cartoKey={mapConfig.cartoKey} />
            </div>
          ) : (
            <p className="p-4 text-[13px] text-text-muted">
              The map preview is limited to {mapConfig.maxFeatures} features.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
