"use client";
import { useLeagueAvailableTeams } from "~/app/api/hooks";
import { logger } from "~/application/logger";
import { isServerErrorResponseBody } from "~/application/response";

import { TeamDropdownSingleSelect, type TeamDropdownSingleSelectProps } from "./TeamDropdownSingleSelect";

export interface InviteUsersTeamDropdownSelectProps extends Omit<TeamDropdownSingleSelectProps, "data"> {
  readonly leagueId: string;
  readonly requestDisabled?: boolean;
  readonly onError?: (e: string) => void;
}

export const InviteUsersTeamDropdownSelect = ({
  leagueId,
  requestDisabled,
  onError,
  ...props
}: InviteUsersTeamDropdownSelectProps) => {
  const {
    data: teams,
    error,
    isLoading,
  } = useLeagueAvailableTeams(leagueId, {
    isPaused: () => requestDisabled === true,
    onError: err => {
      logger.error(
        { error: err },
        "There was an error loading the teams data used to populate the invite users to team menu dropdown.",
      );
      if (isServerErrorResponseBody(err)) {
        onError?.(err.message);
      } else {
        onError?.("There was an error loading the teams.");
      }
    },
    fallbackData: [],
  });
  return (
    <TeamDropdownSingleSelect
      {...props}
      disabled={error !== undefined}
      fetching={isLoading && teams === undefined}
      refetching={teams !== undefined && isLoading}
      data={teams || []}
    />
  );
};
