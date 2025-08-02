"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface MapProps {
  center: { lat: number; lng: number };
  onMapLoad?: (map: google.maps.Map) => void;
}

const mapStyles: google.maps.MapTypeStyle[] = [
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
    elementType: "geometry",
    stylers: [{ color: "#004e92" }],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry.fill",
    stylers: [{ color: "#070c18" }],
  },
  {
    featureType: "transit.line",
    elementType: "all",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "transit.line",
    elementType: "labels",
    stylers: [{ color: "#004e92" }],
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
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#1b2687" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#1b2687" }],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [{ color: "#4e4e4e" }],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [{ color: "#FFFFFF" }],
  },
];

export default function Map({ center, onMapLoad }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    if (map) return;

    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: "weekly",
      libraries: ["places"],
    });

    loader
      .load()
      .then(() => {
        if (mapRef.current && !map) {
          const googleMap = new google.maps.Map(mapRef.current, {
            center,
            zoom: 15,
            styles: mapStyles,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            cameraControlOptions: {
              position: google.maps.ControlPosition.RIGHT_CENTER
            },
            zoomControlOptions: {
              position: google.maps.ControlPosition.LEFT_BOTTOM,
            },
          });

          setMap(googleMap);
          onMapLoad?.(googleMap);
        }
      })
      .catch((error) => {
        console.error("Error loading Google Maps:", error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (map && center) {
      map.setCenter(center);
    }
  }, [map, center]);

  return <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
}
