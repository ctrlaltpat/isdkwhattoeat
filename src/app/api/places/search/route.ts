import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { checkAndIncrementUsage } from "@/lib/usage-tracker";

interface SearchRequest {
  location: {
    lat: number;
    lng: number;
  };
  keyword: string;
  radius: number;
}

interface GooglePlaceResult {
  place_id: string;
  name: string;
  rating?: number;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
  vicinity?: string;
  price_level?: number;
  opening_hours?: {
    open_now: boolean;
  };
}

interface GooglePlacesResponse {
  results: GooglePlaceResult[];
  status: string;
  error_message?: string;
}

interface ApiResponse {
  results?: GooglePlaceResult[];
  status?: string;
  error?: string;
  remaining?: number;
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const usage = await checkAndIncrementUsage(
      session.user.id,
      "places_search"
    );
    if (!usage.allowed) {
      return NextResponse.json(
        {
          error: "Daily limit exceeded :( . Please try again tomorrow.",
          remaining: usage.remaining,
        },
        { status: 429 }
      );
    }

    const body = (await req.json()) as SearchRequest;
    const { location, keyword, radius } = body;

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
        `location=${location.lat},${location.lng}` +
        `&keyword=${encodeURIComponent(keyword)}` +
        `&radius=${radius}` +
        `&type=restaurant` +
        `&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    const data = (await response.json()) as GooglePlacesResponse;

    return NextResponse.json({
      ...data,
      remaining: usage.remaining,
    });
  } catch (error) {
    console.error("Places search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
