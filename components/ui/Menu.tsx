"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";

export default function Menu() {
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

      {activePanel === "random" && (
        <div className="random-panel">
          <h2>Get Random Place</h2>
          <button onClick={() => setActivePanel(null)}>Close</button>
        </div>
      )}

      {activePanel === "history" && (
        <div className="history-panel">
          <h2>History</h2>
          <button onClick={() => setActivePanel(null)}>Close</button>
        </div>
      )}

      {activePanel === "settings" && (
        <div className="settings-panel">
          <h2>Settings</h2>
          <button onClick={() => setActivePanel(null)}>Close</button>
        </div>
      )}
    </>
  );
}
