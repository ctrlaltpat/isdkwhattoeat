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
  const [currentDirectionsRenderer, setCurrentDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);
  const [currentMarkers, setCurrentMarkers] = useState<google.maps.Marker[]>(
    []
  );

  const calculateTravelTimes = useCallback(
    async (
      map: google.maps.Map,
      userLocation: LatLng,
      place: GooglePlaceDetails
    ) => {
      if (!place.geometry) return;

      setLoading(true);

      if (currentDirectionsRenderer) {
        currentDirectionsRenderer.setMap(null);
      }
      currentMarkers.forEach((marker) => marker.setMap(null));
      setCurrentMarkers([]);

      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        polylineOptions: { strokeColor: "#ff8f26ff" },
        suppressMarkers: true,
      });

      setCurrentDirectionsRenderer(directionsRenderer);

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

                    if (response?.routes[0]?.legs[0]) {
                      const leg = response.routes[0].legs[0];

                      const startMarker = new google.maps.Marker({
                        position: leg.start_location,
                        map: map,
                        title: "Your Location",
                        icon: {
                          url:
                            "data:image/svg+xml;charset=UTF-8," +
                            encodeURIComponent(`
                            <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="20" cy="20" r="18" fill="#4285f4" stroke="#fff" stroke-width="2"/>
                              <circle cx="20" cy="20" r="8" fill="#fff"/>
                            </svg>
                          `),
                          scaledSize: new google.maps.Size(40, 40),
                          anchor: new google.maps.Point(20, 20),
                        },
                      });

                      const geocoder = new google.maps.Geocoder();

                      const userLocationInfo = new google.maps.InfoWindow({
                        content: `
                          <div style="padding: 12px; max-width: 250px; font-family: Arial, sans-serif;">
                            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #333;">Your Location</h3>
                            <p style="margin: 4px 0; font-size: 13px; color: #666;">Loading address...</p>
                          </div>
                        `,
                      });

                      geocoder.geocode(
                        { location: userLoc },
                        (results, status) => {
                          if (status === "OK" && results && results[0]) {
                            const userAddress =
                              results[0].formatted_address ||
                              "Address not found";

                            userLocationInfo.setContent(`
                            <div style="padding: 12px; max-width: 250px; font-family: Arial, sans-serif;">
                              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #333;">Your Location</h3>
                              <p style="margin: 4px 0; font-size: 13px; color: #666;">${userAddress}</p>
                            </div>
                          `);
                          }
                        }
                      );

                      startMarker.addListener("click", () => {
                        userLocationInfo.open(map, startMarker);
                      });

                      const endMarker = new google.maps.Marker({
                        position: leg.end_location,
                        map: map,
                        title: place.name,
                        icon: {
                          url:
                            "data:image/svg+xml;charset=UTF-8," +
                            encodeURIComponent(`
                            <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="20" cy="20" r="18" fill="#ff8f26" stroke="#fff" stroke-width="2"/>
                              <circle cx="20" cy="20" r="8" fill="#fff"/>
                            </svg>
                          `),
                          scaledSize: new google.maps.Size(40, 40),
                          anchor: new google.maps.Point(20, 20),
                        },
                      });

                      const destinationInfo = new google.maps.InfoWindow({
                        content: `
                          <div style="padding: 12px; max-width: 250px; font-family: Arial, sans-serif;">
                            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #333;">${
                              place.name
                            }</h3>
                            ${
                              place.formatted_address
                                ? `<p style="margin: 4px 0; font-size: 13px; color: #666;">${place.formatted_address}</p>`
                                : ""
                            }
                          </div>
                        `,
                      });

                      destinationInfo.open(map, endMarker);
                      endMarker.addListener("click", () => {
                        destinationInfo.open(map, endMarker);
                      });

                      setCurrentMarkers([startMarker, endMarker]);
                    }
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
    [currentDirectionsRenderer, currentMarkers]
  );

  const clearTravelTimes = useCallback(() => {
    if (currentDirectionsRenderer) {
      currentDirectionsRenderer.setMap(null);
      setCurrentDirectionsRenderer(null);
    }

    currentMarkers.forEach((marker) => marker.setMap(null));
    setCurrentMarkers([]);

    setTravelTimes(null);
  }, [currentDirectionsRenderer, currentMarkers]);

  return {
    travelTimes,
    loading,
    calculateTravelTimes,
    clearTravelTimes,
  };
}
