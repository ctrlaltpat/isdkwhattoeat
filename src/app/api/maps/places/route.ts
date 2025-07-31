import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { z } from "zod";

const placesSearchSchema = z.object({
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  radius: z.number().min(100).max(5000),
  keyword: z.string().optional(),
  type: z.string().optional(),
});

const placeDetailsSchema = z.object({
  placeId: z.string(),
  fields: z.array(z.string()).optional(),
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
    const { action } = body;

    if (action === "nearbySearch") {
      const { location, radius, keyword } = placesSearchSchema.parse(body);

      const url = new URL(
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
      );
      url.searchParams.set("key", apiKey);
      url.searchParams.set("location", `${location.lat},${location.lng}`);
      url.searchParams.set("radius", radius.toString());
      url.searchParams.set("type", "restaurant");
      url.searchParams.set("opennow", "true");
      if (keyword) url.searchParams.set("keyword", keyword);

      const response = await fetch(url);
      const data = await response.json();

      return NextResponse.json(data);
    }

    if (action === "placeDetails") {
      const { placeId, fields } = placeDetailsSchema.parse(body);

      const url = new URL(
        "https://maps.googleapis.com/maps/api/place/details/json"
      );
      url.searchParams.set("key", apiKey);
      url.searchParams.set("place_id", placeId);
      if (fields) {
        url.searchParams.set("fields", fields.join(","));
      }

      const response = await fetch(url);
      const data = await response.json();

      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Places API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
