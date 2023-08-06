"use server";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

import { prisma } from "~/prisma/client";
import { Loading } from "~/components/loading/Loading";
import { getAuthUser } from "~/server/auth";

const CreateLeagueDrawer = dynamic(() => import("~/components/drawers/CreateLeagueDrawer"), {
  ssr: false,
  loading: () => <Loading loading={true} />,
});

export const renderCreateLeagueDrawer = async () => {
  const user = await getAuthUser({ whenNotAuthenticated: () => redirect("/sign-in") });
  const locations = await prisma.location.findMany({ where: { createdById: user.id } });
  return <CreateLeagueDrawer locations={locations} />;
};
