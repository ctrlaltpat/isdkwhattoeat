"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

interface MenuProps {
  onMenuClick: (action: string) => void;
}

export default function Menu({ onMenuClick }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (action: string) => {
    if (action === "main") {
      setIsOpen(!isOpen);
    } else {
      setIsOpen(false);
      onMenuClick(action);
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        {isOpen && (
          <div className="bg-white rounded-lg shadow-xl mb-4 overflow-hidden">
            <button
              onClick={() => handleClick("random")}
              className="w-full px-6 py-4 text-left text-gray-800 hover:bg-blue-50 transition-colors border-b border-gray-100"
            >
              I Don&apos;t know what to eat!
            </button>
            <button
              onClick={() => handleClick("history")}
              className="w-full px-6 py-4 text-left text-gray-800 hover:bg-blue-50 transition-colors border-b border-gray-100"
            >
              View History
            </button>
            <button
              onClick={() => handleClick("settings")}
              className="w-full px-6 py-4 text-left text-gray-800 hover:bg-blue-50 transition-colors border-b border-gray-100"
            >
              Settings
            </button>
            <button
              onClick={handleSignOut}
              className="w-full px-6 py-4 text-left text-gray-800 hover:bg-red-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}

        {isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
          >
            ×
          </button>
        )}

        <button
          onClick={() => handleClick("main")}
          className="w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
        >
          <div className="flex flex-col space-y-1">
            <div
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            />
            <div
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <div
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            />
          </div>
        </button>
      </div>
    </>
  );
}
