"use client";
import { type Team, type ModelWithFileUrl } from "~/prisma/model";
import { useDetailDrawer } from "~/components/drawers/useDetailDrawer";
import { renderTeamDrawer } from "~/app/actions/renderTeamDrawer";

import { AlternateButton, type AlternateButtonProps } from "./AlternateButton";

type BaseTeam = Pick<Team, "name" | "id"> | Pick<ModelWithFileUrl<Team>, "id" | "name" | "fileUrl">;

export interface TeamButtonProps<T extends BaseTeam> extends Omit<AlternateButtonProps<"secondary">, "variant"> {
  readonly team: T;
}

export const TeamButton = <T extends BaseTeam>({ team, href, ...props }: TeamButtonProps<T>): JSX.Element => {
  const { setId, drawer } = useDetailDrawer({
    render: renderTeamDrawer,
    insideView: false,
  });
  return (
    <>
      <AlternateButton.Secondary
        onClick={href === undefined ? async () => setId(team.id) : undefined}
        href={href}
        {...props}
      >
        {team.name}
      </AlternateButton.Secondary>
      {drawer}
    </>
  );
};
