'use client'

import { Textarea } from '@/components/ui/textarea'
import { OutputToolbar } from '@/components/converter/output-toolbar'
import { copyText, downloadBlob, timestampFilename } from '@/lib/utils/download'

interface RegisterOutputProps {
  geoids: string[]
  collection: string
  onStartOver: () => void
}

export function RegisterOutput({ geoids, collection, onStartOver }: RegisterOutputProps) {
  const text = geoids.join('\n')
  const count = geoids.length
  const label = count === 1 ? 'Geo ID' : 'Geo IDs'

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-text-primary">
          {count} {label} registered
        </h2>
        <OutputToolbar
          onStartOver={onStartOver}
          onCopy={() => copyText(text).catch(() => {})}
          onDownload={() =>
            downloadBlob(
              new Blob([text], { type: 'text/plain;charset=utf-8' }),
              timestampFilename('txt', 'geoids'),
            )
          }
          downloadLabel="Download .txt"
        />
      </div>
      <p className="text-[13px] text-text-muted">
        Collection &ldquo;{collection}&rdquo;
      </p>
      <Textarea
        readOnly
        value={text}
        aria-label="Registered Geo IDs"
        className="min-h-0 flex-1 font-mono"
      />
    </div>
  )
}
