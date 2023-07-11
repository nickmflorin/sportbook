import { redirect } from "next/navigation";

import { Sport } from "@prisma/client";

import { prisma } from "~/lib/db";
import { getAuthUser } from "~/lib/integrations/clerk";
import { CreateLeagueButton } from "~/components/buttons/CreateLeagueButton";
import { Page } from "~/components/structural/layout";

import SportLeagues from "./SportLeagues";

export default async function Leagues() {
  const user = await getAuthUser();
  if (!user) {
    return redirect("/login");
  }
  return (
    <Page
      title="Leagues"
      actions={[
        <CreateLeagueButton
          key="0"
          action={async ({ locations: _locations, ...data }) => {
            "use server";
            await prisma.league.create({ data: { createdById: user.id, updatedById: user.id, ...data } });
          }}
        />,
      ]}
    >
      {Object.values(Sport).map((sport, i) => (
        <SportLeagues key={i} sport={sport} userId={user.id} />
      ))}
    </Page>
  );
}
