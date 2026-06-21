import 'server-only'
import { featuresFromGeojson } from '@/lib/geoid/geojson'
import type {
  BulkReport,
  CollectionsResponse,
  GeoIdCollection,
  GeoIdFeature,
  MintResponse,
} from '@/lib/geoid/types'
import { AppEnv } from '@/lib/server/env'

const COLLECTIONS_REVALIDATE_SECONDS = 300

export type GeoidClientConfig = {
  baseUrl: string
  adminToken?: string
}

async function readErrorMessage(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { message?: string; detail?: unknown }
    if (data.message) return data.message
    if (Array.isArray(data.detail)) {
      return data.detail
        .map((item) => (typeof item === 'object' && item && 'msg' in item ? String(item.msg) : String(item)))
        .join(', ')
    }
  } catch {
    // ignore
  }
  return `GeoID request failed (${res.status})`
}

export class GeoidClient {
  constructor(private readonly config: GeoidClientConfig) {}

  async listCollections(): Promise<GeoIdCollection[]> {
    const res = await fetch(`${this.config.baseUrl}/collections`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: COLLECTIONS_REVALIDATE_SECONDS },
    })
    if (!res.ok) throw new Error(await readErrorMessage(res))
    const data = (await res.json()) as CollectionsResponse
    return (data.collections ?? []).map((c) => ({
      id: c.id,
      title: c.title ?? null,
      description: c.description ?? null,
    }))
  }

  async registerFeature(collectionId: string, feature: Record<string, unknown>): Promise<MintResponse> {
    const res = await fetch(
      `${this.config.baseUrl}/collections/${encodeURIComponent(collectionId)}/items`,
      {
        method: 'POST',
        cache: 'no-store',
        headers: this.authHeaders({ 'Content-Type': 'application/json', Accept: 'application/json' }),
        body: JSON.stringify(feature),
      },
    )
    if (!res.ok) throw new Error(await readErrorMessage(res))
    return (await res.json()) as MintResponse
  }

  async registerBulk(collectionId: string, featureCollection: Record<string, unknown>): Promise<BulkReport> {
    const res = await fetch(
      `${this.config.baseUrl}/collections/${encodeURIComponent(collectionId)}/items/bulk`,
      {
        method: 'POST',
        cache: 'no-store',
        headers: this.authHeaders({ 'Content-Type': 'application/json', Accept: 'application/json' }),
        body: JSON.stringify(featureCollection),
      },
    )
    if (!res.ok) throw new Error(await readErrorMessage(res))
    return (await res.json()) as BulkReport
  }

  async resolveGeoid(geoid: string): Promise<GeoIdFeature> {
    const res = await fetch(`${this.config.baseUrl}/${encodeURIComponent(geoid)}`, {
      cache: 'no-store',
      headers: { Accept: 'application/geo+json, application/json' },
    })
    if (!res.ok) throw new Error(await readErrorMessage(res))
    return (await res.json()) as GeoIdFeature
  }

  async registerGeojson(collectionId: string, geojson: Record<string, unknown>): Promise<string[]> {
    const features = featuresFromGeojson(geojson)
    if (features.length === 1) {
      const result = await this.registerFeature(collectionId, features[0])
      return [result.geoid]
    }
    const report = await this.registerBulk(collectionId, { type: 'FeatureCollection', features })
    const geoids = (report.accepted ?? []).map((item) => item.geoid)
    if (geoids.length === 0) {
      const detail = report.rejected?.[0]?.detail ?? report.rejected?.[0]?.reason
      throw new Error(detail ?? 'No features were registered.')
    }
    return geoids
  }

  async retrieveFeatureCollection(geoIds: string[]): Promise<Record<string, unknown>> {
    const features = await Promise.all(geoIds.map((id) => this.resolveGeoid(id)))
    return { type: 'FeatureCollection', features }
  }

  private authHeaders(headers: Record<string, string>): Record<string, string> {
    if (!this.config.adminToken) return headers
    return { ...headers, Authorization: `Bearer ${this.config.adminToken}` }
  }
}

export async function requireGeoidClient(): Promise<GeoidClient> {
  const { geoid } = await AppEnv.load()
  if (!geoid.baseUrl) throw new Error('GeoID is not configured. Set GEOID_BASE_URL.')
  return new GeoidClient({ baseUrl: geoid.baseUrl, adminToken: geoid.adminToken })
}
