"use client";
import { useLeagueAvailableUsers } from "~/app/api/hooks";
import { logger } from "~/application/logger";

import { UsersDropdownMenu, UsersDropdownMenuProps } from "./UsersDropdownMenu";
import { isServerErrorResponseBody } from "~/application/response";

export interface InviteUsersDropdownMenuProps extends Omit<UsersDropdownMenuProps, "users"> {
  readonly leagueId: string;
  readonly requestDisabled?: boolean;
  readonly onError?: (e: string) => void;
}

export const InviteUsersDropdownMenu = ({
  leagueId,
  requestDisabled,
  onError,
  ...props
}: InviteUsersDropdownMenuProps) => {
  const {
    data: users = [],
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
  return <UsersDropdownMenu {...props} disabled={error !== undefined} loading={isLoading} users={users} />;
};
