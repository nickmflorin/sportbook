"use client";
import { useLeagueAvailableUsers } from "~/app/api/hooks";
import { logger } from "~/application/logger";
import { isServerErrorResponseBody } from "~/application/response";

import { UsersDropdownMultiSelect, type UsersDropdownMultiSelectProps } from "./UsersDropdownMultiSelect";

export interface InviteUsersDropdownMenuProps extends Omit<UsersDropdownMultiSelectProps, "data"> {
  readonly leagueId: string;
  readonly requestDisabled?: boolean;
  readonly onError?: (e: string) => void;
}

export const InviteUsersDropdownSelect = ({
  leagueId,
  requestDisabled,
  onError,
  ...props
}: InviteUsersDropdownMenuProps) => {
  const {
    data: users,
    error,
    isLoading,
  } = useLeagueAvailableUsers(leagueId, {
    isPaused: () => requestDisabled === true,
    onError: err => {
      logger.error(
        { error: err },
        "There was an error loading the users data used to populate the invite users menu dropdown.",
      );
      if (isServerErrorResponseBody(err)) {
        onError?.(err.message);
      } else {
        onError?.("There was an error loading the users.");
      }
    },
    fallbackData: [],
  });
  return (
    <UsersDropdownMultiSelect
      {...props}
      disabled={error !== undefined}
      fetching={isLoading && users === undefined}
      refetching={users !== undefined && isLoading}
      data={users || []}
    />
  );
};
