import dynamic from "next/dynamic";

import { parseUserDisplayName } from "~/lib/user";
import { type User } from "~/prisma/model";
import { UserAvatar } from "~/components/images/UserAvatar";

const DropdownMenu = dynamic(() => import("~/components/menus/DropdownMenu"), {
  ssr: false,
});

const MultiMenu = dynamic(() => import("~/components/menus/MultiMenu"), {
  ssr: false,
});

export interface UsersDropdownMenuProps {
  readonly value: string[];
  readonly users: User[];
  readonly onChange: (value: string[]) => void;
}

export const UsersDropdownMenu = ({ users, value, onChange }: UsersDropdownMenuProps) => (
  <DropdownMenu
    buttonText="Locations"
    buttonWidth="100%"
    menu={
      <MultiMenu
        items={users.map(user => ({
          value: user.id,
          label: parseUserDisplayName(user),
          icon: <UserAvatar user={user} withName={false} size={24} />,
        }))}
        value={value}
        onChange={onChange}
        withCheckbox
      />
    }
  />
);

export default UsersDropdownMenu;
