"use client";

import { useEffect, useRef } from "react";
import { useMapbox } from "@/hooks/useMapbox";
import { Map } from "@/types/mapbox";

interface MapboxMapProps {
  onMapReady?: (map: Map) => void;
  className?: string;
}

export default function MapboxMap({
  onMapReady,
  className = "w-full h-full",
}: MapboxMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const { map, loading, error, isMapLoaded, initializeMap } = useMapbox();

  useEffect(() => {
    if (mapRef.current && !map) {
      initializeMap(mapRef.current).then((mapInstance) => {
        if (mapInstance && onMapReady) {
          if (isMapLoaded) {
            onMapReady(mapInstance);
          } else {
            mapInstance.on("load", () => {
              onMapReady(mapInstance);
            });
          }
        }
      });
    }
  }, [map, initializeMap, onMapReady, isMapLoaded]);

  if (error) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gray-100`}
      >
        <div className="text-center p-8">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-gray-700 font-medium">Failed to load map</p>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ 
          minHeight: "400px",
          height: "100%",
          width: "100%"
        }}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
