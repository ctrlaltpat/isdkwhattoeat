import { useState } from "react";
import { usePlacesSearch, GooglePlaceDetails } from "@/hooks/usePlacesSearch";
import { UserSettings, LatLng } from "@/types";

export function useGetRandom() {
  const [currentPlace, setCurrentPlace] = useState<GooglePlaceDetails | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const { searchNearby, getPlaceDetails, error } = usePlacesSearch();

  const getRandom = async (
    userLocation: LatLng,
    userSettings: UserSettings
  ) => {
    setLoading(true);
    try {
      const cuisineKeyword = userSettings.cuisine
        ? userSettings.cuisine
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        : "";
      const keyword = cuisineKeyword
        ? `${cuisineKeyword} restaurant`
        : "restaurant";

      console.log("GetRandom: Searching for:", keyword);

      const places = await searchNearby({
        location: userLocation,
        keyword,
        radius: userSettings.radius,
      });

      if (places.length === 0) {
        alert(
          "No places found. Try adjusting your search criteria or expanding your search radius."
        );
        return;
      }

      const randomPlace = places[Math.floor(Math.random() * places.length)];

      if (randomPlace?.place_id) {
        console.log("GetRandom: Selected random place:", randomPlace.name);

        const placeDetails = await getPlaceDetails(randomPlace.place_id);

        const fullPlace: GooglePlaceDetails = {
          ...placeDetails,
          place_id: randomPlace.place_id,
        };

        console.log("GetRandom: Got place details for:", fullPlace.name);
        setCurrentPlace(fullPlace);
      }
    } catch (err) {
      console.error("Failed to get random place:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    currentPlace,
    loading,
    getRandom,
    error,
  };
}
