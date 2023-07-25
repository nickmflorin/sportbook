import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { type GameWithResult } from "~/prisma/model";

import { TeamScore } from "./TeamScore";

export interface GameScoreProps extends ComponentProps {
  readonly game: GameWithResult;
}

export const GameScore = ({ game, ...props }: GameScoreProps): JSX.Element => (
  <div {...props} className={classNames("game-score", props.className)}>
    <TeamScore
      score={game.result.homeScore}
      team={game.homeTeam}
      /* Note: We will have to revisit the determination of whether or not a team won or lost - it will obviously be
         more complicated than this. */
      isLoser={game.result.homeScore < game.result.awayScore}
    />
    <TeamScore
      score={game.result.awayScore}
      team={game.awayTeam}
      /* Note: We will have to revisit the determination of whether or not a team won or lost - it will obviously be
         more complicated than this. */
      isLoser={game.result.awayScore < game.result.homeScore}
    />
  </div>
);
