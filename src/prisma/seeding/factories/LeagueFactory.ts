import { LeagueCompetitionLevel, LeagueType } from "@prisma/client";

import { ModelFactory } from "./Factory";

export const LeagueFactory = new ModelFactory("League", {
  modelFields: {
    name: params => `League ${params.count}`,
    description: params => params.factory.randomSentence(),
    leagueStart: params => params.factory.randomDate(),
    leagueEnd: params => params.factory.randomDate(),
    competitionLevel: params => params.factory.randomEnum(LeagueCompetitionLevel),
    leagueType: params => params.factory.randomEnum(LeagueType),
    isPublic: () => true, // TOOD: Revisit this.
  },
});
