export type GeoIdCollection = {
  id: string
  title: string | null
  description: string | null
}

export type GeoIdFeature = {
  type: 'Feature'
  id?: string
  geometry: Record<string, unknown> | null
  properties?: Record<string, unknown> | null
}

export type MintResponse = {
  geoid: string
  uri: string
  item_url: string
  collection: string
  external_id?: string | null
}

export type BulkAccepted = {
  index: number
  geoid: string
  uri: string
  item_url: string
  external_id?: string | null
}

export type BulkReport = {
  summary: {
    received: number
    accepted: number
    rejected: number
  }
  accepted?: BulkAccepted[]
  rejected?: Array<{ index: number; reason: string; detail?: string | null; geoid?: string | null }>
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
