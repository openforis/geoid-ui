'use client'

import { useRef, useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ZoneContent, zoneClassName } from '@/components/ui/zone'

interface FileDropZoneProps {
  accept: string
  fileName?: string
  onFile: (file: File) => void
  formats?: string
  disabled?: boolean
  className?: string
}

export function FileDropZone({ accept, fileName, onFile, formats, disabled, className }: FileDropZoneProps) {
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
      className={cn(zoneClassName(!!fileName, isDrag), className)}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        disabled={disabled}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f) }}
      />
      <ZoneContent
        icon={UploadCloud}
        action="Click to upload"
        rest="or drag & drop"
        badge={fileName}
        hint={fileName ? undefined : formats}
      />
    </div>
  )
}
