import { type Team } from "~/prisma/model";

type TeamWithImage = Team & {
  readonly fileUrl: string | null;
};

export interface VersusProps {
  readonly homeTeam: TeamWithImage;
}
