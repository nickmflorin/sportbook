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

const TeamDrawer = dynamic(() => import("~/components/drawers/TeamDrawer"), {
  ssr: false,
  loading: () => <Loading loading={true} />,
});

export const renderCreateLeagueDrawer = async () => {
  const user = await getAuthUser({ whenNotAuthenticated: () => redirect("/sign-in") });
  const locations = await prisma.location.findMany({ where: { createdById: user.id } });
  return <CreateLeagueDrawer locations={locations} />;
};

export const renderTeamDrawer = async (params: [string, string][]) => {
  const teamId = params.find(param => param[0] === "teamId")?.[1];
  if (teamId) {
    const user = await getAuthUser({ whenNotAuthenticated: () => redirect("/sign-in") });
    // TODO: Build permissions as to whether or not the user is allowed to view the team.
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (team) {
      return <TeamDrawer team={team} />;
    }
  }
  return <></>;
};
