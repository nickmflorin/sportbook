import { type Team, type ModelWithFileUrl } from "~/prisma/model";
import { TeamButton } from "~/components/buttons/TeamButton";

import { Avatar, type AvatarProps } from "./Avatar";

type BaseTeam = Pick<Team, "name" | "id"> | Pick<ModelWithFileUrl<Team>, "id" | "name" | "fileUrl">;

export interface TeamAvatarProps<T extends BaseTeam>
  extends Omit<AvatarProps, "initials" | "displayName" | "onClick" | "href"> {
  readonly team: T;
  readonly withName?: true;
  readonly withButton?: true;
}

export const TeamAvatar = <T extends BaseTeam>({
  team,
  url,
  withButton,
  withName,
  ...props
}: TeamAvatarProps<T>): JSX.Element => (
  <Avatar
    url={url || (team as Pick<ModelWithFileUrl<Team>, "name" | "fileUrl">).fileUrl}
    initials={team.name}
    name={withName === true ? team.name : undefined}
    {...props}
    button={withButton ? <TeamButton team={team} /> : undefined}
  />
);
