import { useState, useCallback } from "react";
import { LatLng, GooglePlacePhoto } from "@/types";

export interface SearchParams {
  location: LatLng;
  keyword: string;
  radius: number;
}

export interface GooglePlaceResult {
  place_id: string;
  name: string;
  rating?: number;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
  vicinity?: string;
  price_level?: number;
  opening_hours?: {
    open_now: boolean;
  };
}

export interface GooglePlaceDetails {
  place_id: string;
  name: string;
  rating?: number;
  formatted_phone_number?: string;
  formatted_address?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  opening_hours?: {
    periods: Array<{
      close: {
        day: number;
        time: string;
        hours: number;
      };
      open: {
        day: number;
        time: string;
        hours: number;
      };
    }>;
    weekday_text: string[];
  };
  photos?: GooglePlacePhoto[];
  price_level?: number;
  url?: string;
  website?: string;
}

export function usePlacesSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchNearby = useCallback(
    async (params: SearchParams): Promise<GooglePlaceResult[]> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/places/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Search failed");
        }

        const data = await response.json();
        return data.results || [];
      } catch (err) {
        const message = err instanceof Error ? err.message : "Search failed";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getPlaceDetails = useCallback(
    async (placeId: string): Promise<GooglePlaceDetails> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/places/details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ placeId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to get place details");
        }

        const data = await response.json();
        return data.result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to get details";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { searchNearby, getPlaceDetails, loading, error };
}
