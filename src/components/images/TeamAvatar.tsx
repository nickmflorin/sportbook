import { type Team, type ModelWithFileUrl } from "~/prisma/model";

import { Avatar, type AvatarProps } from "./Avatar";

type BaseTeam = Pick<Team, "name"> | Pick<ModelWithFileUrl<Team>, "name" | "fileUrl">;

export interface TeamAvatarProps<T extends BaseTeam> extends Omit<AvatarProps, "initials" | "displayName"> {
  readonly team: T;
  readonly displayName?: boolean;
}

export const TeamAvatar = <T extends BaseTeam>({
  team,
  displayName,
  url,
  ...props
}: TeamAvatarProps<T>): JSX.Element => (
  <Avatar
    url={url || (team as Pick<ModelWithFileUrl<Team>, "name" | "fileUrl">).fileUrl}
    initials={team.name}
    displayName={displayName === true ? team.name : undefined}
    {...props}
  />
);
