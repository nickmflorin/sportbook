import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { TeamAvatar } from "~/components/images/TeamAvatar";
import { Text } from "~/components/typography/Text";
import { type ModelWithFileUrl } from "~/prisma/model";

export interface TeamScoreProps extends ComponentProps {
  readonly team: ModelWithFileUrl<"Team">;
  readonly score: number;
  readonly isLoser?: boolean;
}

export const TeamScore = ({ team, score, isLoser, ...props }: TeamScoreProps): JSX.Element => (
  <div {...props} className={classNames("team-score", { "team-score--loser": isLoser }, props.className)}>
    <TeamAvatar team={team} withName />
    <Text className="team-score__name">{team.name}</Text>
    <Text className="team-score__score">{score}</Text>
  </div>
);
