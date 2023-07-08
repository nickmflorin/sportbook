import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";

import { prisma } from "~/server/db";

import SportLeagues from "./SportLeagues";
import { LeaguesHeader } from "./LeaguesHeader";

export default async function Leagues() {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/login");
  }
  const sports = await prisma.sport.findMany();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <LeaguesHeader />
      {sports.map((sport, i) => (
        <SportLeagues key={i} sport={sport} userId={userId} />
      ))}
    </div>
  );
}
