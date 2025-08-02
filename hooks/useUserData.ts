import { useState, useCallback } from "react";
import { GooglePlaceDetails } from "@/hooks/usePlacesSearch";

interface UserSettings {
  cuisine: string;
  radius: number;
  location?: string;
}

interface HistoryItem {
  id: string;
  placeObj: string | GooglePlaceDetails;
  createdAt: string;
}

export function useUserData() {
  const [loading, setLoading] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings>({
    cuisine: "",
    radius: 500,
  });
  const [userHistory, setUserHistory] = useState<HistoryItem[]>([]);

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/user");
      if (response.ok) {
        const data = await response.json();

        if (data.settings) {
          setUserSettings(data.settings);
        }
        if (data.history) {
          setUserHistory(data.history);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (newSettings: UserSettings) => {
    setLoading(true);
    try {
      const response = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });

      if (response.ok) {
        setUserSettings(newSettings);
      }
    } catch (error) {
      console.error("Failed to update settings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToHistory = useCallback(async (place: GooglePlaceDetails) => {
    setLoading(true);
    try {
      const response = await fetch("/api/user/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeObj: JSON.stringify(place) }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setUserHistory((prev) => [responseData, ...prev]);
      }
    } catch (error) {
      console.error("Failed to add to history:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    userSettings,
    userHistory,
    fetchUserData,
    updateSettings,
    addToHistory,
  };
}
