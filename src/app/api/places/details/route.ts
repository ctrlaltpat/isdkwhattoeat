import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { checkAndIncrementUsage } from "@/lib/usage-tracker";

interface DetailsRequest {
  placeId: string;
}

interface GooglePlacePhoto {
  height: number;
  width: number;
  photo_reference: string;
}

interface GooglePlaceHours {
  periods: Array<{
    close: {
      day: number;
      time: string;
      hours: number;
    };
    open: {
      day: number;
      time: string;
      hours: number;
    };
  }>;
  weekday_text: string[];
}

interface GooglePlaceDetailsResult {
  place_id: string;
  name: string;
  rating?: number;
  formatted_phone_number?: string;
  formatted_address?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  opening_hours?: GooglePlaceHours;
  photos?: GooglePlacePhoto[];
  price_level?: number;
  url?: string;
  website?: string;
}

interface GooglePlaceDetailsResponse {
  result: GooglePlaceDetailsResult;
  status: string;
  error_message?: string;
}

interface ApiResponse {
  result?: GooglePlaceDetailsResult;
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
      "place_details"
    );
    if (!usage.allowed) {
      return NextResponse.json(
        {
          error: "Daily limit exceeded",
          remaining: usage.remaining,
        },
        { status: 429 }
      );
    }

    const body = (await req.json()) as DetailsRequest;
    const { placeId } = body;

    const fields = [
      "place_id",
      "name",
      "rating",
      "formatted_phone_number",
      "formatted_address",
      "geometry",
      "opening_hours",
      "photos",
      "price_level",
      "url",
      "website",
    ].join(",");

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?` +
        `place_id=${placeId}&fields=${fields}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    const data = (await response.json()) as GooglePlaceDetailsResponse;

    return NextResponse.json({
      ...data,
      remaining: usage.remaining,
    });
  } catch (error) {
    console.error("Place details error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
