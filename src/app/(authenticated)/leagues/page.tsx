import { auth } from "@clerk/nextjs";
import { type League } from "@prisma/client";

import { LeaguesTable } from "~/components/tables/LeaguesTable";
import { prisma } from "~/server/db";

export default async function Leagues() {
  const { userId } = auth();
  let leagues: League[] = [];
  if (userId) {
    leagues = await prisma.league.findMany({ where: { participants: { some: { user: { clerkId: userId } } } } });
  }
  return (
    <div>
      <LeaguesTable records={leagues} />
    </div>
  );
}
