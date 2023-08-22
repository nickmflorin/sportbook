import { parseUserDisplayName } from "~/lib/user";
import { type LeaguePlayerWithUser } from "~/prisma/model";
import { LeaguePlayerRoleBadge } from "~/components/badges/LeaguePlayerRoleBadge";
import { PlayerDetailLink } from "~/components/buttons/PlayerDetailLink";

import { Avatar, type AvatarProps } from "./Avatar";

export interface PlayerAvatarProps extends Omit<AvatarProps, "initials" | "name" | "onClick" | "href" | "button"> {
  readonly player: LeaguePlayerWithUser;
  readonly withTags?: true;
  readonly withName?: true;
  readonly withButton?: true;
}

export const PlayerAvatar = ({ player, withName, withButton, withTags, ...props }: PlayerAvatarProps): JSX.Element => (
  <Avatar
    url={player.user.profileImageUrl}
    tags={withTags ? [<LeaguePlayerRoleBadge key="0" size="xxs" withIcon value={player.role} />] : []}
    initials={parseUserDisplayName(player.user, { fallback: "" })}
    name={withName ? parseUserDisplayName(player.user) : undefined}
    {...props}
    button={withButton ? <PlayerDetailLink player={player} /> : undefined}
  />
);

export default PlayerAvatar;
