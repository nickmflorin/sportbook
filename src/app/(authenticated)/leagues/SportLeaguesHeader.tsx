import { type Sport } from "@prisma/client";

import { Text } from "~/components/typography/Text";

export interface SportLeaguesHeaderProps {
  readonly sport: Sport;
}

export const SportLeaguesHeader = ({ sport }: SportLeaguesHeaderProps): JSX.Element => (
  <div className="sport-leagues__header">
    <Text color="gray.8">{sport.name}</Text>
  </div>
);
