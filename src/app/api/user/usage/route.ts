import { NextResponse } from "next/server";
import { auth } from "@/../auth";
import { getTodayUsage, UsageData } from "@/lib/usage-tracker";

interface ApiResponse {
  error?: string;
  total?: number;
  remaining?: number;
}

export async function GET(): Promise<NextResponse<ApiResponse | UsageData>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const usage = await getTodayUsage(session.user.id);
    return NextResponse.json(usage);
  } catch (error) {
    console.error("Get usage error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
