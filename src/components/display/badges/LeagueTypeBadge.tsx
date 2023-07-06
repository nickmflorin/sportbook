"use client";
import { type MantineTheme, Badge, type BadgeProps, packSx } from "@mantine/core";
import { LeagueType } from "@prisma/client";

const LeagueTypeStyles = (
  theme: MantineTheme,
): { [key in LeagueType]: { color: string; backgroundColor: string } } => ({
  [LeagueType.ORGANIZED]: {
    color: theme.white,
    backgroundColor: theme.colors.green[7],
  },
  [LeagueType.PICKUP]: {
    color: theme.colors.blue[8],
    backgroundColor: theme.colors.blue[2],
  },
});

const LeagueTypeLabels: { [key in LeagueType]: string } = {
  [LeagueType.ORGANIZED]: "Organized",
  [LeagueType.PICKUP]: "Pickup",
};

export interface LeagueTypeBadgeProps extends Omit<BadgeProps, "variant"> {
  readonly leagueType: LeagueType;
  readonly disabled?: boolean;
}

export const LeagueTypeBadge = ({ leagueType, disabled, ...props }: LeagueTypeBadgeProps): JSX.Element => (
  <Badge
    {...props}
    variant="filled"
    sx={[
      theme =>
        disabled
          ? { color: theme.colors.gray[5], backgroundColor: theme.colors.gray[0] }
          : LeagueTypeStyles(theme)[leagueType],
      ...packSx(props.sx),
    ]}
  >
    {LeagueTypeLabels[leagueType]}
  </Badge>
);
