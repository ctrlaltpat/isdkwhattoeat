import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { checkAndIncrementUsage } from "@/lib/usage-tracker";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const location = searchParams.get("location");
    const radius = searchParams.get("radius") || "500";

    if (!query || !location) {
      return NextResponse.json(
        { error: "Query and location are required" },
        { status: 400 }
      );
    }

    const usageResult = await checkAndIncrementUsage(
      session.user.id,
      "places_search"
    );
    if (!usageResult.allowed) {
      return NextResponse.json(
        { error: "Daily limit exceeded" },
        { status: 429 }
      );
    }

    // Forward request to Google Places API
    const url = new URL(
      "https://maps.googleapis.com/maps/api/place/textsearch/json"
    );
    url.searchParams.append("query", query);
    url.searchParams.append("location", location);
    url.searchParams.append("radius", radius);
    url.searchParams.append("key", process.env.GOOGLE_MAPS_API_KEY!);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Google API error: ${response.status}`);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Places API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
