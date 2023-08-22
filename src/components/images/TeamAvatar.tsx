import { type TeamUiForm, teamUiFormHasFileUrl } from "~/prisma/model";
import { TeamDetailLink } from "~/components/buttons/TeamDetailLink";

import { Avatar, type AvatarProps } from "./Avatar";

export interface TeamAvatarProps<T extends TeamUiForm>
  extends Omit<AvatarProps, "initials" | "name" | "onClick" | "href" | "button"> {
  readonly team: T;
  readonly withName?: true;
  readonly withButton?: true;
}

export const TeamAvatar = <T extends TeamUiForm>({
  team,
  url,
  withButton,
  withName,
  ...props
}: TeamAvatarProps<T>): JSX.Element => (
  <Avatar
    url={url || (teamUiFormHasFileUrl(team) ? team.fileUrl : undefined)}
    initials={team.name}
    name={withName === true ? team.name : undefined}
    {...props}
    button={withButton ? <TeamDetailLink team={team} /> : undefined}
  />
);

export default TeamAvatar;
