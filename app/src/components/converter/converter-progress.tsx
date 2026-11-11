'use client'

import { Loader2 } from 'lucide-react'
import { cardBase } from '@/components/ui/styles'

export function ConverterProgress({ title, description }: { title: string; description: string }) {
  return (
    <div className={`${cardBase} flex flex-col items-center gap-3 p-6 text-center`}>
      <Loader2 className="size-9 animate-spin text-accent-green-dim" />
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-text-primary">{title}</h2>
        <p className="text-[13px] leading-relaxed text-text-muted">{description}</p>
      </div>
    </div>
  )
}
