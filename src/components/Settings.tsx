"use client";

import { useState } from "react";
import LocationPicker from "./ui/LocationPicker";
import { UserSettings } from "@/types";

const allOptions = [
  "American",
  "Asian",
  "Bagel Shop",
  "Bakery",
  "BBQ",
  "Bistro",
  "British",
  "Cafe",
  "Caribbean",
  "Chinese",
  "Coffee Bar",
  "Comfort Food",
  "Cuban",
  "Deli",
  "Diner",
  "Eclectic",
  "European",
  "Fine Dining",
  "French",
  "Gastropub",
  "German",
  "Greek",
  "Ice Cream",
  "Indian",
  "Irish",
  "Island/Hawaiian",
  "Italian",
  "Japanese",
  "Jewish",
  "Juice Bar",
  "Latin American",
  "Mediterranean",
  "Mexican",
  "Pizza",
  "Pub",
  "Sandwiches",
  "Seafood",
  "Southern",
  "Southwestern",
  "Spanish",
  "Steakhouse",
  "Sushi",
  "Tapas",
  "Tavern/Bar",
  "TexMex",
  "Thai",
  "Vietnamese",
  "Wine Bar",
];

const varify = (option: string): string =>
  option.split(" ").join("-").split("/").join("-").toLowerCase();
const distances = [100, 200, 300, 500, 750, 1000, 1500, 2000];

interface SettingsProps {
  settings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Settings({
  settings,
  onUpdateSettings,
  isOpen,
  onClose,
}: SettingsProps) {
  const [cuisine, setCuisine] = useState(settings.cuisine);
  const [radius, setRadius] = useState(settings.radius);
  const [location, setLocation] = useState<string | null>(
    settings.location || null
  );

  const handleSave = () => {
    const newSettings: UserSettings = {
      cuisine,
      radius,
      location: location || undefined,
    };
    onUpdateSettings(newSettings);
    onClose();
  };

  return (
    <div className={`modal-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
      <div
        id="settings-modal"
        className={`modal-container ${isOpen ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <button onClick={onClose} className="modal-close">
            ×
          </button>

          <div className="modal-header">
            <h2 className="modal-title">Settings</h2>
          </div>

          <div className="modal-actions">
            <div className="form-field">
              <label htmlFor="cuisine" className="form-label">
                Cuisine:
              </label>
              <select
                name="cuisine"
                id="cuisine"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="form-select"
              >
                {settings.cuisine !== "" ? (
                  <option value={settings.cuisine}>
                    {allOptions.find((c) => varify(c) === settings.cuisine)}
                  </option>
                ) : (
                  <option value="">--Any--</option>
                )}
                {settings.cuisine !== "" && <option value="">--Any--</option>}
                {allOptions
                  .filter((o) => varify(o) !== settings.cuisine)
                  .map((c, i) => (
                    <option key={i} value={varify(c)}>
                      {c}
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="radius" className="form-label">
                Search Area:
              </label>
              <select
                name="radius"
                id="radius"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="form-select"
              >
                <option value={settings.radius}>{`${settings.radius}m`}</option>
                {distances
                  .filter((d) => d !== settings.radius)
                  .map((r, i) => (
                    <option key={i} value={r}>{`${r}m`}</option>
                  ))}
              </select>
            </div>

            <LocationPicker value={location} onChange={setLocation} />

            <button
              className="btn btn-primary btn-full-width"
              onClick={handleSave}
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
