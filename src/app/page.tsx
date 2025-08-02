"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import SignInForm from "@/components/auth/SignInForm";
import Menu from "@/components/ui/Menu";
import Map from "@/components/Map";
import Loading from "@/components/ui/Loading";
import { useUserData } from "@/hooks/useUserData";
import { useLocationHandling } from "@/hooks/useLocationHandling";

export default function Home() {
  const { data: session, status } = useSession();
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const {
    loading: userDataLoading,
    userSettings,
    fetchUserData,
  } = useUserData();

  const { userLocation } = useLocationHandling(map, userSettings.location);

  const loading = userDataLoading;

  const handleMapLoad = useCallback(
    (loadedMap: google.maps.Map) => {
      console.log("Map loaded:", loadedMap);
      setMap(loadedMap);
      loadedMap.setCenter(userLocation);
    },
    [userLocation]
  );

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
      <Menu/>
      <Loading show={loading} />
    </div>
  );
}
