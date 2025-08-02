"use client";

import Place from "./Place";
import { GooglePlaceDetails } from "@/hooks/usePlacesSearch";

export interface HistoryItem {
  id: string;
  placeObj: string | GooglePlaceDetails;
  createdAt: string;
}

interface HistoryProps {
  history: HistoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onGetDirections: (place: GooglePlaceDetails) => void;
}

export default function History({
  history,
  isOpen,
  onClose,
  onGetDirections,
}: HistoryProps) {
  const places = history
    .map((item, idx) => {
      try {
        let place: GooglePlaceDetails;
        if (typeof item.placeObj === "string") {
          place = JSON.parse(item.placeObj) as GooglePlaceDetails;
        } else {
          place = item.placeObj as GooglePlaceDetails;
        }

        return (
          <Place
            key={`${item.id}~${idx}`}
            place={place}
            onGetDirections={onGetDirections}
          />
        );
      } catch (error) {
        console.error("Error parsing place data:", error);
        return null;
      }
    })
    .filter(Boolean);

  return (
    <div className={`modal-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
      <div
        id="history-modal"
        className={`modal-container ${isOpen ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <button onClick={onClose} className="modal-close">
            ×
          </button>

          <div className="modal-header">
            <h2 className="modal-title">History</h2>
          </div>

          <div className="modal-actions">
            {places.length > 0 ? (
              places
            ) : (
              <p className="text-center">{"You don't have any history yet."}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
