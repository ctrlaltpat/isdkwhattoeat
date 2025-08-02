import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const photoRef = searchParams.get("photo_reference");
    const maxWidth = searchParams.get("maxwidth") || "400";

    if (!photoRef) {
      return NextResponse.json(
        { error: "Missing photo_reference" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoRef}&key=${process.env.GOOGLE_MAPS_API_KEY}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; Next.js)",
        },
      }
    );

    if (!response.ok) {
      console.error(
        `Google Maps API error: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        { error: `API error: ${response.status}` },
        { status: response.status }
      );
    }

    const imageBuffer = await response.arrayBuffer();

    return new Response(imageBuffer, {
      headers: {
        "Content-Type": response.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Photo proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
