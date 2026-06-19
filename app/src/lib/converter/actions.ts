'use server'

import { unstable_cache } from 'next/cache'
import { action } from '@/lib/server/action'
import { requireGeoidClient } from '@/lib/geoid/client'
import type { CollectionInfo } from '@/types/collection'

async function loadCollections(): Promise<CollectionInfo[]> {
  return requireGeoidClient().listCollections()
}

const getCollections = unstable_cache(loadCollections, ['geoid-collections'], { revalidate: 300 })

export const fetchCollections = action(async (): Promise<CollectionInfo[]> => getCollections())

export const registerGeojson = action(async (payload: {
  collection: string
  geojson: Record<string, unknown>
}): Promise<{ geoids: string[] }> => {
  if (!payload.collection?.trim()) throw new Error('Collection is required.')
  if (!payload.geojson || typeof payload.geojson !== 'object') throw new Error('GeoJSON is required.')

  const geoids = await requireGeoidClient().registerGeojson(payload.collection, payload.geojson)
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

  const geojson = await requireGeoidClient().retrieveFeatureCollection(payload.geoIds.map((id) => id.trim()))
  return { geojson }
})
