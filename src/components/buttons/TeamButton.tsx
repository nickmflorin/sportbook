"use client";
import { type Team } from "~/prisma/model";
import { useQueryParams } from "~/hooks/useQueryParams";

import { AlternateButton, type AlternateButtonProps } from "./AlternateButton";

type BaseTeam = Pick<Team, "name" | "id">;

export interface TeamButtonProps<T extends BaseTeam>
  extends Omit<AlternateButtonProps<"secondary">, "variant" | "href" | "onClick"> {
  readonly team: T;
}

export const TeamButton = <T extends BaseTeam>({ team, ...props }: TeamButtonProps<T>): JSX.Element => {
  const { updateParams } = useQueryParams();
  return (
    <AlternateButton.Secondary href={updateParams({ teamId: team.id }).href} {...props}>
      {team.name}
    </AlternateButton.Secondary>
  );
};

export default TeamButton;
