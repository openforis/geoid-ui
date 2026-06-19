'use client'

import { Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ConverterActionsProps {
  actionLabel: string
  disabled?: boolean
  isLoading?: boolean
  onAction: () => void
  onClear: () => void
}

export function ConverterActions({
  actionLabel,
  disabled,
  isLoading,
  onAction,
  onClear,
}: ConverterActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button type="button" variant="outline" onClick={onClear} disabled={isLoading}>
        <Trash2 className="size-3.5" />
        Clear
      </Button>
      <Button
        type="button"
        className="flex-1"
        disabled={disabled || isLoading}
        onClick={onAction}
      >
        {isLoading ? <Loader2 className="size-4 animate-spin" /> : null}
        {isLoading ? `${actionLabel}…` : actionLabel}
      </Button>
    </div>
  )
}
