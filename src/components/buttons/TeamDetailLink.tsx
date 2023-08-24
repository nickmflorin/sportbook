import { type TeamUiForm } from "~/prisma/model";
import { AlternateButton } from "~/components/buttons/AlternateButton";
import { PopoverContent } from "~/components/tooltips/PopoverContent";
import { TeamInfoView, type TeamInfoViewAvatarProps } from "~/components/views/TeamInfoView";

import { DetailLink, type DetailLinkProps } from "./DetailLink";

export interface TeamDetailLinkProps<T extends TeamUiForm = TeamUiForm>
  extends Omit<DetailLinkProps, "href" | "children" | "popover"> {
  readonly team: T;
  readonly showTeamStats?: boolean;
  readonly withPopover?: boolean;
  readonly popoverAvatarProps?: TeamInfoViewAvatarProps;
  readonly popoverProps?: DetailLinkProps["popoverProps"];
}

export const TeamDetailLink = <T extends TeamUiForm>({
  team,
  popoverAvatarProps,
  popoverProps,
  showTeamStats = false,
  ...props
}: TeamDetailLinkProps<T>): JSX.Element => (
  <DetailLink
    href={{ query: { teamid: team.id } }}
    {...props}
    popover={
      <PopoverContent style={{ width: 220 }}>
        <TeamInfoView
          team={team}
          horizontalSpacing={8}
          badgeSize="xxxs"
          titleProps={{ order: 6 }}
          showStats={showTeamStats}
          teamStatsSize="xxs"
          avatarProps={{ size: 25, fontSize: "xxs", ...popoverAvatarProps }}
          contentVerticalOffset={0}
          description={[
            <AlternateButton.Primary
              key="1"
              textAlign="left"
              fontSize="xs"
              href={`/leagues/${team.leagueId}/teams/${team.id}`}
            >
              See Full Details
            </AlternateButton.Primary>,
          ]}
        />
      </PopoverContent>
    }
    popoverProps={{ ...popoverProps, width: 220 }}
  >
    {team.name}
  </DetailLink>
);

export default TeamDetailLink;
