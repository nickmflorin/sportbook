import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { type ModelWithFileUrl } from "~/prisma/model";
import { ModelImage } from "~/components/images";
import { Text } from "~/components/typography";

import css from "./Versus.module.scss";

export interface VersusProps extends ComponentProps {
  readonly homeTeam: ModelWithFileUrl<"Team">;
  readonly awayTeam: ModelWithFileUrl<"Team">;
}

export const Versus = ({ homeTeam, awayTeam, ...props }: VersusProps): JSX.Element => (
  <div {...props} className={classNames(css["versus"], props.className)}>
    <div className={css["versus__team"]}>
      <ModelImage src={homeTeam.fileUrl} fallbackInitials={homeTeam.name} />
      <Text>{homeTeam.name}</Text>
    </div>
    <div className={css["versus__team"]}>
      <ModelImage src={awayTeam.fileUrl} fallbackInitials={awayTeam.name} />
      <Text>{awayTeam.name}</Text>
    </div>
  </div>
);
