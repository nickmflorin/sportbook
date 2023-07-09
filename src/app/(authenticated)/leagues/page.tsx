import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";

import { prisma } from "~/server/db";

import { LeaguesHeader } from "./LeaguesHeader";
import SportLeagues from "./SportLeagues";

export default async function Leagues() {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/login");
  }
  const sports = await prisma.sport.findMany();

  async function createLeague(data: FormData) {
    "use server";
    console.log(data);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <LeaguesHeader action={createLeague} />
      {sports.map((sport, i) => (
        <SportLeagues key={i} sport={sport} userId={userId} />
      ))}
    </div>
  );
}
