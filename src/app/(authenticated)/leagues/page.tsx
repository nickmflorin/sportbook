import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";

import { prisma } from "~/server/db";

const SportLeagues = dynamic(() => import("./SportLeagues"));

export default async function Leagues() {
  const { userId } = auth();
  if (!userId) {
    return redirect("/login");
  }
  const sports = await prisma.sport.findMany();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {sports.map((sport, i) => (
        <SportLeagues key={i} sport={sport} userId={userId} />
      ))}
    </div>
  );
}
