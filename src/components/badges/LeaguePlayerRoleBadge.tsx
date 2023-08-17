import { LeaguePlayerRoles, type LeaguePlayerRole, type LeaguePlayer } from "~/prisma/model";

import { EnumBadge, type EnumBadgeProps } from "./EnumBadge";

type P = LeaguePlayer | LeaguePlayerRole | null;

export interface LeaguePlayerRoleBadgeProps extends Omit<EnumBadgeProps<typeof LeaguePlayerRole>, "value" | "model"> {
  readonly value: P;
}

const getValue = (value: P): LeaguePlayerRole | null => (typeof value === "string" ? value : value ? value.role : null);

export const LeaguePlayerRoleBadge = ({ value, ...props }: LeaguePlayerRoleBadgeProps): JSX.Element => {
  const _value = getValue(value);
  if (_value) {
    return (
      <EnumBadge
        {...props}
        model={LeaguePlayerRoles}
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
