import { auth } from "@clerk/nextjs";

import { prisma } from "~/server/db";

export const Comp = async () => {
  const { userId } = auth();

  console.error({ userId });

  return <div>Leagues</div>;
};
