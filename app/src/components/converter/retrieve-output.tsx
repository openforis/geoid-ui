'use client'

import { Textarea } from '@/components/ui/textarea'
import { OutputToolbar } from '@/components/converter/output-toolbar'
import { copyText, downloadBlob, timestampFilename } from '@/lib/utils/download'

interface RetrieveOutputProps {
  geojson: Record<string, unknown>
  onStartOver: () => void
}

function featureCount(geojson: Record<string, unknown>): number | null {
  if (geojson.type !== 'FeatureCollection' || !Array.isArray(geojson.features)) {
    return null
  }
  return geojson.features.length
}

export function RetrieveOutput({ geojson, onStartOver }: RetrieveOutputProps) {
  const text = JSON.stringify(geojson, null, 2)
  const count = featureCount(geojson)
  const title =
    count === null
      ? 'GeoJSON retrieved'
      : count === 1
        ? '1 feature retrieved'
        : `${count} features retrieved`

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-text-primary">{title}</h2>
        <OutputToolbar
          onStartOver={onStartOver}
          onCopy={() => copyText(text).catch(() => {})}
          onDownload={() =>
            downloadBlob(
              new Blob([text], { type: 'application/geo+json' }),
              timestampFilename('geojson'),
            )
          }
          downloadLabel="Download .geojson"
        />
      </div>
      <Textarea
        readOnly
        value={text}
        aria-label="Retrieved GeoJSON"
        className="min-h-0 flex-1 font-mono"
      />
    </div>
  )
}
