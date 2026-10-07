import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { controlRounded } from '@/components/ui/styles'

export function zoneClassName(filled: boolean, highlighted = false) {
  return cn(
    `border-[1.5px] border-dashed ${controlRounded} flex flex-1 flex-col items-center justify-center gap-2 p-5 cursor-pointer transition-colors`,
    filled
      ? 'border-accent-green-dim bg-accent-green/15'
      : highlighted
        ? 'border-accent-green bg-accent-green/12'
        : 'border-border bg-surface hover:border-accent-green-dim hover:bg-accent-green/10'
  )
}

interface ZoneContentProps {
  icon: LucideIcon
  action: string
  rest: string
  badge?: string
  hint?: string
}

export function ZoneContent({ icon: Icon, action, rest, badge, hint }: ZoneContentProps) {
  return (
    <>
      <div className={cn(
        `size-10 ${controlRounded} mb-1 flex items-center justify-center`,
        badge ? 'bg-accent-green/25 text-accent-green-dim' : 'bg-surface-raised text-text-dim'
      )}>
        <Icon className="size-5" />
      </div>
      {badge ? (
        <span className="rounded-full bg-accent-green/15 px-2.5 py-0.5 text-center text-[12px] font-medium text-accent-green-dim">
          {badge}
        </span>
      ) : (
        <span className="text-center text-[13px] font-medium text-text-primary">
          <span className="font-semibold text-accent-green-dim">{action}</span>{' '}{rest}
        </span>
      )}
      {hint && <span className="text-center text-[12px] text-text-muted">{hint}</span>}
    </>
  )
}
