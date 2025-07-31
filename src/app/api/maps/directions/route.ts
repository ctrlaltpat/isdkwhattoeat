import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { z } from "zod";

const directionsSchema = z.object({
  origin: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  destination: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  travelMode: z
    .enum(["DRIVING", "WALKING", "BICYCLING", "TRANSIT"])
    .default("WALKING"),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Google Maps API not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { origin, destination, travelMode } = directionsSchema.parse(body);

    const url = new URL("https://maps.googleapis.com/maps/api/directions/json");
    url.searchParams.set("key", apiKey);
    url.searchParams.set("origin", `${origin.lat},${origin.lng}`);
    url.searchParams.set(
      "destination",
      `${destination.lat},${destination.lng}`
    );
    url.searchParams.set("mode", travelMode.toLowerCase());

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to get directions" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Directions API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
