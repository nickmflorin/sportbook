import { TeamDetailLink, type TeamDetailLinkProps } from "~/components/buttons/TeamDetailLink";
import { type TeamUiForm, teamUiFormHasFileUrl } from "~/prisma/model";

import { Avatar, type AvatarProps } from "./Avatar";

export interface TeamAvatarProps<T extends TeamUiForm>
  extends Omit<AvatarProps, "initials" | "name" | "onClick" | "href" | "button"> {
  readonly team: T;
  readonly withName?: true;
  readonly withButton?: true;
  readonly buttonProps?: Omit<TeamDetailLinkProps, "team">;
}

export const TeamAvatar = <T extends TeamUiForm>({
  team,
  url,
  withButton,
  withName,
  buttonProps,
  ...props
}: TeamAvatarProps<T>): JSX.Element => (
  <Avatar
    url={url || (teamUiFormHasFileUrl(team) ? team.fileUrl : undefined)}
    initials={team.name}
    name={withName === true ? team.name : undefined}
    {...props}
    button={withButton ? <TeamDetailLink {...buttonProps} team={team} /> : undefined}
  />
);

export default TeamAvatar;
