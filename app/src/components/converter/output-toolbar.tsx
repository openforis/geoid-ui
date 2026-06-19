'use client'

import { ArrowLeft, Copy, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface OutputToolbarProps {
  onStartOver: () => void
  onCopy: () => void
  onDownload: () => void
  downloadLabel?: string
}

export function OutputToolbar({
  onStartOver,
  onCopy,
  onDownload,
  downloadLabel = 'Download',
}: OutputToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button type="button" variant="outline" size="sm" onClick={onStartOver}>
        <ArrowLeft className="size-3.5" />
        Start over
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={onCopy}>
        <Copy className="size-3.5" />
        Copy
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={onDownload}>
        <Download className="size-3.5" />
        {downloadLabel}
      </Button>
    </div>
  )
}
