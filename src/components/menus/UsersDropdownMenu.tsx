import dynamic from "next/dynamic";

import { parseUserDisplayName } from "~/lib/user";
import { type User } from "~/prisma/model";
import { UserAvatar } from "~/components/images/UserAvatar";
import { Flex } from "~/components/structural/Flex";

import { useDropdownMenu } from "./hooks";
import { type MultiMenuType } from "./MultiMenu";

const DropdownMenu = dynamic(() => import("~/components/menus/DropdownMenu"));

const MultiMenu = dynamic(() => import("~/components/menus/MultiMenu")) as MultiMenuType;

const MAX_FULL_USERS_TO_DISPLAY = 2;

interface UserDropdownValueRendererProps {
  readonly users: User[];
}

const UserDropdownValueRenderer = ({ users }: UserDropdownValueRendererProps): JSX.Element => (
  <Flex direction="row" align="center" gap={users.length <= MAX_FULL_USERS_TO_DISPLAY ? "md" : "xs"}>
    {users.map((user, i) => (
      <UserAvatar<User>
        key={i}
        withName={users.length <= MAX_FULL_USERS_TO_DISPLAY}
        user={user}
        size={20}
        fontSize="xxxs"
      />
    ))}
  </Flex>
);

export interface UsersDropdownMenuProps {
  readonly value: string[];
  readonly users: User[];
  readonly onChange: (value: string[]) => void;
}

export const UsersDropdownMenu = ({ users, value, onChange }: UsersDropdownMenuProps) => {
  const menu = useDropdownMenu();
  return (
    <DropdownMenu
      buttonContent="Users"
      buttonWidth="100%"
      dropdownMenu={menu}
      menu={
        <MultiMenu<string, User>
          items={users.map(user => ({
            value: user.id,
            label: parseUserDisplayName(user),
            icon: <UserAvatar user={user} withName={false} size={24} />,
            datum: user,
          }))}
          value={value}
          onChange={(value: string[], datum: User[]) => {
            menu.current.setButtonContent(<UserDropdownValueRenderer users={datum} />);
            onChange(value);
          }}
          withCheckbox
        />
      }
    />
  );
};

export default UsersDropdownMenu;
