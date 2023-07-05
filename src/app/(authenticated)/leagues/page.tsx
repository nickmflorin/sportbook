import { auth } from "@clerk/nextjs";
import { type League } from "@prisma/client";

import { prisma } from "~/server/db";

export default async function Leagues() {
  const { userId } = auth();
  let leagues: League[] = [];
  if (userId) {
    leagues = await prisma.league.findMany({ where: { participants: { some: { user: { clerkId: userId } } } } });
    console.log({ leagues });
  }
  return <div>{`Leagues Count: ${leagues.length}`}</div>;
}
