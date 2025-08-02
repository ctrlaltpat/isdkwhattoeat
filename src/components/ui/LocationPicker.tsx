"use client";

import { useState } from "react";

interface LocationPickerProps {
  value?: string | null;
  onChange: (location: string | null) => void;
}

export default function LocationPicker({
  value,
  onChange,
}: LocationPickerProps) {
  const [inputValue, setInputValue] = useState(value || "");
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<
    "valid" | "invalid" | null
  >(null);
  const [validationMessage, setValidationMessage] = useState<string>("");

  const validateLocation = async (locationString: string) => {
    if (!locationString.trim()) {
      setValidationStatus(null);
      setValidationMessage("");
      return;
    }

    setIsValidating(true);
    setValidationStatus(null);

    try {
      if (!window.google?.maps?.Geocoder) {
        setValidationStatus("invalid");
        setValidationMessage("Maps service not available");
        setIsValidating(false);
        return;
      }

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: locationString }, (results, status) => {
        setIsValidating(false);

        if (status === "OK" && results && results[0]) {
          const result = results[0];
          const formattedAddress = result.formatted_address;
          setValidationStatus("valid");
          setValidationMessage(`Found: ${formattedAddress}`);
        } else {
          setValidationStatus("invalid");
          if (status === "ZERO_RESULTS") {
            setValidationMessage(
              "Location not found. Please check spelling or try a different format."
            );
          } else if (status === "OVER_QUERY_LIMIT") {
            setValidationMessage("Too many requests. Please try again later.");
          } else {
            setValidationMessage(
              "Unable to verify location. Please check spelling."
            );
          }
        }
      });
    } catch (error) {
      console.log(error);
      setIsValidating(false);
      setValidationStatus("invalid");
      setValidationMessage("Error validating location");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue || null);

    setValidationStatus(null);
    setValidationMessage("");
  };

  const handleInputBlur = () => {
    if (inputValue.trim()) {
      validateLocation(inputValue.trim());
    }
  };

  const handleClearLocation = () => {
    setInputValue("");
    onChange(null);
    setValidationStatus(null);
    setValidationMessage("");
  };

  return (
    <div className="form-field">
      <label htmlFor="location" className="form-label">
        Set Location (optional):
      </label>
      <div className="location-input-container">
        <input
          id="location"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder="Enter postcode, zip code, or city..."
          className={`form-input ${
            validationStatus === "valid"
              ? "location-valid"
              : validationStatus === "invalid"
              ? "location-invalid"
              : ""
          }`}
        />
        {value && (
          <button
            type="button"
            onClick={handleClearLocation}
            className="location-clear-btn"
            title="Clear location"
          >
            ×
          </button>
        )}
        {isValidating && (
          <div className="location-validating">
            <div className="location-spinner"></div>
          </div>
        )}
      </div>

      {validationMessage && (
        <div
          className={`location-validation ${
            validationStatus === "valid"
              ? "location-validation-success"
              : "location-validation-error"
          }`}
        >
          {validationStatus === "valid" ? "✓" : "⚠"} {validationMessage}
        </div>
      )}

      <div className="location-help">
        Enter a postcode (e.g., &quot;SW1A 1AA&quot;), zip code (e.g.,
        &quot;10001&quot;), or city name
      </div>
    </div>
  );
}
