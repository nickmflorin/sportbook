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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <LeaguesHeader
        action={async ({ locations, ...data }) => {
          "use server";
          console.log(data);
          await prisma.league.create({ data: { createdById: userId, updatedById: userId, ...data } });
        }}
      />
      {sports.map((sport, i) => (
        <SportLeagues key={i} sport={sport} userId={userId} />
      ))}
    </div>
  );
}
