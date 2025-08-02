import { useState, useEffect, useCallback } from "react";

export function useLocationHandling(
  map: google.maps.Map | null,
  userSettingsLocation?: string
) {
  const [userLocation, setUserLocation] = useState({
    lat: 51.5163002,
    lng: -0.13090374,
  });
  const [locationRequested, setLocationRequested] = useState(false);

  const geocodeLocation = useCallback(
    (locationString: string) => {
      if (!window.google?.maps?.Geocoder) {
        console.warn("Google Maps Geocoder not available");
        return;
      }

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: locationString }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const location = results[0].geometry.location;
          const newLocation = {
            lat: location.lat(),
            lng: location.lng(),
          };
          setUserLocation(newLocation);
          if (map) {
            map.setCenter(newLocation);
            map.setZoom(14);
          }
          console.log(
            "Successfully geocoded location:",
            locationString,
            "to:",
            newLocation
          );
        } else {
          console.log(
            "Geocoding failed for location:",
            locationString,
            "Status:",
            status
          );
        }
      });
    },
    [map]
  );

  const requestUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(newLocation);
          if (map) {
            map.setCenter(newLocation);
          }
        },
        (error) => {
          console.log("Location error:", error);
        }
      );
    }
  }, [map]);

  useEffect(() => {
    if (!locationRequested) {
      if (userSettingsLocation) {
        geocodeLocation(userSettingsLocation);
      } else {
        requestUserLocation();
      }
      setLocationRequested(true);
    }
  }, [
    geocodeLocation,
    locationRequested,
    userSettingsLocation,
    requestUserLocation,
  ]);

  useEffect(() => {
    if (locationRequested && userSettingsLocation) {
      geocodeLocation(userSettingsLocation);
    }
  }, [userSettingsLocation, locationRequested, geocodeLocation]);

  return {
    userLocation,
    setUserLocation,
    geocodeLocation,
  };
}
