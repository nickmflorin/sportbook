"use server";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

import { prisma, isPrismaInvalidIdError } from "~/prisma/client";
import { type Team, type Player, type User } from "~/prisma/model";
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

export const ServerTeamDrawer = async (params: [string, string][]) => {
  const teamId = params.find(param => param[0] === "teamId")?.[1];
  if (teamId) {
    const user = await getAuthUser({ whenNotAuthenticated: () => redirect("/sign-in") });
    // At this point, the teamId can be any string that is in the URL query parameters...
    let team: (Team & { readonly players: (Player & { readonly user: User })[] }) | null = null;
    try {
      team = await prisma.team.findFirst({
        include: { players: { include: { user: true } } },
        where: {
          id: teamId,
          league: {
            OR: [
              { staff: { some: { userId: user.id } } },
              { teams: { some: { players: { some: { userId: user.id } } } } },
            ],
          },
        },
      });
    } catch (e) {
      if (!isPrismaInvalidIdError(e)) {
        throw e;
      }
    }
    if (team) {
      return <TeamDrawer team={team} />;
    }
  }
  return <></>;
};
