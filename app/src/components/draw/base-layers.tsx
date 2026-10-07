'use client'

import { LayersControl, TileLayer } from 'react-leaflet'
import { useTheme } from '@/components/layout/theme-provider'

const OSM_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const OSM = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const CARTO = `${OSM} &copy; <a href="https://carto.com/attributions">CARTO</a>`

const CARTO_TILES = {
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
} as const

const MAX_ZOOM = 21
export const SATELLITE_MAX_ZOOM = 18

// Domain-locked and sent in browser tile requests, so the key is public by design.
const withKey = (url: string, key?: string) => (key ? `${url}?key=${encodeURIComponent(key)}` : url)

export function BaseLayers({ cartoKey }: { cartoKey?: string }) {
  const { theme } = useTheme()

  return (
    <LayersControl position="topright">
      <LayersControl.BaseLayer name="Map">
        <TileLayer url={withKey(CARTO_TILES[theme], cartoKey)} attribution={CARTO} maxNativeZoom={20} maxZoom={MAX_ZOOM} />
      </LayersControl.BaseLayer>

      <LayersControl.BaseLayer checked name="Satellite">
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
          attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
          maxNativeZoom={SATELLITE_MAX_ZOOM}
          maxZoom={MAX_ZOOM}
        />
      </LayersControl.BaseLayer>

      <LayersControl.BaseLayer name="Street">
        <TileLayer url={OSM_URL} attribution={OSM} maxNativeZoom={19} maxZoom={MAX_ZOOM} />
      </LayersControl.BaseLayer>
    </LayersControl>
  )
}
