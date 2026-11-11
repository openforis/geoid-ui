'use client'

import { FileTextInput } from '@/components/converter/file-text-input'
import { ConverterActions } from '@/components/converter/converter-actions'
import { ConverterProgress } from '@/components/converter/converter-progress'
import { ResultsView } from '@/components/converter/results-view'
import { useConverterFlow } from '@/components/converter/use-converter-flow'
import { parseGeoIdText, readGeoIdFile } from '@/lib/utils/file-parser'
import { downloadBlob, timestampFilename } from '@/lib/utils/download'
import { retrieveGeojson } from '@/lib/converter/actions'
import type { ConverterStep } from '@/types/converter'
import type { MapConfig } from '@/lib/server/env'

interface GeoidInputProps {
  onError: (message: string) => void
  onStepChange: (step: ConverterStep) => void
  maxFileSize: number
  mapConfig: MapConfig
}

export function GeoidInput({ onError, onStepChange, maxFileSize, mapConfig }: GeoidInputProps) {
  const { step, text, output, flowRef, changeText, reset, run } = useConverterFlow(onStepChange, onError)
  const geoIds = parseGeoIdText(text)

  if (step === 'processing') {
    return (
      <div ref={flowRef} className="flex flex-1 flex-col justify-center gap-4">
        <ConverterProgress
          title="Retrieving GeoJSON"
          description={`Resolving ${geoIds.length} GeoID${geoIds.length === 1 ? '' : 's'}.`}
        />
      </div>
    )
  }

  if (step === 'result' && output) {
    return (
      <div ref={flowRef} className="flex min-h-0 flex-1 flex-col animate-in fade-in duration-300">
        <ResultsView
          successLabel="retrieved"
          failedLabel="not found"
          result={output}
          mapConfig={mapConfig}
          onStartOver={reset}
          onDownload={() =>
            downloadBlob(
              new Blob([JSON.stringify(output.geojson, null, 2)], { type: 'application/geo+json' }),
              timestampFilename('geojson'),
            )
          }
          downloadLabel="Download .geojson"
        />
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <FileTextInput
        accept=".txt"
        formats=".txt file"
        placeholder={'Paste GeoIDs\none per line\n\ne.g. 1f0c2b3a-5d4e-8f6a-9b7c-0d1e2f3a4b5c\n     7a6b5c4d-3e2f-8a1b-9c0d-e1f2a3b4c5d6'}
        value={text}
        onChange={changeText}
        readFile={readGeoIdFile}
        maxFileSize={maxFileSize}
        onError={onError}
      />
      <ConverterActions
        actionLabel="Retrieve"
        disabled={geoIds.length === 0}
        onAction={() => run(() => retrieveGeojson({ geoIds }))}
        onClear={reset}
      />
    </div>
  )
}
