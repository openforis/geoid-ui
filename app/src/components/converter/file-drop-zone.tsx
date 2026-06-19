'use client'

import { useRef, useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { cn } from '@/lib/utils'
import { controlRounded } from '@/components/ui/styles'

interface FileDropZoneProps {
  accept: string
  fileName?: string
  onFile: (file: File) => void
  formats?: string
  compact?: boolean
  disabled?: boolean
  className?: string
}

export function FileDropZone({
  accept,
  fileName,
  onFile,
  formats,
  compact = false,
  disabled,
  className,
}: FileDropZoneProps) {
  const [isDrag, setIsDrag] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDrag(true) }}
      onDragLeave={() => setIsDrag(false)}
      onDrop={(e) => { e.preventDefault(); setIsDrag(false); const f = e.dataTransfer.files[0]; if (f) onFile(f) }}
      className={cn(
        `border-[1.5px] border-dashed ${controlRounded} flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors`,
        compact ? 'flex-1 p-5' : 'flex-1 min-h-52 p-8',
        fileName
          ? 'border-accent-green-dim bg-accent-green/15'
          : isDrag
            ? 'border-accent-green bg-accent-green/12'
            : 'border-border bg-surface hover:border-accent-green-dim hover:bg-accent-green/10',
        className,
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        disabled={disabled}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f) }}
      />
      <div className={cn(
        `size-10 ${controlRounded} flex items-center justify-center mb-1`,
        fileName ? 'bg-accent-green/25 text-accent-green-dim' : 'bg-surface-raised text-text-dim'
      )}>
        <UploadCloud className="size-5" />
      </div>
      {fileName ? (
        <span className={cn(
          'text-[12px] font-medium text-accent-green-dim bg-accent-green/15 px-2.5 py-0.5 rounded-full',
          compact && 'text-center'
        )}>
          {fileName}
        </span>
      ) : (
        <>
          <span className={cn('font-medium text-text-primary text-center', compact ? 'text-[13px]' : 'text-[14px]')}>
            <span className="text-accent-green-dim font-semibold">Click to upload</span> or drag &amp; drop
          </span>
          {formats && <span className="text-[12px] text-text-muted">{formats}</span>}
        </>
      )}
    </div>
  )
}
