"use client";
import { type UserResource } from "@clerk/types/dist/user";
import { Flex, type FlexProps } from "@mantine/core";
import { type User } from "@prisma/client";

import { UserAvatar } from "./UserAvatar";
import { UserFullNameText, type UserFullNameTextProps } from "./UserFullNameText";

type BaseUser = Pick<User, "firstName" | "lastName" | "emailAddress" | "profileImageUrl"> | UserResource;

export interface UserAvatarWithNameProps<U extends BaseUser> extends Omit<FlexProps, "direction" | "align"> {
  readonly user?: U | null;
  readonly textProps?: Omit<UserFullNameTextProps<U>, "user" | "h">;
}

/**
 * A component that renders a user avatar alongside the display name for the user.  The component will size in height
 * based on the height of its container, with the  avatar expanding to fill the height while maintaining a 1-1 aspect
 * ratio.
 *
 * @example
 * return (
 *   <Flex direction="row" justify="space-between" style={{ height: 24 }}>
 *     <Text>Assigned To</Text>
 *     <UserAvatarWithName user={user} />
 *   </Flex>
 * )
 */
export const UserAvatarWithName = <U extends BaseUser>({
  user,
  textProps,
  ...props
}: UserAvatarWithNameProps<U>): JSX.Element =>
  user ? (
    <Flex h="100%" {...props} direction="row" align="center">
      <UserAvatar user={user} mr="sm" />
      <UserFullNameText {...textProps} h="auto" user={user} />
    </Flex>
  ) : (
    <></>
  );
