import { type UserResource } from "@clerk/types/dist/user";

import { parseUserDisplayName } from "~/lib/user";
import { type User } from "~/prisma/model";

import { Avatar, type AvatarProps } from "./Avatar";

type BaseUser = Pick<User, "firstName" | "lastName" | "emailAddress" | "profileImageUrl"> | UserResource;

export interface UserAvatarProps<U extends BaseUser>
  extends Omit<AvatarProps, "imageUrl" | "initials" | "displayName"> {
  readonly user: U;
  readonly displayName?: boolean;
}

export const UserAvatar = <U extends BaseUser>({ user, displayName, ...props }: UserAvatarProps<U>): JSX.Element => (
  <Avatar
    url={user.profileImageUrl}
    initials={parseUserDisplayName(user, { fallback: "" })}
    displayName={displayName === true ? parseUserDisplayName(user) : undefined}
    {...props}
  />
);
