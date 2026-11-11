'use server'

import { action } from '@/lib/server/action'
import { requireGeoidClient } from '@/lib/geoid/client'
import type { CollectionInfo } from '@/types/collection'
import type { ConverterResult } from '@/types/converter'

export const fetchCollections = action(async (): Promise<CollectionInfo[]> => {
  // const client = await requireGeoidClient()
  // return client.listCollections()
  return [
    {
      id: 'public',
      title: 'Public (anonymous contributions)',
      description: null,
    },
  ]
})

const GEOID = /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i

export const registerGeojson = action(async (payload: { geojson: Record<string, unknown> }): Promise<ConverterResult> => {
  if (!payload.geojson || typeof payload.geojson !== 'object') throw new Error('GeoJSON is required.')

  const client = await requireGeoidClient()
  const { features, rejected } = await client.registerGeojson(payload.geojson)
  return {
    geojson: { type: 'FeatureCollection', features },
    failed: rejected.map(({ index, reason, detail }) => ({ id: `Feature ${index + 1}`, reason: detail ?? reason })),
  }
})

export const retrieveGeojson = action(async (payload: {
  geoIds: string[]
}): Promise<ConverterResult> => {
  if (!Array.isArray(payload.geoIds) || payload.geoIds.length === 0) {
    throw new Error('At least one GeoID is required.')
  }
  const invalid = payload.geoIds.find((id) => !GEOID.test(id))
  if (invalid !== undefined) throw new Error(`"${invalid}" is not a valid GeoID.`)

  const client = await requireGeoidClient()
  const { features, not_found = [] } = await client.resolveBulk(payload.geoIds)
  if (features.length === 0) throw new Error('None of the GeoIDs were found.')
  return {
    geojson: { type: 'FeatureCollection', features },
    failed: not_found.map((id) => ({ id, reason: 'Not found' })),
  }
})
