import { icons } from "~/lib/ui";
import { Sport, LeagueType, LeagueCompetitionLevel } from "~/prisma";

import { EnumModel } from "./model";

export { type EnumModel } from "./model";
export * from "./types";

export const Sports = new EnumModel("sport", Sport, {
  [Sport.HOCKEY]: {
    label: "Hockey",
    icon: icons.IconNames.HOCKEY_PUCK,
    iconColor: "gray.9",
  },
});

export const LeagueTypes = new EnumModel("leagueType", LeagueType, {
  [LeagueType.ORGANIZED]: {
    label: "Organized",
    icon: icons.IconNames.SITEMAP,
  },
  [LeagueType.PICKUP]: {
    label: "Pickup",
    icon: icons.IconNames.PEOPLE_GROUP,
  },
});

export const LeagueCompetitionLevels = new EnumModel("leagueCompetitionLevel", LeagueCompetitionLevel, {
  [LeagueCompetitionLevel.SOCIAL]: {
    label: "Social",
    icon: icons.IconNames.PEOPLE_ARROWS,
  },
  [LeagueCompetitionLevel.SOCIAL_COMPETITIVE]: {
    label: "Social/Competitive",
    icon: icons.IconNames.CIRCLE_HALF_STROKE,
  },
  [LeagueCompetitionLevel.COMPETITIVE]: {
    label: "Competitive",
    icon: icons.IconNames.MEDAL,
  },
});
