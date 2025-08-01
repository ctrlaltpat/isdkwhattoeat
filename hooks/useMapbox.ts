"use client";

import { useState, useEffect, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { Map, Marker } from "@/types/mapbox";
import { UserLocation } from "@/types";
import { MAPBOX_STYLE, DEFAULT_CENTER, DEFAULT_ZOOM } from "@/lib/mapbox";

export function useMapbox() {
  const [map, setMap] = useState<Map | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation>({
    lat: DEFAULT_CENTER[1],
    lng: DEFAULT_CENTER[0],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const getUserLocation = useCallback((): Promise<UserLocation> => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(location);
            resolve(location);
          },
          (error) => {
            console.warn("Geolocation error:", error);
            const defaultLocation = {
              lat: DEFAULT_CENTER[1],
              lng: DEFAULT_CENTER[0],
            };
            setUserLocation(defaultLocation);
            resolve(defaultLocation);
          }
        );
      } else {
        const defaultLocation = {
          lat: DEFAULT_CENTER[1],
          lng: DEFAULT_CENTER[0],
        };
        setUserLocation(defaultLocation);
        resolve(defaultLocation);
      }
    });
  }, []);

  const initializeMap = useCallback(
    async (container: HTMLElement): Promise<Map | null> => {
      try {
        setLoading(true);
        setError(null);

        const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
        if (!accessToken) {
          throw new Error("Mapbox access token is required");
        }

        mapboxgl.accessToken = accessToken;

        const location = await getUserLocation();

        const mapInstance = new mapboxgl.Map({
          container,
          style: MAPBOX_STYLE,
          center: [location.lng, location.lat],
          zoom: DEFAULT_ZOOM,
          attributionControl: false,
          trackResize: true,
          preserveDrawingBuffer: false,
          collectResourceTiming: false,
        });

        mapInstance.on("load", () => {
          setIsMapLoaded(true);
          setLoading(false);
        });

        mapInstance.on("error", (e) => {
          setError(
            `Failed to load map: ${e.error?.message || "Unknown error"}`
          );
          setLoading(false);
        });

        setMap(mapInstance);
        return mapInstance;
      } catch (err) {
        setError("Failed to initialize map");
        setLoading(false);
        console.error("Map initialization error:", err);
        return null;
      }
    },
    [getUserLocation]
  );

  const addMarker = useCallback(
    (lng: number, lat: number, color = "#d58936ff"): Marker | null => {
      if (!map || !isMapLoaded) return null;

      const marker = new mapboxgl.Marker({ color })
        .setLngLat([lng, lat])
        .addTo(map);

      return marker;
    },
    [map, isMapLoaded]
  );

  const flyTo = useCallback(
    (lng: number, lat: number, zoom = DEFAULT_ZOOM) => {
      if (!map || !isMapLoaded) return;

      map.flyTo({
        center: [lng, lat],
        zoom,
        essential: true,
      });
    },
    [map, isMapLoaded]
  );

  useEffect(() => {
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [map]);

  return {
    map,
    userLocation,
    loading,
    error,
    isMapLoaded,
    initializeMap,
    getUserLocation,
    addMarker,
    flyTo,
  };
}
