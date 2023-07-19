import { getAuthUser } from "~/lib/auth";
import { Sport } from "~/prisma";
import { Page } from "~/components/structural/layout";

import SportLeagues from "./SportLeagues";

interface LeaguesProps {
  readonly searchParams?: { query?: string };
}

export const dynamic = "force-dynamic";

export default async function Leagues({ searchParams }: LeaguesProps) {
  const user = await getAuthUser({ strict: true });
  return (
    <Page title="Leagues">
      {Object.values(Sport).map((sport, i) => (
        <SportLeagues key={i} sport={sport} userId={user.id} query={searchParams?.query} />
      ))}
    </Page>
  );
}
