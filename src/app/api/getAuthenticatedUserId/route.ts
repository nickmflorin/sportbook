import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { logger } from "~/internal/logger";

export async function GET(request: Request) {
  const { userId, sessionId } = auth();
  logger.error({ userId, sessionId });
  if (!sessionId) {
    return NextResponse.json({ id: null }, { status: 401 });
  }
  return NextResponse.json({ id: userId }, { status: 200 });
}
