import { Sport, LeagueType, LeagueCompetitionLevel, GameStatus } from "@prisma/client";

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

export const GameStatuses = new EnumModel("gameStatus", GameStatus, {
  [GameStatus.CANCELLED]: {
    label: "Cancelled",
    icon: { name: "xmark" },
    badgeColor: "gray.7",
    badgeIconColor: "red.8",
    badgeBorderColor: "gray.4",
    badgeBackgroundColor: "white",
  },
  [GameStatus.POSTPONED]: {
    label: "Postponed",
    icon: { name: "calendar-clock" },
    badgeColor: "gray.7",
    badgeIconColor: "blue",
    badgeBackgroundColor: "white",
    badgeBorderColor: "gray.4",
  },
  [GameStatus.FINAL]: {
    label: "Ready to Play",
    icon: { name: "check" },
    badgeColor: "gray.7",
    badgeIconColor: "green",
    badgeBackgroundColor: "white",
    badgeBorderColor: "gray.4",
  },
  [GameStatus.PROPOSED]: {
    label: "Proposed",
    icon: { name: "question-circle" },
    badgeColor: "gray.7",
    badgeIconColor: "gray.7",
    badgeBackgroundColor: "white",
    badgeBorderColor: "gray.4",
  },
});
