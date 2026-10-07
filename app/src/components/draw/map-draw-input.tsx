'use client'

import { useMemo, useState } from 'react'
import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { controlFocus } from '@/components/ui/styles'
import { ZoneContent, zoneClassName } from '@/components/ui/zone'
import { parseFeatures, type SourceFeature } from '@/lib/draw/geojson'
import type { MapConfig } from '@/lib/server/env'
import { DrawDialog } from './draw-dialog'

function hintFor(features: SourceFeature[] | null, maxFeatures: number): string {
  if (!features) return 'Invalid GeoJSON'
  if (features.length > maxFeatures) return `Too many for the map (max ${maxFeatures})`
  return features.length > 0 ? 'Click to edit on the map' : 'Polygons · points'
}

interface MapDrawInputProps {
  value: string
  onChange: (value: string) => void
  mapConfig: MapConfig
}

export function MapDrawInput({ value, onChange, mapConfig }: MapDrawInputProps) {
  const features = useMemo(() => parseFeatures(value), [value])
  const [editing, setEditing] = useState<SourceFeature[] | null>(null)
  const count = features?.length ?? 0
  const { maxFeatures, cartoKey } = mapConfig

  return (
    <>
      <button
        type="button"
        onClick={() => setEditing(features)}
        disabled={!features || count > maxFeatures}
        className={cn(controlFocus, zoneClassName(count > 0), 'disabled:pointer-events-none disabled:opacity-50')}
      >
        <ZoneContent
          icon={MapPin}
          action="Click to draw"
          rest="on the map"
          badge={count > 0 ? `${count} feature${count === 1 ? '' : 's'}` : undefined}
          hint={hintFor(features, maxFeatures)}
        />
      </button>

      {editing && (
        <DrawDialog
          features={editing}
          cartoKey={cartoKey}
          onConfirm={(geojson) => {
            onChange(geojson)
            setEditing(null)
          }}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  )
}
