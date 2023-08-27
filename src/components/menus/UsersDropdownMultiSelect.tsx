import dynamic from "next/dynamic";

import { type Optional } from "utility-types";

import { parseUserDisplayName } from "~/lib/user";
import { UserAvatar } from "~/components/images/UserAvatar";
import { type User } from "~/prisma/model";

import {
  type DropdownMultiModelSelectProps,
  type DropdownMultiModelSelectType,
} from "./dropdowns/DropdownMultiModelSelect";

const DropdownMultiModelSelect = dynamic(
  () => import("./dropdowns/DropdownMultiModelSelect"),
) as DropdownMultiModelSelectType;

const MAX_FULL_USERS_TO_DISPLAY = 2;

export type UsersDropdownMultiSelectProps = Optional<
  Omit<DropdownMultiModelSelectProps<User>, "getItemLabel" | "getItemIcon" | "valueRenderer">,
  "placeholder"
>;

export const UsersDropdownMultiSelect = (props: UsersDropdownMultiSelectProps) => (
  <DropdownMultiModelSelect<User>
    placeholder="Select a user..."
    {...props}
    getItemLabel={user => parseUserDisplayName(user)}
    getItemIcon={user => <UserAvatar user={user} withName={false} size={24} />}
    valueRenderer={(user, count) => (
      <UserAvatar<User> withName={count <= MAX_FULL_USERS_TO_DISPLAY} user={user} size={20} fontSize="xxxs" />
    )}
  />
);

export default UsersDropdownMultiSelect;
