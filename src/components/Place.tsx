import PlaceImages from "./PlaceImages";
import { GooglePlaceDetails } from "@/hooks/usePlacesSearch";

interface PlaceProps {
  place: GooglePlaceDetails;
  showImages?: boolean;
  onGetDirections?: (place: GooglePlaceDetails) => void;
}

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="star-rating">
      {Array(fullStars)
        .fill(0)
        .map((_, i) => (
          <span key={`full-${i}`} className="star filled">
            ★
          </span>
        ))}
      {hasHalfStar && <span className="star filled">☆</span>}
      {Array(emptyStars)
        .fill(0)
        .map((_, i) => (
          <span key={`empty-${i}`} className="star empty">
            ☆
          </span>
        ))}
      <span className="rating-text">({rating})</span>
    </div>
  );
};

const getClosingTime = (
  hours: GooglePlaceDetails["opening_hours"]
): string | null => {
  if (!hours?.periods || hours.periods.length === 0) {
    return null;
  }

  const today = new Date().getDay();
  const todayPeriod = hours.periods.find(
    (period) => period.open?.day === today
  );

  if (todayPeriod?.close?.time) {
    const timeStr = todayPeriod.close.time;

    if (timeStr.length === 4) {
      const hours24 = parseInt(timeStr.substring(0, 2));
      const minutes = timeStr.substring(2, 4);

      if (!isNaN(hours24)) {
        const isPM = hours24 >= 12;
        const hours12 =
          hours24 === 0 ? 12 : hours24 > 12 ? hours24 - 12 : hours24;
        const ampm = isPM ? "PM" : "AM";

        return `Closes at ${hours12}:${minutes} ${ampm}`;
      }
    }
  }

  return null;
};

export default function Place({
  place,
  showImages = false,
  onGetDirections,
}: PlaceProps) {
  const priceSymbols = place.price_level
    ? Array(place.price_level).fill("£").join("")
    : "";

  const handleOpenInGoogleMaps = () => {
    if (place.geometry) {
      const { lat, lng } = place.geometry.location;
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${place.place_id}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="place-card">
      <div className="place-name">
        <a
          target="_blank"
          href={place.website || place.url}
          rel="noopener noreferrer"
        >
          {place.name}
        </a>
      </div>

      {place.rating && (
        <div className="place-rating">{renderStars(place.rating)}</div>
      )}

      {priceSymbols && <div className="place-price">{priceSymbols}</div>}

      {place.formatted_address && (
        <div className="place-address">{place.formatted_address}</div>
      )}

      {place.formatted_phone_number && (
        <a className="place-phone" href={`tel:${place.formatted_phone_number}`}>
          {place.formatted_phone_number}
        </a>
      )}

      {showImages && place.photos && (
        <div className="place-images">
          <PlaceImages images={place.photos} />
        </div>
      )}

      <div className="place-hours">{getClosingTime(place.opening_hours)}</div>

      {!showImages && onGetDirections && (
        <div className="place-actions">
          <button
            className="btn btn-primary btn-small"
            onClick={() => onGetDirections(place)}
          >
            Get Directions
          </button>

          <button
            className="btn btn-outline btn-small"
            onClick={handleOpenInGoogleMaps}
          >
            Open in Maps
          </button>
        </div>
      )}
    </div>
  );
}
