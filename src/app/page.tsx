"use client";

import { useSession } from "next-auth/react";
import SignInForm from "@/components/auth/SignInForm";
import Menu from "@/components/ui/Menu";
import MapboxMap from "@/components/map/MapboxMap";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
        <SignInForm />
      </div>
    );
  }

  const handleMapReady = () => {
    console.log("Map is ready");
  };

  const handleMenuClick = (action: string) => {
    console.log("Menu action:", action);
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <Menu onMenuClick={handleMenuClick} />
      <MapboxMap onMapReady={handleMapReady} className="w-full h-full" />
    </div>
  );
}
