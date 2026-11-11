import 'server-only'
import type { Feature } from 'geojson'
import { auth } from '@/auth'
import { featuresFromGeojson } from '@/lib/geoid/geojson'
import type {
  BulkRejected,
  BulkReport,
  CollectionsResponse,
  GeoIdCollection,
  PlaceRecord,
  ResolveResponse,
} from '@/lib/geoid/types'

const COLLECTIONS_REVALIDATE_SECONDS = 300

export type GeoidClientConfig = {
  baseUrl: string
  userToken?: string
}

async function readErrorMessage(res: Response): Promise<string | undefined> {
  try {
    const data = (await res.json()) as { message?: string; detail?: unknown }
    if (data.message) return data.message
    if (typeof data.detail === 'string') return data.detail
    if (Array.isArray(data.detail)) {
      return data.detail
        .map((item) => (typeof item === 'object' && item && 'msg' in item ? String(item.msg) : String(item)))
        .join(', ')
    }
  } catch {
    // ignore
  }
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

  async registerBulk(featureCollection: Record<string, unknown>): Promise<BulkReport> {
    const res = await fetch(`${this.config.baseUrl}/items/bulk`, {
      method: 'POST',
      cache: 'no-store',
      headers: this.authHeaders({ 'Content-Type': 'application/json', Accept: 'application/json' }),
      body: JSON.stringify(featureCollection),
    })
    if (!res.ok) throw new Error(await readErrorMessage(res))
    return (await res.json()) as BulkReport
  }

  async resolveBulk(geoIds: string[]): Promise<ResolveResponse> {
    const res = await fetch(`${this.config.baseUrl}/bulk_resolve`, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json', Accept: 'application/geo+json, application/json' },
      body: JSON.stringify({ geoids: geoIds }),
    })
    if (!res.ok) throw new Error(await readErrorMessage(res))
    return (await res.json()) as ResolveResponse
  }

  async registerGeojson(geojson: Record<string, unknown>): Promise<{ features: Feature[]; rejected: BulkRejected[] }> {
    const features = featuresFromGeojson(geojson)
    const { accepted = [], rejected = [] } = await this.registerBulk({ type: 'FeatureCollection', features })
    if (accepted.length === 0) {
      throw new Error(rejected[0]?.detail ?? rejected[0]?.reason ?? 'No features were registered.')
    }
    return {
      features: accepted.map(({ index, geoid }) => ({ ...features[index], id: geoid }) as unknown as Feature),
      rejected,
    }
  }

  async listMyGeoids(params: { limit?: number; offset?: number } = {}): Promise<PlaceRecord[]> {
    const query = new URLSearchParams()
    if (params.limit) query.set('limit', String(params.limit))
    if (params.offset) query.set('offset', String(params.offset))
    const qs = query.toString()
    const res = await fetch(`${this.config.baseUrl}/me/geoids${qs ? `?${qs}` : ''}`, {
      cache: 'no-store',
      headers: this.authHeaders({ Accept: 'application/json' }),
    })
    if (!res.ok) throw new Error(await readErrorMessage(res))
    return (await res.json()) as PlaceRecord[]
  }

  private authHeaders(headers: Record<string, string>): Record<string, string> {
    if (!this.config.userToken) return headers
    return { ...headers, Authorization: `Bearer ${this.config.userToken}` }
  }
}

export async function requireGeoidClient(): Promise<GeoidClient> {
  const baseUrl = process.env.GEOID_BASE_URL?.trim().replace(/\/$/, '')
  if (!baseUrl) throw new Error('GeoID is not configured. Set GEOID_BASE_URL.')
  const session = await auth()
  return new GeoidClient({ baseUrl, userToken: session?.accessToken })
}
