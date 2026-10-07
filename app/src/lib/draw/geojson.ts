import type { Feature, Geometry } from 'geojson'
import { featuresFromGeojson } from '@/lib/geoid/geojson'
import { inRange, polygonsOf, toGeometry, toLatLngs, type EditableGeometry, type LatLng } from './geometry'

export type SourceFeature = Feature<Geometry | null>

export interface Shape {
  id: number
  vertices: LatLng[]
  source?: Feature<EditableGeometry>
}

const POSITION_DEPTH = new Map([
  ['Point', 0],
  ['MultiPoint', 1],
  ['LineString', 1],
  ['MultiLineString', 2],
  ['Polygon', 2],
  ['MultiPolygon', 3],
])

function hasPositions(value: unknown, depth: number): boolean {
  if (!Array.isArray(value)) return false
  if (depth > 0) return value.every((item) => hasPositions(item, depth - 1))
  const [lng, lat] = value
  return value.length >= 2 && value.every(Number.isFinite) && inRange(lat, lng)
}

function isGeometry(value: unknown): value is Geometry {
  if (!value || typeof value !== 'object') return false
  const { type, coordinates, geometries } = value as Record<string, unknown>
  if (type === 'GeometryCollection') return Array.isArray(geometries) && geometries.every(isGeometry)
  const depth = POSITION_DEPTH.get(String(type))
  return depth !== undefined && hasPositions(coordinates, depth)
}

function isFeature(value: object): value is SourceFeature {
  const { type, geometry } = value as Partial<SourceFeature>
  return type === 'Feature' && (geometry === null || isGeometry(geometry))
}

function isEditable(feature: SourceFeature): feature is Feature<EditableGeometry> {
  if (feature.geometry?.type === 'Point') return true
  const polygons = polygonsOf(feature.geometry)
  return polygons.length === 1 && polygons[0].length === 1 && polygons[0][0].length >= 4
}

export function parseFeatures(text: string): SourceFeature[] | null {
  if (!text.trim()) return []
  try {
    const features: object[] = featuresFromGeojson(JSON.parse(text))
    return features.every(isFeature) ? features : null
  } catch {
    return null
  }
}

export function toShapes(features: SourceFeature[]) {
  return {
    shapes: features.filter(isEditable).map((source, id): Shape => ({ id, source, vertices: toLatLngs(source.geometry) })),
    locked: features.filter((feature) => !isEditable(feature)),
  }
}

const sameLatLngs = (a: LatLng[], b: LatLng[]) =>
  a.length === b.length && a.every((point, i) => point.lat === b[i].lat && point.lng === b[i].lng)

function toFeature({ vertices, source }: Shape): SourceFeature {
  if (source && sameLatLngs(vertices, toLatLngs(source.geometry))) return source
  return {
    type: 'Feature',
    id: source?.id,
    properties: source?.properties ?? {},
    geometry: toGeometry(vertices, source?.geometry.type),
  }
}

export function toGeoJson(features: SourceFeature[], shapes: Shape[]): string {
  const shapeOf = new Map(shapes.map((shape) => [shape.source, shape]))
  const kept = features.flatMap((feature) => {
    if (!isEditable(feature)) return [feature]
    const shape = shapeOf.get(feature)
    return shape ? [toFeature(shape)] : []
  })
  const drawn = shapes.filter((shape) => !shape.source).map(toFeature)
  return JSON.stringify({ type: 'FeatureCollection', features: [...kept, ...drawn] }, null, 2)
}
