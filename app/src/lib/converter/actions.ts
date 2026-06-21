'use server'

import { action } from '@/lib/server/action'
import { requireGeoidClient } from '@/lib/geoid/client'
import type { CollectionInfo } from '@/types/collection'

export const fetchCollections = action(async (): Promise<CollectionInfo[]> => {
  const client = await requireGeoidClient()
  return client.listCollections()
})

export const registerGeojson = action(async (payload: {
  collection: string
  geojson: Record<string, unknown>
}): Promise<{ geoids: string[] }> => {
  if (!payload.collection?.trim()) throw new Error('Collection is required.')
  if (!payload.geojson || typeof payload.geojson !== 'object') throw new Error('GeoJSON is required.')

  const client = await requireGeoidClient()
  const geoids = await client.registerGeojson(payload.collection, payload.geojson)
  return { geoids }
})

export const retrieveGeojson = action(async (payload: {
  geoIds: string[]
}): Promise<{ geojson: Record<string, unknown> }> => {
  if (!Array.isArray(payload.geoIds) || payload.geoIds.length === 0) {
    throw new Error('At least one Geo ID is required.')
  }
  if (!payload.geoIds.every((id) => typeof id === 'string' && id.trim())) {
    throw new Error('Geo IDs must be non-empty strings.')
  }

  const client = await requireGeoidClient()
  const geojson = await client.retrieveFeatureCollection(payload.geoIds.map((id) => id.trim()))
  return { geojson }
})
