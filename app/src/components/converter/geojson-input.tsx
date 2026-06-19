'use client'

import { useState } from 'react'
import { FileTextInput } from '@/components/converter/file-text-input'
import { CollectionPicker } from '@/components/converter/collection-picker'
import { ConverterActions } from '@/components/converter/converter-actions'
import { ConverterProgress } from '@/components/converter/converter-progress'
import { RegisterOutput } from '@/components/converter/register-output'
import { useConverterFlow } from '@/components/converter/use-converter-flow'
import { parseGeoJsonFile, parseGeoJsonText } from '@/lib/utils/file-parser'
import { registerGeojson } from '@/lib/converter/actions'
import type { ConverterStep } from '@/types/converter'

interface GeojsonInputProps {
  onError: (message: string) => void
  onStepChange: (step: ConverterStep) => void
  maxFileSize: number
}

export function GeojsonInput({ onError, onStepChange, maxFileSize }: GeojsonInputProps) {
  const { step, setStep, flowRef, resetStep } = useConverterFlow(onStepChange)
  const [fileName, setFileName] = useState('')
  const [text, setText] = useState('')
  const [collection, setCollection] = useState('')
  const [geoids, setGeoids] = useState<string[] | null>(null)

  const reset = () => {
    resetStep()
    setFileName('')
    setText('')
    setGeoids(null)
    onError('')
  }

  const handleTextChange = (value: string) => {
    setText(value)
    setFileName('')
    setGeoids(null)
    setStep('input')
  }

  const handleFile = async (file: File) => {
    onError('')
    setGeoids(null)
    setStep('input')
    const result = await parseGeoJsonFile(file)
    if ('error' in result) {
      onError(result.error)
      setFileName('')
      setText('')
      return
    }
    setFileName(file.name)
    setText(JSON.stringify(result.geojson, null, 2))
  }

  const handleRegister = async () => {
    onError('')
    if (!collection) return onError('Please select a collection.')
    if (!text.trim()) return onError('Please enter GeoJSON or upload a file.')

    const parsed = parseGeoJsonText(text)
    if ('error' in parsed) return onError(parsed.error)

    setGeoids(null)
    setStep('processing')
    try {
      const result = await registerGeojson({ collection, geojson: parsed.geojson })
      if (!result.ok) {
        onError(result.message)
        setStep('input')
        return
      }
      setGeoids(result.data.geoids)
      setStep('result')
    } catch {
      onError('Registration failed.')
      setStep('input')
    }
  }

  if (step === 'processing') {
    return (
      <div ref={flowRef} className="flex flex-1 flex-col justify-center gap-4">
        <ConverterProgress
          status="processing"
          title="Registering GeoJSON"
          description="Assigning Geo IDs in the selected collection."
        />
      </div>
    )
  }

  if (step === 'result' && geoids?.length) {
    return (
      <div ref={flowRef} className="flex min-h-0 flex-1 flex-col animate-in fade-in duration-300">
        <RegisterOutput geoids={geoids} collection={collection} onStartOver={reset} />
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <CollectionPicker value={collection} onChange={setCollection} onError={onError} />
      <FileTextInput
        accept=".json,.geojson"
        formats=".json · .geojson"
        placeholder={'Paste GeoJSON\n\n{\n  "type": "FeatureCollection",\n  "features": []\n}'}
        value={text}
        onChange={handleTextChange}
        fileName={fileName}
        onFile={handleFile}
        maxFileSize={maxFileSize}
        onError={onError}
      />
      <ConverterActions
        actionLabel="Register"
        disabled={!text.trim() || !collection}
        isLoading={false}
        onAction={handleRegister}
        onClear={reset}
      />
    </div>
  )
}
