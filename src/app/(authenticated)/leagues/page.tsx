import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";
import { Sport } from "@prisma/client";

import { prisma } from "~/server/db";

import { LeaguesHeader } from "./LeaguesHeader";
import SportLeagues from "./SportLeagues";

export default async function Leagues() {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/login");
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <LeaguesHeader
        action={async ({ locations: _locations, ...data }) => {
          "use server";
          await prisma.league.create({ data: { createdById: userId, updatedById: userId, ...data } });
        }}
      />
      {Object.values(Sport).map((sport, i) => (
        <SportLeagues key={i} sport={sport} userId={userId} />
      ))}
    </div>
  );
}
