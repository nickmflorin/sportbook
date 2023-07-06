import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";

import { prisma } from "~/server/db";

import { SportLeagues } from "./SportLeagues";

export default async function Leagues() {
  const { userId } = auth();
  if (!userId) {
    return redirect("/login");
  }
  const sports = await prisma.sport.findMany();
  return (
    <div>
      {sports.map((sport, i) => (
        <SportLeagues key={i} sport={sport} userId={userId} />
      ))}
    </div>
  );
}
