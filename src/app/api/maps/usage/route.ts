import { NextResponse } from "next/server";
import { auth } from "@/../auth";
import { getRemainingUsage } from "@/lib/usage-tracker";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const usage = await getRemainingUsage(session.user.id);

    return NextResponse.json(usage);
  } catch (error) {
    console.error("Usage API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
