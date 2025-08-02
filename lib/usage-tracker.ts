import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const DAILY_LIMIT = 100;

export interface UsageResult {
  allowed: boolean;
  remaining: number;
}

export interface UsageData {
  total: number;
  remaining: number;
}

export type ApiEndpoint = "places_search" | "place_details" | "directions";

export async function checkAndIncrementUsage(
  userId: string,
  endpoint: ApiEndpoint
): Promise<UsageResult> {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const usage = await prisma.apiUsage.upsert({
    where: {
      userId_endpoint_date: { userId, endpoint, date: today },
    },
    update: {
      count: { increment: 1 },
    },
    create: {
      userId,
      endpoint,
      date: today,
      count: 1,
    },
  });

  return {
    allowed: usage.count <= DAILY_LIMIT,
    remaining: Math.max(0, DAILY_LIMIT - usage.count),
  };
}

export async function getTodayUsage(userId: string): Promise<UsageData> {
  const today = new Date().toISOString().split("T")[0];

  const usage = await prisma.apiUsage.findMany({
    where: { userId, date: today },
  });

  const total = usage.reduce((sum, u) => sum + u.count, 0);
  return { total, remaining: Math.max(0, DAILY_LIMIT - total) };
}

export async function getRemainingUsage(userId: string): Promise<UsageData> {
  return getTodayUsage(userId);
}
