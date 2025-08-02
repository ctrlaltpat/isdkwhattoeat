"use client";

interface TravelTimesProps {
  times: {
    walking?: string;
    driving?: string;
    transit?: string;
  };
  onClose?: () => void;
}

export default function TravelTimes({ times, onClose }: TravelTimesProps) {
  const modes = [
    { key: "walking", label: "🚶 Walking", time: times.walking },
    { key: "driving", label: "🚗 Driving", time: times.driving },
    { key: "transit", label: "🚌 Transit", time: times.transit },
  ];

  const availableModes = modes.filter((mode) => mode.time);

  if (availableModes.length === 0) return null;

  return (
    <div className="travel-times-card">
      <div className="travel-times-header">
        <h3 className="travel-times-title">Travel Times</h3>
        {onClose && (
          <button onClick={onClose} className="travel-times-close">
            ×
          </button>
        )}
      </div>
      <div className="travel-times-list">
        {availableModes.map((mode) => (
          <div key={mode.key} className="travel-time-item">
            <span className="travel-mode">{mode.label}</span>
            <span className="travel-duration">{mode.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
