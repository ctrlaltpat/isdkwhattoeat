export const mapStyles = [
  {
    featureType: "all",
    elementType: "all",
    stylers: [
      { visibility: "simplified" },
      { hue: "#0083ff" },
      { invert_lightness: true },
    ],
  },
  {
    featureType: "all",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry.fill",
    stylers: [{ color: "#070c18" }],
  },
  {
    featureType: "water",
    elementType: "all",
    stylers: [{ color: "#003b73" }],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [{ color: "#004e92" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#FFFFFF" }],
  },
];

interface GoogleMaps {
  maps: {
    Map: unknown;
    places: {
      PlacesService: unknown;
      PlacePhoto: unknown;
    };
    LatLng: unknown;
  };
}

export function loadGoogleMaps(): Promise<GoogleMaps> {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.google) {
      resolve(window.google);
      return;
    }

    window.resolveGoogleMapsPromise = function () {
      resolve(window.google);
      delete window.resolveGoogleMapsPromise;
    };

    // Load script from our secure API endpoint
    const script = document.createElement("script");
    script.id = "mapscript";
    script.src = "/api/maps/script";
    script.async = true;
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.body.appendChild(script);
  });
}

declare global {
  interface Window {
    google: GoogleMaps;
    resolveGoogleMapsPromise?: () => void;
  }
}
