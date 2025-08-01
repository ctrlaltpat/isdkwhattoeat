import mapboxgl from 'mapbox-gl'

export interface MapboxOptions {
  container: string | HTMLElement
  style: string
  center: [number, number] // [lng, lat]
  zoom: number
  accessToken: string
}

export interface MapboxMarkerOptions {
  color?: string
  draggable?: boolean
}

export interface PlaceResult {
  id: string
  place_name: string
  center: [number, number] // [lng, lat]
  properties: {
    address?: string
    category?: string
    maki?: string
    landmark?: boolean
    [key: string]: unknown
  }
  context?: Array<{
    id: string
    text: string
    short_code?: string
  }>
  geometry: {
    type: string
    coordinates: [number, number]
  }
}

export interface DirectionsResponse {
  routes: DirectionsRoute[]
  waypoints: DirectionsWaypoint[]
  code: string
}

export interface DirectionsRoute {
  legs: DirectionsLeg[]
  distance: number
  duration: number
  geometry: {
    coordinates: Array<[number, number]>
    type: string
  }
}

export interface DirectionsLeg {
  steps: DirectionsStep[]
  distance: number
  duration: number
}

export interface DirectionsStep {
  distance: number
  duration: number
  geometry: {
    coordinates: Array<[number, number]>
    type: string
  }
  maneuver: {
    bearing_after: number
    bearing_before: number
    instruction: string
    location: [number, number]
    type: string
  }
  name: string
}

export interface DirectionsWaypoint {
  distance: number
  location: [number, number]
  name: string
}

export interface GeocodingResponse {
  type: string
  query: string[]
  features: PlaceResult[]
  attribution: string
}

export type Map = mapboxgl.Map
export type Marker = mapboxgl.Marker
export type Popup = mapboxgl.Popup
export type LngLat = mapboxgl.LngLat
export type LngLatLike = mapboxgl.LngLatLike