import { LeaguePlayerTypes, type LeaguePlayerType, type Player } from "~/prisma/model";

import { EnumBadge, type EnumBadgeProps } from "./EnumBadge";

type P = Player | LeaguePlayerType | null;

export interface LeaguePlayerTypeBadgeProps extends Omit<EnumBadgeProps<typeof LeaguePlayerType>, "value" | "model"> {
  readonly value: P;
}

const getValue = (value: P): LeaguePlayerType | null =>
  typeof value === "string" ? value : value ? value.playerType : null;

export const LeaguePlayerTypeBadge = ({ value, ...props }: LeaguePlayerTypeBadgeProps): JSX.Element => {
  const _value = getValue(value);
  if (_value) {
    return (
      <EnumBadge
        {...props}
        model={LeaguePlayerTypes}
        value={_value}
        fontWeight="medium"
        outlineColor="gray.4"
        backgroundColor="white"
        color="gray.7"
      />
    );
  }
  return <></>;
};
