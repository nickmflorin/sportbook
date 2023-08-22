import { type TeamUiForm } from "~/prisma/model";
import { PopoverContent } from "~/components/tooltips/PopoverContent";
import { TeamInfoView } from "~/components/views/TeamInfoView";

import { DetailLink, type DetailLinkProps } from "./DetailLink";

export interface TeamDetailLinkProps<T extends TeamUiForm>
  extends Omit<DetailLinkProps, "href" | "children" | "popover"> {
  readonly team: T;
}

export const TeamDetailLink = <T extends TeamUiForm>({ team, ...props }: TeamDetailLinkProps<T>): JSX.Element => (
  <DetailLink
    href={{ query: { teamid: team.id } }}
    {...props}
    popover={
      <PopoverContent>
        <TeamInfoView team={team} avatarProps={{ size: 25 }} />
      </PopoverContent>
    }
    popoverProps={{ keepOpen: true, position: "right" }}
  >
    {team.name}
  </DetailLink>
);

export default TeamDetailLink;
