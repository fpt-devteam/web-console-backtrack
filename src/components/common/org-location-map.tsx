import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export function isValidOrgMapLocation(
  loc: { latitude: number; longitude: number } | null | undefined,
): boolean {
  if (!loc) return false
  const { latitude: lat, longitude: lng } = loc
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return false
  if (lat === 0 && lng === 0) return false
  return true
}

type OrgLocationMapProps = {
  latitude: number
  longitude: number
  className?: string
}

/**
 * OpenStreetMap tiles + marker tại tọa độ org (read-only).
 */
export function OrgLocationMap({ latitude, longitude, className }: OrgLocationMapProps) {
  return (
    <MapContainer
      key={`${latitude.toFixed(5)}-${longitude.toFixed(5)}`}
      center={[latitude, longitude]}
      zoom={15}
      className={className ?? 'z-0 h-full w-full min-h-[176px] rounded-xl'}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CircleMarker
        center={[latitude, longitude]}
        radius={10}
        pathOptions={{
          color: '#1d4ed8',
          fillColor: '#3b82f6',
          fillOpacity: 0.9,
          weight: 2,
        }}
      >
        <Tooltip direction="top" offset={[0, -10]}>
          Organization location
        </Tooltip>
      </CircleMarker>
    </MapContainer>
  )
}
