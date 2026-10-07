'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Crosshair } from 'lucide-react'
import type { LocationEvent, Map as LeafletMap } from 'leaflet'
import { Button, CloseButton } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { shapeIssue, type LatLng } from '@/lib/draw/geometry'
import { toGeoJson, toShapes, type SourceFeature } from '@/lib/draw/geojson'
import { DrawActions } from './draw-actions'
import type { LocationFix } from './draw-map'
import { LocatePanel, type LocateStatus } from './locate-panel'
import { useShapes } from './use-shapes'

const LOCATE_ZOOM = 17

function MapLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-bg">
      <span className="text-[11px] tracking-[0.04em] text-text-dim">Loading…</span>
    </div>
  )
}

const DrawMap = dynamic(() => import('./draw-map').then((m) => m.DrawMap), {
  ssr: false,
  loading: MapLoading,
})

interface DrawDialogProps {
  features: SourceFeature[]
  cartoKey?: string
  onConfirm: (geojson: string) => void
  onClose: () => void
}

export function DrawDialog({ features, cartoKey, onConfirm, onClose }: DrawDialogProps) {
  const [{ shapes: initialShapes, locked }] = useState(() => toShapes(features))
  const { shapes, active, add, remove, startMove, move, select, removeActive, undo, canUndo } = useShapes(initialShapes)
  const [map, setMap] = useState<LeafletMap | null>(null)
  const [drawing, setDrawing] = useState(initialShapes.length > 0)
  const [crosshair, setCrosshair] = useState(false)
  const [locateStatus, setLocateStatus] = useState<LocateStatus>('idle')
  const [fix, setFix] = useState<LocationFix | null>(null)

  useEffect(() => {
    if (!map) return
    const found = (e: LocationEvent) => {
      setFix({ point: e.latlng, accuracy: e.accuracy })
      setLocateStatus('idle')
    }
    const failed = () => setLocateStatus('failed')
    map.on('locationfound', found)
    map.on('locationerror', failed)
    return () => {
      map.off('locationfound', found)
      map.off('locationerror', failed)
    }
  }, [map])

  const locate = () => {
    if (!map) return
    setLocateStatus('locating')
    map.locate({ setView: true, maxZoom: LOCATE_ZOOM, enableHighAccuracy: true, timeout: 10_000 })
  }

  const goTo = (point: LatLng) => {
    map?.setView(point, LOCATE_ZOOM)
    setLocateStatus('idle')
  }

  const changeDrawing = (next: boolean) => {
    setDrawing(next)
    if (next) map?.getContainer().focus()
  }

  const addAtCenter = () => {
    if (map) add(map.getCenter())
  }

  const requestClose = () => {
    if (!canUndo || window.confirm('Discard your map changes?')) onClose()
  }

  const vertices = active?.vertices ?? []
  const issue = shapeIssue(vertices)
  const canUse = canUndo && !issue && shapes.length + locked.length > 0

  return (
    <Dialog open onOpenChange={(nextOpen) => { if (!nextOpen) requestClose() }}>
      <DialogContent
        showCloseButton={false}
        className="flex h-[calc(100%-2rem)] max-h-[720px] flex-col gap-0 overflow-hidden p-0 sm:max-w-[880px]"
      >
        <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-4 py-2.5">
          <div className="flex min-w-0 items-baseline gap-2">
            <DialogTitle className="truncate text-sm">Draw on map</DialogTitle>
            {locked.length > 0 && (
              <span className="truncate text-[12px] text-text-muted">Dashed features are read-only</span>
            )}
          </div>
          <CloseButton type="button" onClick={requestClose} />
        </header>

        <LocatePanel ready={map !== null} status={locateStatus} onLocate={locate} onGoTo={goTo} />

        <div className="relative flex-1 overflow-hidden">
          <DrawMap
            shapes={shapes}
            active={active}
            canSelect={!issue}
            locked={locked}
            drawing={drawing}
            fix={fix}
            cartoKey={cartoKey}
            onMap={setMap}
            onAddVertex={add}
            onRemoveVertex={remove}
            onMoveStart={startMove}
            onMove={move}
            onSelect={select}
          />

          {drawing && crosshair && (
            <>
              <div className="draw-crosshair pointer-events-none absolute left-1/2 top-1/2 z-10 size-7 -translate-x-1/2 -translate-y-1/2" />
              <Button
                type="button"
                className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 shadow-xl"
                onClick={addAtCenter}
                disabled={!map}
              >
                <Crosshair className="size-4" />
                Add at center
              </Button>
            </>
          )}
        </div>

        <DrawActions
          vertices={vertices}
          issue={issue}
          hasShapes={shapes.length > 0}
          ready={map !== null}
          drawing={drawing}
          crosshair={crosshair}
          canUndo={canUndo}
          canUse={canUse}
          onDrawingChange={changeDrawing}
          onAddShape={() => select(null)}
          onUndo={undo}
          onDelete={removeActive}
          onUse={() => onConfirm(toGeoJson(features, shapes))}
          onCrosshairChange={setCrosshair}
        />
      </DialogContent>
    </Dialog>
  )
}
