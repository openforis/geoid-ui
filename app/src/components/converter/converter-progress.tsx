'use client'

import { CheckCircle2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { cardBase } from '@/components/ui/styles'

interface ConverterProgressProps {
  status: 'processing' | 'complete'
  title: string
  description?: string
  className?: string
}

export function ConverterProgress({
  status,
  title,
  description,
  className,
}: ConverterProgressProps) {
  return (
    <div
      className={cn(
        cardBase,
        'flex flex-col items-center gap-3 p-6 text-center transition-shadow duration-300',
        status === 'complete' && 'border-accent-green/30',
        className,
      )}
    >
      <div className="relative flex size-9 items-center justify-center">
        <Loader2
          className={cn(
            'absolute size-9 animate-spin text-accent-green-dim transition-opacity duration-300',
            status === 'processing' ? 'opacity-100' : 'opacity-0',
          )}
        />
        <CheckCircle2
          className={cn(
            'absolute size-9 text-accent-green-dim transition-all duration-300',
            status === 'complete' ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
          )}
        />
      </div>
      <div className="flex flex-col gap-1 transition-opacity duration-300">
        <h2 className="text-base font-semibold text-text-primary">{title}</h2>
        {description && (
          <p className="text-[13px] leading-relaxed text-text-muted">{description}</p>
        )}
      </div>
    </div>
  )
}
