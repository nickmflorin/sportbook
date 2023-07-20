"use client";
import { type UserResource } from "@clerk/types/dist/user";
import { Avatar, type AvatarProps } from "@mantine/core";

import { type User } from "~/prisma/model";

type BaseUser = Pick<User, "firstName" | "lastName" | "emailAddress" | "profileImageUrl"> | UserResource;

export interface UserAvatarProps<U extends BaseUser>
  extends Omit<AvatarProps, "component" | "src" | "h" | "w" | "sx" | "style"> {
  readonly user?: U | null;
}

export const UserAvatar = <U extends BaseUser>({ user, ...props }: UserAvatarProps<U>): JSX.Element =>
  user ? (
    <Avatar
      {...props}
      component="div"
      src={user.profileImageUrl}
      h="100%"
      w="auto"
      sx={{
        clipPath: "inset(0px round 1000px)",
        minWidth: "unset",
        overflow: "visible",
      }}
      style={{ aspectRatio: 1 }}
    />
  ) : (
    <></>
  );
