import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { type GameWithResult } from "~/prisma/model";
import { ModelImage } from "~/components/images";
import { Text } from "~/components/typography";

export interface GameScoreProps extends ComponentProps {
  readonly game: GameWithResult;
}

export const GameScore = ({ game, ...props }: GameScoreProps): JSX.Element => (
  <div {...props} className={classNames("game-score", props.className)}>
    <div
      className={classNames(
        "game-score__team",
        /* Note: We will have to revisit the determination of whether or not a team won or lost - it will obviously be
           more complicated than this. */
        { "game-score__team-loser": game.result.homeScore < game.result.awayScore },
      )}
    >
      <ModelImage src={game.homeTeam.fileUrl} fallbackInitials={game.homeTeam.name} />
      <Text className="game-score__team__name">{game.homeTeam.name}</Text>
      <Text className="game-score__team__score">{game.result.homeScore}</Text>
    </div>
    <div
      className={classNames(
        "game-score__team",
        /* Note: We will have to revisit the determination of whether or not a team won or lost - it will obviously be
           more complicated than this. */
        { "game-score__team-loser": game.result.awayScore < game.result.homeScore },
      )}
    >
      <ModelImage src={game.awayTeam.fileUrl} fallbackInitials={game.awayTeam.name} />
      <Text className="game-score__team__name">{game.awayTeam.name}</Text>
      <Text className="game-score__team__score">{game.result.awayScore}</Text>
    </div>
  </div>
);
