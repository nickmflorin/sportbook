"use client";
import { parseUserDisplayName } from "~/lib/user";
import { type PlayerWithUser } from "~/prisma/model";
import { useQueryParams } from "~/hooks/useQueryParams";

import { AlternateButton, type AlternateButtonProps } from "./AlternateButton";

type BasePlayer = Pick<PlayerWithUser, "user" | "id">;

export interface PlayerButtonProps<T extends BasePlayer>
  extends Omit<AlternateButtonProps<"secondary">, "variant" | "href" | "onClick"> {
  readonly player: T;
}

export const PlayerButton = <T extends BasePlayer>({ player, ...props }: PlayerButtonProps<T>): JSX.Element => {
  const { updateParams } = useQueryParams();
  return (
    <AlternateButton.Secondary href={updateParams({ playerId: player.id }).href} {...props}>
      {parseUserDisplayName(player.user) || ""}
    </AlternateButton.Secondary>
  );
};

export default PlayerButton;
