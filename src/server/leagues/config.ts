import { Sport, type League } from "@prisma/client";

import { prisma } from "~/prisma/client";
import { type PrismaModelType, type ModelConcreteField, getModelDefaultFieldValue } from "~/prisma/model";

type LeagueConfigModelName<S extends Sport = Sport> = {
  [Sport.HOCKEY]: "HockeyLeagueConfig";
}[S];

type LeagueConfigAndFields<M extends LeagueConfigModelName, F extends ModelConcreteField<M> = ModelConcreteField<M>> = {
  readonly model: M;
  readonly fieldName: keyof League;
  readonly defaultFields: { [key in F]: PrismaModelType<M>[key] };
};

type LeagueSportsConfigType<S extends Sport> = {
  [Sport.HOCKEY]: LeagueConfigAndFields<"HockeyLeagueConfig", "tieBreakers" | "standingsMethod">;
}[S];

type LeagueSportConfigMeta<S extends Sport> = {
  readonly defaultFields: LeagueSportsConfigType<S>["defaultFields"];
  readonly sport: S;
};

export type LeagueConfig<S extends Sport = Sport> = S extends Sport
  ? LeagueSportsConfigType<S>["defaultFields"] & { sport: S }
  : never;

export const LeagueSportsConfigs: { [key in Sport]: LeagueSportConfigMeta<key> } = {
  [Sport.HOCKEY]: {
    sport: Sport.HOCKEY,
    defaultFields: {
      tieBreakers: getModelDefaultFieldValue("HockeyLeagueConfig", "tieBreakers"),
      standingsMethod: getModelDefaultFieldValue("HockeyLeagueConfig", "standingsMethod"),
    },
  },
};

export async function getLeagueConfig(league: League | League["id"]): Promise<LeagueConfig> {
  let _league: League;
  if (typeof league === "string") {
    // We cannot include the config in the query because we do not know what sport the league is associated with yet.
    _league = await prisma.league.findUniqueOrThrow({ where: { id: league } });
  } else {
    _league = league;
  }
  switch (_league.sport) {
    case Sport.HOCKEY:
      const config = await prisma.hockeyLeagueConfig.findUnique({ where: { leagueId: _league.id } });
      if (!config) {
        return { ...LeagueSportsConfigs[Sport.HOCKEY].defaultFields, sport: Sport.HOCKEY };
      }
      return { ...config, sport: Sport.HOCKEY };
  }
}
