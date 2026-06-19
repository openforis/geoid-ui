export function featuresFromGeojson(geojson: Record<string, unknown>): Record<string, unknown>[] {
  if (geojson.type === 'FeatureCollection' && Array.isArray(geojson.features)) {
    return geojson.features.filter((f): f is Record<string, unknown> => !!f && typeof f === 'object')
  }
  if (geojson.type === 'Feature') {
    return [geojson]
  }
  throw new Error('GeoJSON must be a Feature or FeatureCollection.')
}
