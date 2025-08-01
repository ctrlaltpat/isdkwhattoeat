export const mapStyle = {
  version: 8 as const,
  name: "IDKWhatToEat Style",
  glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
  sources: {
    mapbox: {
      type: "vector" as const,
      url: "mapbox://mapbox.mapbox-streets-v8",
    },
  },
  layers: [
    {
      id: "background",
      type: "background" as const,
      paint: {
        "background-color": "#070c18",
      },
    },
    {
      id: "water",
      type: "fill" as const,
      source: "mapbox",
      "source-layer": "water",
      paint: {
        "fill-color": "#003b73",
      },
    },
    {
      id: "landuse",
      type: "fill" as const,
      source: "mapbox",
      "source-layer": "landuse",
      paint: {
        "fill-color": "#0a1020",
        "fill-opacity": 0.5,
      },
    },
    {
      id: "roads-major",
      type: "line" as const,
      source: "mapbox",
      "source-layer": "road",
      filter: ["in", "class", "motorway", "trunk", "primary"],
      paint: {
        "line-color": "#4a9eff",
        "line-width": 3,
      },
    },
    {
      id: "roads-secondary",
      type: "line" as const,
      source: "mapbox", 
      "source-layer": "road",
      filter: ["in", "class", "secondary", "tertiary"],
      paint: {
        "line-color": "#3680d9",
        "line-width": 2,
      },
    },
    {
      id: "roads-minor",
      type: "line" as const,
      source: "mapbox",
      "source-layer": "road", 
      filter: ["in", "class", "street", "street_limited"],
      paint: {
        "line-color": "#2560b3",
        "line-width": 1,
      },
    },
    {
      id: "buildings",
      type: "fill" as const,
      source: "mapbox",
      "source-layer": "building",
      paint: {
        "fill-color": "#0f1829",
        "fill-opacity": 0.7,
      },
    },
    {
      id: "place-labels",
      type: "symbol" as const,
      source: "mapbox",
      "source-layer": "place_label",
      layout: {
        "text-field": "{name}",
        "text-font": ["Noto Sans Regular", "Arial Unicode MS Regular"],
        "text-size": 12,
      },
      paint: {
        "text-color": "#ffffff",
        "text-halo-color": "#070c18",
        "text-halo-width": 2,
      },
    },
    {
      id: "road-labels",
      type: "symbol" as const,
      source: "mapbox",
      "source-layer": "road_label",
      layout: {
        "text-field": "{name}",
        "text-font": ["Noto Sans Regular", "Arial Unicode MS Regular"],
        "text-size": 10,
        "symbol-placement": "line" as const,
      },
      paint: {
        "text-color": "#ffffff", 
        "text-halo-color": "#070c18",
        "text-halo-width": 1,
      },
    },
  ],
};

export const MAPBOX_STYLE = mapStyle;

export const DEFAULT_CENTER: [number, number] = [51.5162649, -0.130641];
export const DEFAULT_ZOOM = 15;

const MAPBOX_API_BASE = "https://api.mapbox.com";

export async function searchPlaces(
  query: string,
  proximity: [number, number],
  accessToken: string
) {
  const { usageTracker } = await import('./mapbox-limits')
  
  if (!usageTracker.canMakeSearchRequest()) {
    throw new Error('Search request limit exceeded. Please wait before trying again.')
  }

  const url = new URL(
    `${MAPBOX_API_BASE}/geocoding/v5/mapbox.places/${encodeURIComponent(
      query
    )}.json`
  );
  url.searchParams.set("access_token", accessToken);
  url.searchParams.set("proximity", proximity.join(","));
  url.searchParams.set("types", "poi");
  url.searchParams.set("category", "restaurant,food");
  url.searchParams.set("limit", "20"); 

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to search places");
  }

  usageTracker.recordSearchRequest()
  return response.json();
}

export async function getDirections(
  start: [number, number],
  end: [number, number],
  profile: "driving" | "walking" | "cycling" = "walking",
  accessToken: string
) {
  const { usageTracker } = await import('./mapbox-limits')
  
  if (!usageTracker.canMakeDirectionsRequest()) {
    throw new Error('Directions request limit exceeded. Please wait before trying again.')
  }

  const url = new URL(
    `${MAPBOX_API_BASE}/directions/v5/mapbox/${profile}/${start.join(
      ","
    )};${end.join(",")}`
  );
  url.searchParams.set("access_token", accessToken);
  url.searchParams.set("geometries", "geojson");
  url.searchParams.set("steps", "true");
  url.searchParams.set("overview", "full");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to get directions");
  }

  usageTracker.recordDirectionsRequest()
  return response.json();
}
