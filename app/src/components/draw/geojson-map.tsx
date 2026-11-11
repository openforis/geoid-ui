'use client'

import { useEffect } from 'react'
import { GeoJSON, MapContainer, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Feature, FeatureCollection } from 'geojson'
import 'leaflet/dist/leaflet.css'
import './leaflet-theme.css'
import { BaseLayers, SATELLITE_MAX_ZOOM } from './base-layers'

const DEFAULT_CENTER: L.LatLngTuple = [0, 20]
const FIT_OPTIONS: L.FitBoundsOptions = { padding: [24, 24], maxZoom: SATELLITE_MAX_ZOOM }
const STYLE: L.PathOptions = { color: '#facc15', weight: 2, fillOpacity: 0.2 }
const SELECTED_STYLE: L.PathOptions = { color: '#22d3ee', weight: 4, fillOpacity: 0.35 }

const pointToLayer = (feature: Feature, latlng: L.LatLng) => Object.assign(L.circleMarker(latlng, { radius: 6 }), { feature })

function FitSelected({ feature }: { feature?: Feature }) {
  const map = useMap()

  useEffect(() => {
    const bounds = feature && L.geoJSON(feature).getBounds()
    if (bounds?.isValid()) map.fitBounds(bounds, FIT_OPTIONS)
  }, [feature, map])

  return null
}

interface GeojsonMapProps {
  geojson: FeatureCollection
  selected: number | null
  onSelect: (index: number) => void
  cartoKey?: string
}

export function GeojsonMap({ geojson, selected, onSelect, cartoKey }: GeojsonMapProps) {
  const bounds = L.geoJSON(geojson).getBounds()
  const view = bounds.isValid() ? { bounds, boundsOptions: FIT_OPTIONS } : { center: DEFAULT_CENTER, zoom: 3 }
  const feature = selected === null ? undefined : geojson.features[selected]

  return (
    <MapContainer {...view} className="absolute inset-0">
      <BaseLayers cartoKey={cartoKey} />
      <GeoJSON
        data={geojson}
        style={(f) => (f === feature ? SELECTED_STYLE : STYLE)}
        pointToLayer={pointToLayer}
        eventHandlers={{ click: (e) => onSelect(geojson.features.indexOf(e.propagatedFrom.feature)) }}
      />
      <FitSelected feature={feature} />
    </MapContainer>
  )
}
