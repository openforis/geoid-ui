'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'
import { Alert } from '@/components/ui/alert'
import { GeojsonInput } from '@/components/converter/geojson-input'
import { GeoidInput } from '@/components/converter/geoid-input'
import type { ConverterStep } from '@/types/converter'

export function ConverterPanel({ className, maxFileSize }: { className?: string; maxFileSize: number }) {
  const [error, setError] = useState('')
  const [tab, setTab] = useState('geojson-to-geoid')
  const [geojsonStep, setGeojsonStep] = useState<ConverterStep>('input')
  const [geoidStep, setGeoidStep] = useState<ConverterStep>('input')

  const activeStep = tab === 'geojson-to-geoid' ? geojsonStep : geoidStep
  const showTabs = activeStep === 'input'

  const handleTabChange = (value: string) => {
    setTab(value)
    setError('')
  }

  return (
    <Tabs value={tab} onValueChange={handleTabChange} className={cn('min-h-0 flex-1', className)}>
      {showTabs && (
        <TabsList className="w-full">
          <TabsTrigger value="geojson-to-geoid" className="flex-1">
            GeoJson → GeoId
          </TabsTrigger>
          <TabsTrigger value="geoid-to-geojson" className="flex-1">
            GeoId → GeoJson
          </TabsTrigger>
        </TabsList>
      )}

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
          className={showTabs ? 'mt-4' : undefined}
        />
      )}

      <TabsContent value="geojson-to-geoid" className={cn('min-h-0 flex flex-col', showTabs ? 'mt-4' : undefined)}>
        <GeojsonInput onError={setError} onStepChange={setGeojsonStep} maxFileSize={maxFileSize} />
      </TabsContent>

      <TabsContent value="geoid-to-geojson" className={cn('min-h-0 flex flex-col', showTabs ? 'mt-4' : undefined)}>
        <GeoidInput onError={setError} onStepChange={setGeoidStep} maxFileSize={maxFileSize} />
      </TabsContent>
    </Tabs>
  )
}
