import { Sport, LeagueType, LeagueCompetitionLevel, GameStatus, LeaguePlayerType } from "@prisma/client";

import { GameResultType } from "../types";

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
    badgeIconColor: "red.8",
  },
  [GameStatus.POSTPONED]: {
    label: "Postponed",
    icon: { name: "umbrella" },
    badgeIconColor: "blue",
  },
  [GameStatus.FINAL]: {
    label: "Ready to Play",
    icon: { name: "check" },
    badgeIconColor: "green",
  },
  [GameStatus.PROPOSED]: {
    label: "Proposed",
    icon: { name: "question" },
    badgeIconColor: "gray.7",
  },
});

export const LeaguePlayerTypes = new EnumModel("playerType", LeaguePlayerType, {
  [LeaguePlayerType.CAPTAIN]: {
    label: "Captain",
    icon: { name: "circle-1" },
    badgeIconColor: "green",
  },
  [LeaguePlayerType.CO_CAPTAIN]: {
    label: "Co-Captain",
    icon: { name: "circle-2" },
    badgeIconColor: "blue",
  },
  [LeaguePlayerType.PLAYER]: {
    label: "Player",
    icon: { name: "football-helmet" },
    badgeIconColor: "gray.7",
  },
});

export const GameResultTypes = new EnumModel("gameResultType", GameResultType, {
  [GameResultType.WIN]: {
    label: "Win",
  },
  [GameResultType.LOSS]: {
    label: "Loss",
  },
  [GameResultType.TIE]: {
    label: "Tie",
  },
});
