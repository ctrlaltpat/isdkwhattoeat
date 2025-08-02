"use client";

import { GooglePlaceDetails } from "@/hooks/usePlacesSearch";
import { UserSettings, LatLng } from "@/types";
import { useGetRandom } from "@/hooks/useGetRandom";
import Place from "./Place";

interface GetRandomProps {
  userLocation: LatLng;
  userSettings: UserSettings;
  isOpen: boolean;
  onClose: () => void;
  onGetDirections: (place: GooglePlaceDetails) => void;
  onAddToHistory: (place: GooglePlaceDetails) => void;
  setLoading: (loading: boolean) => void;
}

export default function GetRandom({
  userLocation,
  userSettings,
  isOpen,
  onClose,
  onGetDirections,
  onAddToHistory,
  setLoading,
}: GetRandomProps) {
  const {
    currentPlace,
    loading: getRandomLoading,
    getRandom,
    error,
  } = useGetRandom();

  const handleGetRandom = async () => {
    setLoading(true);
    try {
      await getRandom(userLocation, userSettings);
    } catch (err) {
      if (err instanceof Error && err.message.includes("Unauthorized")) {
        alert("Please sign in to use this feature.");
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGetDirections = () => {
    if (currentPlace) {
      onAddToHistory(currentPlace);
      onGetDirections(currentPlace);
      onClose();
    }
  };

  const handleOpenInGoogleMaps = () => {
    if (currentPlace && currentPlace.geometry) {
      const { lat, lng } = currentPlace.geometry.location;
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${currentPlace.place_id}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className={`modal-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
      <div
        id="random-modal"
        className={`modal-container ${isOpen ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <button onClick={onClose} className="modal-close">
            ×
          </button>

          {error && <div className="error-message">{error}</div>}

          {currentPlace && (
            <div className="mb-6">
              <Place place={currentPlace} showImages={true} />
            </div>
          )}

          <div className="modal-actions">
            <button
              className="btn btn-primary btn-full-width"
              onClick={handleGetRandom}
              disabled={getRandomLoading}
            >
              {getRandomLoading
                ? "Loading..."
                : `Get ${currentPlace ? "Another" : ""} Random Place`}
            </button>

            {currentPlace && (
              <>
                <button
                  className="btn btn-secondary btn-full-width"
                  onClick={handleGetDirections}
                >
                  Get Directions
                </button>

                <button
                  className="btn btn-outline btn-full-width"
                  onClick={handleOpenInGoogleMaps}
                >
                  Open in Google Maps
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
