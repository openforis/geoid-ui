import type { Feature } from 'geojson'

export type GeoIdCollection = {
  id: string
  title: string | null
  description: string | null
}

export type ResolveResponse = {
  features: Feature[]
  not_found?: string[]
}

export type BulkAccepted = {
  index: number
  geoid: string
  uri: string
  external_id?: string | null
}

export type BulkRejected = {
  index: number
  reason: string
  detail?: string | null
  external_id?: string | null
}

export type BulkReport = {
  summary: {
    received: number
    accepted: number
    rejected: number
  }
  accepted?: BulkAccepted[]
  rejected?: BulkRejected[]
}

export type CollectionsResponse = {
  collections?: Array<{ id: string; title?: string; description?: string }>
}

export type PlaceRecord = {
  geoid: string
  uri: string
  collection: string
  external_id: string | null
  created_at: string
}
