"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import GetRandom from "../GetRandom";
import History, { HistoryItem } from "../History";
import Settings from "../Settings";
import { GooglePlaceDetails } from "@/hooks/usePlacesSearch";
import { User, UserSettings, LatLng } from "@/types";

interface MenuProps {
  user: User;
  userLocation: LatLng;
  userSettings: UserSettings;
  userHistory: HistoryItem[];
  onUpdateSettings: (settings: UserSettings) => void;
  onAddToHistory: (place: GooglePlaceDetails) => void;
  onGetDirections: (place: GooglePlaceDetails) => void;
  setLoading: (loading: boolean) => void;
}

export default function Menu({
  userLocation,
  userSettings,
  userHistory,
  onUpdateSettings,
  onAddToHistory,
  onGetDirections,
  setLoading,
}: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const handleClick = (action: string) => {
    if (action === "main") {
      setIsOpen(!isOpen);
    } else {
      setIsOpen(false);
      if (activePanel === action) {
        setActivePanel(null);
      } else {
        setActivePanel(action);
      }
    }
  };

  const closePanel = () => {
    setActivePanel(null);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <>
      {isOpen && (
        <div className={`dropdown-menu ${isOpen ? "open" : ""}`}>
          <div className="dropdown-header">
            <Image
              src="/idkwhattoeat_logo.png"
              alt="IDKWhatToEat"
              width={116}
              height={24}
              className="dropdown-logo"
            />
          </div>
          <button
            onClick={() => handleClick("history")}
            className="dropdown-item"
          >
            View History
          </button>
          <button
            onClick={() => handleClick("settings")}
            className="dropdown-item"
          >
            Settings
          </button>
          <button onClick={handleSignOut} className="dropdown-item danger">
            Sign Out
          </button>
        </div>
      )}

      <button
        onClick={() => handleClick("random")}
        className="main-menu-button"
      >
        I Don&apos;t Know What to Eat!
      </button>

      <button
        onClick={() => handleClick("main")}
        className={`hamburger-button ${isOpen ? "open" : ""}`}
      >
        <div className="hamburger-line" />
        <div className="hamburger-line" />
        <div className="hamburger-line" />
      </button>

      <GetRandom
        userLocation={userLocation}
        userSettings={userSettings}
        isOpen={activePanel === "random"}
        onClose={closePanel}
        onGetDirections={onGetDirections}
        onAddToHistory={onAddToHistory}
        setLoading={setLoading}
      />

      <History
        history={userHistory}
        isOpen={activePanel === "history"}
        onClose={closePanel}
        onGetDirections={onGetDirections}
      />

      <Settings
        settings={userSettings}
        onUpdateSettings={onUpdateSettings}
        isOpen={activePanel === "settings"}
        onClose={closePanel}
      />
    </>
  );
}
