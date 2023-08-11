"use client";
import { type Team, type ModelWithFileUrl } from "~/prisma/model";
import { useDetailDrawer } from "~/components/drawers/useDetailDrawer";
import { renderTeamDrawer } from "~/app/actions/renderTeamDrawer";

import { Avatar, type AvatarProps } from "./Avatar";

type BaseTeam = Pick<Team, "name" | "id"> | Pick<ModelWithFileUrl<Team>, "id" | "name" | "fileUrl">;

export interface TeamAvatarProps<T extends BaseTeam> extends Omit<AvatarProps, "initials" | "displayName" | "onClick"> {
  readonly team: T;
  readonly displayName?: boolean;
  readonly drawerDisabled?: true;
}

export const TeamAvatar = <T extends BaseTeam>({
  team,
  displayName,
  url,
  drawerDisabled,
  ...props
}: TeamAvatarProps<T>): JSX.Element => {
  const { setId, drawer } = useDetailDrawer({
    render: renderTeamDrawer,
    insideView: false,
    disabled: drawerDisabled,
  });
  return (
    <>
      <Avatar
        url={url || (team as Pick<ModelWithFileUrl<Team>, "name" | "fileUrl">).fileUrl}
        initials={team.name}
        displayName={displayName === true ? team.name : undefined}
        {...props}
        onClick={drawerDisabled !== true ? async () => setId(team.id) : undefined}
      />
      {drawer}
    </>
  );
};
