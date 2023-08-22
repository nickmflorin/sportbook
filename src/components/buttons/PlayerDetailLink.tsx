import { parseUserDisplayName } from "~/lib/user";
import { type LeaguePlayerWithUser } from "~/prisma/model";

import { DetailLink, type DetailLinkProps } from "./DetailLink";

type BasePlayer = Pick<LeaguePlayerWithUser, "user" | "id">;

export interface PlayerDetailLinkProps<T extends BasePlayer> extends Omit<DetailLinkProps, "href" | "children"> {
  readonly player: T;
}

export const PlayerDetailLink = <T extends BasePlayer>({ player, ...props }: PlayerDetailLinkProps<T>): JSX.Element => (
  <DetailLink href={{ query: { playerid: player.id } }} {...props}>
    {parseUserDisplayName(player.user) || ""}
  </DetailLink>
);

export default PlayerDetailLink;
