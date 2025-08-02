import { useState, useCallback } from "react";
import { GooglePlaceDetails } from "@/hooks/usePlacesSearch";
import { LatLng } from "@/types";

interface TravelTimes {
  walking?: string;
  driving?: string;
  transit?: string;
}

export function useTravelTimes() {
  const [travelTimes, setTravelTimes] = useState<TravelTimes | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateTravelTimes = useCallback(
    async (
      map: google.maps.Map,
      userLocation: LatLng,
      place: GooglePlaceDetails
    ) => {
      if (!place.geometry) return;

      setLoading(true);
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        polylineOptions: { strokeColor: "#E87527" },
      });

      const userLoc = new google.maps.LatLng(
        userLocation.lat,
        userLocation.lng
      );
      const placeLoc = new google.maps.LatLng(
        place.geometry.location.lat,
        place.geometry.location.lng
      );

      const times: TravelTimes = {};

      const modes = [
        { key: "walking", mode: google.maps.TravelMode.WALKING },
        { key: "driving", mode: google.maps.TravelMode.DRIVING },
        { key: "transit", mode: google.maps.TravelMode.TRANSIT },
      ];

      for (const { key, mode } of modes) {
        try {
          await new Promise<void>((resolve) => {
            directionsService.route(
              {
                origin: userLoc,
                destination: placeLoc,
                travelMode: mode,
              },
              (response, status) => {
                if (status === "OK" && response?.routes[0]?.legs[0]) {
                  const duration = response.routes[0].legs[0].duration?.text;
                  if (duration) {
                    times[key as keyof TravelTimes] = duration;
                  }

                  if (key === "walking") {
                    directionsRenderer.setDirections(response);
                  }
                }
                resolve();
              }
            );
          });
        } catch (error) {
          console.log(`Failed to get ${key} directions:`, error);
        }
      }

      setTravelTimes(times);
      setLoading(false);
    },
    []
  );

  const clearTravelTimes = useCallback(() => {
    setTravelTimes(null);
  }, []);

  return {
    travelTimes,
    loading,
    calculateTravelTimes,
    clearTravelTimes,
  };
}
