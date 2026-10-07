'use client'

import { Check, Crosshair, Hand, PencilLine, Plus, Trash2, Undo2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ringAreaHa, type LatLng, type ShapeIssue } from '@/lib/draw/geometry'

const ISSUE_MESSAGES: Record<ShapeIssue, string> = {
  open: 'Add one more point to close the area.',
  crossing: 'The boundary crosses itself. Move or remove a point.',
  flat: 'This shape has no area. Move the points apart.',
}

interface DrawActionsProps {
  vertices: LatLng[]
  issue: ShapeIssue | null
  hasShapes: boolean
  ready: boolean
  drawing: boolean
  crosshair: boolean
  canUndo: boolean
  canUse: boolean
  onDrawingChange: (drawing: boolean) => void
  onAddShape: () => void
  onUndo: () => void
  onDelete: () => void
  onUse: () => void
  onCrosshairChange: (show: boolean) => void
}

export function DrawActions({
  vertices,
  issue,
  hasShapes,
  ready,
  drawing,
  crosshair,
  canUndo,
  canUse,
  onDrawingChange,
  onAddShape,
  onUndo,
  onDelete,
  onUse,
  onCrosshairChange,
}: DrawActionsProps) {
  const count = vertices.length

  const status = (): [message: string, invalid: boolean] => {
    if (!drawing) return ['Pan and zoom to your area, then start drawing.', false]
    if (count === 0) {
      return [hasShapes ? 'Click or tap a shape to edit it, or the map to start a new one.' : 'Click or tap the map to add a point.', false]
    }
    if (count === 1) return ['Single point. Add more points to trace a boundary, or tap the point to remove it.', false]
    if (issue) return [ISSUE_MESSAGES[issue], issue !== 'open']
    const area = ringAreaHa(vertices).toLocaleString(undefined, { maximumFractionDigits: 2 })
    return [`${count} points · ${area} ha · drag to adjust, tap to remove`, false]
  }

  const [message, invalid] = status()

  return (
    <div className="flex shrink-0 flex-col gap-2 border-t border-border bg-surface px-4 py-3">
      {/* Room for two lines, so a rewrapping status doesn't resize the map under the crosshair. */}
      <div className="flex min-h-9 items-center justify-between gap-3">
        <p aria-live="polite" className={cn('text-[12px]', invalid ? 'text-destructive' : 'text-text-muted')}>{message}</p>

        {drawing && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-pressed={crosshair}
            onClick={() => onCrosshairChange(!crosshair)}
          >
            <Crosshair className="size-3.5" />
            Crosshair
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center [&>*]:w-full sm:[&>*]:w-auto sm:[&>*:last-child]:flex-auto">
        <Button type="button" variant="outline" onClick={() => onDrawingChange(!drawing)} disabled={!ready}>
          {drawing ? <Hand className="size-3.5" /> : <PencilLine className="size-3.5" />}
          {drawing ? 'Stop drawing' : 'Start drawing'}
        </Button>

        <div className="flex gap-2 max-sm:[&>*]:flex-1">
          <Button type="button" variant="outline" onClick={onAddShape} disabled={count === 0 || issue !== null}>
            <Plus className="size-3.5" />
            New shape
          </Button>

          <Button type="button" variant="outline" onClick={onUndo} disabled={!canUndo}>
            <Undo2 className="size-3.5" />
            Undo
          </Button>

          <Button type="button" variant="outline" onClick={onDelete} disabled={count === 0}>
            <Trash2 className="size-3.5" />
            Delete
          </Button>
        </div>

        <Button type="button" onClick={onUse} disabled={!canUse}>
          <Check className="size-4" />
          Use shapes
        </Button>
      </div>
    </div>
  )
}
