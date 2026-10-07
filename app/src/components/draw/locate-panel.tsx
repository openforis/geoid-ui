'use client'

import { useState, type FormEvent } from 'react'
import { ArrowRight, Loader2, LocateFixed } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { parseLatLng, type LatLng } from '@/lib/draw/geometry'

export type LocateStatus = 'idle' | 'locating' | 'failed'

interface LocatePanelProps {
  ready: boolean
  status: LocateStatus
  onLocate: () => void
  onGoTo: (point: LatLng) => void
}

export function LocatePanel({ ready, status, onLocate, onGoTo }: LocatePanelProps) {
  const [coords, setCoords] = useState('')
  const [invalid, setInvalid] = useState(false)
  const locating = status === 'locating'

  const goToCoords = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const point = parseLatLng(coords)
    if (!point) {
      setInvalid(true)
      return
    }
    onGoTo(point)
  }

  return (
    <div className="flex shrink-0 flex-col gap-2 border-b border-border bg-surface px-4 py-2.5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button type="button" variant="outline" onClick={onLocate} disabled={!ready || locating} className="w-full sm:w-auto">
          {locating ? <Loader2 className="size-4 animate-spin" /> : <LocateFixed className="size-4" />}
          {locating ? 'Locating…' : 'Locate me'}
        </Button>

        <form className="flex min-w-0 flex-1 items-center gap-2" onSubmit={goToCoords}>
          <label htmlFor="draw-coordinates" className="sr-only">GPS coordinates</label>
          <Input
            id="draw-coordinates"
            value={coords}
            onChange={(e) => { setCoords(e.target.value); setInvalid(false) }}
            placeholder="GPS: 6.512345, -1.234567"
            aria-invalid={invalid}
            aria-describedby={invalid ? 'draw-coordinates-error' : undefined}
            disabled={!ready}
            spellCheck={false}
            className="min-w-0 flex-1 font-mono text-[12px]"
          />
          <Button type="submit" variant="outline" size="icon" disabled={!ready} aria-label="Go">
            <ArrowRight className="size-4" />
          </Button>
        </form>
      </div>

      {(invalid || status === 'failed') && (
        <p id={invalid ? 'draw-coordinates-error' : undefined} role="alert" className="text-[12px] text-destructive">
          {invalid
            ? 'Enter latitude and longitude, for example 6.512345, -1.234567'
            : 'Could not find your location. Move the map or enter GPS coordinates.'}
        </p>
      )}
    </div>
  )
}
