import { type UserResource } from "@clerk/types/dist/user";

import { parseUserDisplayName } from "~/lib/user";
import { type User } from "~/prisma/model";

import { Avatar, type AvatarProps } from "./Avatar";

type BaseUser = Pick<User, "firstName" | "lastName" | "emailAddress" | "profileImageUrl"> | UserResource;

export interface UserAvatarProps<U extends BaseUser>
  extends Omit<AvatarProps, "imageUrl" | "initials" | "displayName"> {
  readonly user: U;
  readonly withName?: boolean;
}

export const UserAvatar = <U extends BaseUser>({ user, withName, ...props }: UserAvatarProps<U>): JSX.Element => (
  <Avatar
    url={user.profileImageUrl}
    initials={parseUserDisplayName(user, { fallback: "" })}
    name={withName === true ? parseUserDisplayName(user) : undefined}
    {...props}
  />
);
