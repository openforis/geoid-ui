'use client'

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ConverterActionsProps {
  actionLabel: string
  disabled: boolean
  onAction: () => void
  onClear: () => void
}

export function ConverterActions({ actionLabel, disabled, onAction, onClear }: ConverterActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={onClear}>
        <Trash2 className="size-3.5" />
        Clear
      </Button>
      <Button className="flex-1" disabled={disabled} onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  )
}
