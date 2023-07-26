import { Sport, LeagueType, LeagueCompetitionLevel } from "@prisma/client";

import { EnumModel } from "./model";

export { type EnumModel } from "./model";
export * from "./types";

export const Sports = new EnumModel("sport", Sport, {
  [Sport.HOCKEY]: {
    label: "Hockey",
    icon: { name: "hockey-puck" },
    iconColor: "gray.9",
  },
});

export const LeagueTypes = new EnumModel("leagueType", LeagueType, {
  [LeagueType.ORGANIZED]: {
    label: "Organized",
    icon: { name: "sitemap" },
    badgeColor: "white",
    badgeBackgroundColor: "blue",
  },
  [LeagueType.PICKUP]: {
    label: "Pickup",
    icon: { name: "people-group" },
    badgeColor: "white",
    badgeBackgroundColor: "green",
  },
});

export const LeagueCompetitionLevels = new EnumModel("leagueCompetitionLevel", LeagueCompetitionLevel, {
  [LeagueCompetitionLevel.SOCIAL]: {
    label: "Social",
    icon: { name: "people-arrows" },
  },
  [LeagueCompetitionLevel.SOCIAL_COMPETITIVE]: {
    label: "Social/Competitive",
    icon: { name: "circle-half-stroke" },
  },
  [LeagueCompetitionLevel.COMPETITIVE]: {
    label: "Competitive",
    icon: { name: "medal" },
  },
});
