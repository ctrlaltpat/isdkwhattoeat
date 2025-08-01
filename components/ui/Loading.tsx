"use client";

import Image from "next/image";

interface LoadingProps {
  show: boolean;
}

export default function Loading({ show }: LoadingProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent">
      <div className="bg-transparent flex flex-col items-center">
        <div
          className="mb-4 flex justify-center items-center"
          style={{
            perspective: "1000px",
            width: "96px",
            height: "154px",
          }}
        >
          <Image
            src="/loading-pin.png"
            alt="Loading..."
            width={96}
            height={154}
            className="animate-spin-y"
            style={{
              transformStyle: "preserve-3d",
              animation: "spinY 2s linear infinite",
            }}
            priority
          />
        </div>
      </div>
    </div>
  );
}
