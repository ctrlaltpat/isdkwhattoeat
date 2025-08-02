"use client";

import Image from "next/image";

interface LoadingProps {
  show: boolean;
}

export default function Loading({ show }: LoadingProps) {
  if (!show) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-wrapper">
        <Image
          src="/loading-pin.png"
          alt="Loading..."
          width={96}
          height={154}
          className="loading-pin"
          priority
        />
      </div>
    </div>
  );
}
