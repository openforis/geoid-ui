'use client'

import { useState } from 'react'
import { FileTextInput } from '@/components/converter/file-text-input'
import { ConverterActions } from '@/components/converter/converter-actions'
import { ConverterProgress } from '@/components/converter/converter-progress'
import { RetrieveOutput } from '@/components/converter/retrieve-output'
import { useConverterFlow } from '@/components/converter/use-converter-flow'
import { parseGeoIdText, readGeoIdFile } from '@/lib/utils/file-parser'
import { retrieveGeojson } from '@/lib/converter/actions'
import type { ConverterStep } from '@/types/converter'

interface GeoidInputProps {
  onError: (message: string) => void
  onStepChange: (step: ConverterStep) => void
  maxFileSize: number
}

export function GeoidInput({ onError, onStepChange, maxFileSize }: GeoidInputProps) {
  const { step, setStep, flowRef, resetStep } = useConverterFlow(onStepChange)
  const [text, setText] = useState('')
  const [geojson, setGeojson] = useState<Record<string, unknown> | null>(null)

  const geoIds = parseGeoIdText(text)

  const reset = () => {
    resetStep()
    setText('')
    setGeojson(null)
    onError('')
  }

  const handleTextChange = (value: string) => {
    setText(value)
    setGeojson(null)
    setStep('input')
  }

  const handleRetrieve = async () => {
    onError('')
    if (geoIds.length === 0) return onError('Please enter at least one Geo ID or upload a file.')

    setGeojson(null)
    setStep('processing')
    try {
      const result = await retrieveGeojson({ geoIds })
      if (!result.ok) {
        onError(result.message)
        setStep('input')
        return
      }
      setGeojson(result.data.geojson)
      setStep('result')
    } catch {
      onError('Retrieval failed.')
      setStep('input')
    }
  }

  if (step === 'processing') {
    return (
      <div ref={flowRef} className="flex flex-1 flex-col justify-center gap-4">
        <ConverterProgress
          status="processing"
          title="Retrieving GeoJSON"
          description={`Resolving ${geoIds.length} Geo ID${geoIds.length === 1 ? '' : 's'}.`}
        />
      </div>
    )
  }

  if (step === 'result' && geojson) {
    return (
      <div ref={flowRef} className="flex min-h-0 flex-1 flex-col animate-in fade-in duration-300">
        <RetrieveOutput geojson={geojson} onStartOver={reset} />
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <FileTextInput
        accept=".txt"
        formats=".txt file"
        placeholder={"Paste Geo IDs\none per line\n\ne.g. 20230001\n     20230002"}
        value={text}
        onChange={handleTextChange}
        readFile={readGeoIdFile}
        maxFileSize={maxFileSize}
        onError={onError}
      />
      <ConverterActions
        actionLabel="Retrieve"
        disabled={geoIds.length === 0}
        isLoading={false}
        onAction={handleRetrieve}
        onClear={reset}
      />
    </div>
  )
}
