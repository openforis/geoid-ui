'use client'

import { useState } from 'react'
// import { CollectionPicker } from '@/components/converter/collection-picker'
import { ConverterActions } from '@/components/converter/converter-actions'
import { ConverterProgress } from '@/components/converter/converter-progress'
import { FileTextInput } from '@/components/converter/file-text-input'
import { ResultsView } from '@/components/converter/results-view'
import { useConverterFlow } from '@/components/converter/use-converter-flow'
import { MapDrawInput } from '@/components/draw/map-draw-input'
import { parseGeoJsonText, readGeoJsonFile } from '@/lib/utils/file-parser'
import { downloadBlob, timestampFilename } from '@/lib/utils/download'
import { registerGeojson } from '@/lib/converter/actions'
import type { ConverterStep } from '@/types/converter'
import type { MapConfig } from '@/lib/server/env'

interface GeojsonInputProps {
  onError: (message: string) => void
  onStepChange: (step: ConverterStep) => void
  maxFileSize: number
  mapConfig: MapConfig
}

export function GeojsonInput({ onError, onStepChange, maxFileSize, mapConfig }: GeojsonInputProps) {
  const { step, text, output, flowRef, changeText, reset, run } = useConverterFlow(onStepChange, onError)
  //const [collection, setCollection] = useState('')
  const [collection] = useState('public')

  const handleRegister = () => {
    const parsed = parseGeoJsonText(text)
    if ('error' in parsed) return onError(parsed.error)
    run(() => registerGeojson({ collection, geojson: parsed.geojson }))
  }

  if (step === 'processing') {
    return (
      <div ref={flowRef} className="flex flex-1 flex-col justify-center gap-4">
        <ConverterProgress
          title="Registering GeoJSON"
          description="Assigning a GeoID to each feature."
        />
      </div>
    )
  }

  if (step === 'result' && output) {
    const geoids = output.geojson.features.map((feature) => String(feature.id)).join('\n')
    return (
      <div ref={flowRef} className="flex min-h-0 flex-1 flex-col animate-in fade-in duration-300">
        <ResultsView
          successLabel="registered"
          failedLabel="rejected"
          result={output}
          mapConfig={mapConfig}
          onStartOver={reset}
          onDownload={() =>
            downloadBlob(new Blob([geoids], { type: 'text/plain;charset=utf-8' }), timestampFilename('txt', 'geoids'))
          }
          downloadLabel="Download .txt"
          copyText={geoids}
        />
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {/* <CollectionPicker value={collection} onChange={setCollection} onError={onError} /> */}
      <FileTextInput
        accept=".json,.geojson"
        formats=".json · .geojson"
        placeholder={'Paste GeoJSON\n\n{\n  "type": "FeatureCollection",\n  "features": []\n}'}
        value={text}
        onChange={changeText}
        readFile={readGeoJsonFile}
        maxFileSize={maxFileSize}
        onError={onError}
      >
        <MapDrawInput value={text} onChange={changeText} mapConfig={mapConfig} />
      </FileTextInput>
      <ConverterActions
        actionLabel="Register"
        disabled={!text.trim() || !collection}
        onAction={handleRegister}
        onClear={reset}
      />
    </div>
  )
}
