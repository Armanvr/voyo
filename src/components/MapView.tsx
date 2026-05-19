import L from 'leaflet'
import { useEffect, useRef } from 'preact/hooks'
import type { Day } from '../types'

interface MapViewProps {
	day: Day
	completedOrders: number[]
	onMarkerClick: (ordre: number) => void
	focusOrdre?: number | null
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

export function MapView({ day, completedOrders, onMarkerClick, focusOrdre }: MapViewProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const mapRef = useRef<L.Map | null>(null)
	const markersRef = useRef<L.Marker[]>([])

	useEffect(() => {
		if (!containerRef.current || mapRef.current) return
		const map = L.map(containerRef.current, { zoomControl: false })
		L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
			attribution:
				'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>',
			maxZoom: 19,
			subdomains: 'abcd',
		}).addTo(map)
		L.control.zoom({ position: 'bottomright' }).addTo(map)
		mapRef.current = map
		return () => {
			map.remove()
			mapRef.current = null
		}
	}, [])

	// Rebuild markers when day or completion state changes
	useEffect(() => {
		const map = mapRef.current
		if (!map) return

		for (const m of markersRef.current) m.remove()
		markersRef.current = []

		const mappable = day.etapes.filter((s) => s.type !== 'depart' && s.type !== 'retour' && s.coordonnees)
		if (mappable.length === 0) return

		const nextOrdre = mappable.find((s) => !completedOrders.includes(s.ordre))?.ordre ?? null

		mappable.forEach((step) => {
			const done = completedOrders.includes(step.ordre)
			const isActive = step.ordre === nextOrdre

			const color = done ? '#5A9FA8' : isActive ? '#35F0F0' : '#0B2027'
			const size = isActive ? 18 : 12

			const marker = L.marker([step.coordonnees.lat, step.coordonnees.lon], {
				icon: makeMarkerIcon(color, size),
				title: step.lieu,
				zIndexOffset: isActive ? 1000 : done ? 0 : 500,
			})
				.addTo(map)
				.on('click', () => {
					map.flyTo([step.coordonnees.lat, step.coordonnees.lon], Math.max(map.getZoom(), 15), {
						animate: true,
						duration: 0.5,
					})
					onMarkerClick(step.ordre)
				})

			markersRef.current.push(marker)
		})
	}, [day, completedOrders])

	// Fly to step when user clicks it in the list
	useEffect(() => {
		if (focusOrdre === null || focusOrdre === undefined) return
		const map = mapRef.current
		if (!map) return
		const step = day.etapes.find((s) => s.ordre === focusOrdre)
		if (!step?.coordonnees || (step.coordonnees.lat === 0 && step.coordonnees.lon === 0)) return
		map.flyTo([step.coordonnees.lat, step.coordonnees.lon], Math.max(map.getZoom(), 16), {
			animate: true,
			duration: 0.5,
		})
	}, [focusOrdre])

	// Fit bounds only when day changes (not on every toggle)
	useEffect(() => {
		const map = mapRef.current
		if (!map) return

		const mappable = day.etapes.filter((s) => s.type !== 'depart' && s.type !== 'retour' && s.coordonnees)
		if (mappable.length === 0) return

		const bounds = L.latLngBounds(mappable.map((s) => [s.coordonnees.lat, s.coordonnees.lon] as [number, number]))
		map.fitBounds(bounds, { padding: [24, 24], maxZoom: 15 })
	}, [day])

	return <div ref={containerRef} class='w-full z-10' style={{ height: '40vh' }} />
}
