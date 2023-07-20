import { type League } from "@prisma/client";

export type LeagueWithParticipation = League & {
  readonly teams: string[];
  readonly numParticipants: number;
};
