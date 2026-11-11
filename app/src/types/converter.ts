import type { FeatureCollection } from 'geojson'

export type ConverterStep = 'input' | 'processing' | 'result'

export type ConverterResult = {
  geojson: FeatureCollection
  failed: { id: string; reason: string }[]
}
