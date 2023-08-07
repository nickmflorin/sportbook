import { parseUserDisplayName } from "~/lib/user";
import { type Player, type User } from "~/prisma/model";
import { LeaguePlayerTypeBadge } from "~/components/badges/LeaguePlayerTypeBadge";

import { Avatar, type AvatarProps } from "./Avatar";

type Pl = (Player & { readonly user: User }) | User;

const isPlayerWithUser = (p: Pl): p is Player & { readonly user: User } =>
  (p as Player & { readonly user: User }).user !== undefined;

export interface PlayerAvatarProps<P extends Pl> extends Omit<AvatarProps, "imageUrl" | "initials" | "displayName"> {
  readonly player: P;
}

export const PlayerAvatar = <P extends Pl>({ player, ...props }: PlayerAvatarProps<P>): JSX.Element => (
  <Avatar
    url={isPlayerWithUser(player) ? player.user.profileImageUrl : player.profileImageUrl}
    tags={
      isPlayerWithUser(player) ? [<LeaguePlayerTypeBadge key="0" size="xxs" withIcon value={player.playerType} />] : []
    }
    initials={
      isPlayerWithUser(player)
        ? parseUserDisplayName(player.user, { fallback: "" })
        : parseUserDisplayName(player, { fallback: "" })
    }
    displayName={isPlayerWithUser(player) ? parseUserDisplayName(player.user) : parseUserDisplayName(player)}
    {...props}
  />
);
