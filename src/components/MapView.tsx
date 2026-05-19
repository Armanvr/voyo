import { useEffect, useRef } from 'preact/hooks'
import L from 'leaflet'
import type { Day } from '../types'

interface MapViewProps {
  day: Day
  completedOrders: number[]
  onMarkerClick: (ordre: number) => void
}

function makeMarkerIcon(color: string, size: number): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2.5px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.25);cursor:pointer"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })
}

export function MapView({ day, completedOrders, onMarkerClick }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const map = L.map(containerRef.current, { zoomControl: false })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    const mappable = day.etapes.filter(
      s => s.type !== 'depart' && s.type !== 'retour' && s.coordonnees
    )
    if (mappable.length === 0) return

    const nextOrdre = mappable.find(s => !completedOrders.includes(s.ordre))?.ordre ?? null

    mappable.forEach(step => {
      const done = completedOrders.includes(step.ordre)
      const isActive = step.ordre === nextOrdre

      const color = done ? '#B89E97' : isActive ? '#1098F7' : '#000000'
      const size = isActive ? 18 : 12

      const marker = L.marker([step.coordonnees.lat, step.coordonnees.lon], {
        icon: makeMarkerIcon(color, size),
        title: step.lieu,
        zIndexOffset: isActive ? 1000 : done ? 0 : 500,
      })
        .addTo(map)
        .on('click', () => onMarkerClick(step.ordre))

      markersRef.current.push(marker)
    })

    const bounds = L.latLngBounds(
      mappable.map(s => [s.coordonnees.lat, s.coordonnees.lon] as [number, number])
    )
    map.fitBounds(bounds, { padding: [24, 24], maxZoom: 15 })
  }, [day, completedOrders])

  return (
    <div
      ref={containerRef}
      class="w-full z-10"
      style={{ height: '40vh' }}
    />
  )
}
