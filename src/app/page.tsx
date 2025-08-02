"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import SignInForm from "@/components/auth/SignInForm";
import Menu from "@/components/ui/Menu";
import Map from "@/components/Map";
import Loading from "@/components/ui/Loading";
import TravelTimes from "@/components/TravelTimes";
import { GooglePlaceDetails } from "@/hooks/usePlacesSearch";
import { useUserData } from "@/hooks/useUserData";
import { useLocationHandling } from "@/hooks/useLocationHandling";
import { useTravelTimes } from "@/hooks/useTravelTimes";
import { User } from "@/types";

export default function Home() {
  const { data: session, status } = useSession();
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const {
    loading: userDataLoading,
    userSettings,
    userHistory,
    fetchUserData,
    updateSettings,
    addToHistory,
  } = useUserData();

  const { userLocation } = useLocationHandling(map, userSettings.location);

  const {
    travelTimes,
    loading: travelTimesLoading,
    calculateTravelTimes,
    clearTravelTimes,
  } = useTravelTimes();

  const [getRandomLoading, setGetRandomLoading] = useState(false);
  const loading = userDataLoading || travelTimesLoading || getRandomLoading;

  const handleMapLoad = useCallback(
    (loadedMap: google.maps.Map) => {
      console.log("Map loaded:", loadedMap);
      setMap(loadedMap);
      loadedMap.setCenter(userLocation);
    },
    [userLocation]
  );

  const handleGetDirections = (place: GooglePlaceDetails) => {
    if (map) {
      calculateTravelTimes(map, userLocation, place);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchUserData();
    }
  }, [session, fetchUserData]);

  if (status === "loading") {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!session) {
    return <SignInForm />;
  }

  return (
    <div className="app-container">
      <Map center={userLocation} onMapLoad={handleMapLoad} />
      <Menu
        user={session.user as User}
        userLocation={userLocation}
        userSettings={userSettings}
        userHistory={userHistory}
        onUpdateSettings={updateSettings}
        onAddToHistory={addToHistory}
        onGetDirections={handleGetDirections}
        setLoading={setGetRandomLoading}
      />

      {travelTimes && (
        <TravelTimes times={travelTimes} onClose={clearTravelTimes} />
      )}

      <Loading show={loading} />
    </div>
  );
}
