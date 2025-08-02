import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { checkAndIncrementUsage } from "@/lib/usage-tracker";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const usageResult = await checkAndIncrementUsage(
      session.user.id,
      "directions"
    );
    if (!usageResult.allowed) {
      return NextResponse.json(
        { error: "Daily limit exceeded" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { origin, destination, travelMode = "WALKING" } = body;

    if (!origin || !destination) {
      return NextResponse.json(
        { error: "Origin and destination are required" },
        { status: 400 }
      );
    }

    const url = new URL("https://maps.googleapis.com/maps/api/directions/json");
    url.searchParams.append("origin", `${origin.lat},${origin.lng}`);
    url.searchParams.append(
      "destination",
      `${destination.lat},${destination.lng}`
    );
    url.searchParams.append("mode", travelMode.toLowerCase());
    url.searchParams.append("key", process.env.GOOGLE_MAPS_API_KEY!);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Google API error: ${response.status}`);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Directions API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
