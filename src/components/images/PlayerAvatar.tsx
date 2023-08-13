import { parseUserDisplayName } from "~/lib/user";
import { type PlayerWithUser } from "~/prisma/model";
import { LeaguePlayerTypeBadge } from "~/components/badges/LeaguePlayerTypeBadge";
import { PlayerButton } from "~/components/buttons/PlayerButton";

import { Avatar, type AvatarProps } from "./Avatar";

export interface PlayerAvatarProps extends Omit<AvatarProps, "initials" | "name" | "onClick" | "href" | "button"> {
  readonly player: PlayerWithUser;
  readonly withTags?: true;
  readonly withName?: true;
  readonly withButton?: true;
}

export const PlayerAvatar = ({ player, withName, withButton, withTags, ...props }: PlayerAvatarProps): JSX.Element => (
  <Avatar
    url={player.user.profileImageUrl}
    tags={withTags ? [<LeaguePlayerTypeBadge key="0" size="xxs" withIcon value={player.playerType} />] : []}
    initials={parseUserDisplayName(player.user, { fallback: "" })}
    name={withName ? parseUserDisplayName(player.user) : undefined}
    {...props}
    button={withButton ? <PlayerButton player={player} /> : undefined}
  />
);

export default PlayerAvatar;
