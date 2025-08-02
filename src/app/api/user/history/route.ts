import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const addHistorySchema = z.object({
  placeObj: z.string().min(1, "Place data is required"),
});

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const history = await prisma.userHistory.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const parsedHistory = history.map((item) => ({
      ...item,
      placeObj: JSON.parse(item.placeObj),
    }));

    return NextResponse.json(parsedHistory);
  } catch (error) {
    console.error("Get history error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { placeObj } = addHistorySchema.parse(body);

    try {
      JSON.parse(placeObj);
    } catch {
      return NextResponse.json(
        { error: "Invalid place data format" },
        { status: 400 }
      );
    }

    const historyItem = await prisma.userHistory.create({
      data: {
        userId: session.user.id,
        placeObj,
      },
    });

    return NextResponse.json({
      ...historyItem,
      placeObj: JSON.parse(historyItem.placeObj),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Add history error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
