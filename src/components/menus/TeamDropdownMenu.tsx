import dynamic from "next/dynamic";

import { type Team } from "~/prisma/model";
import { TeamAvatar } from "~/components/images/TeamAvatar";

import { useDropdownMenu } from "./hooks";
import { type SingleMenuType } from "./SingleMenu";

const DropdownMenu = dynamic(() => import("~/components/menus/DropdownMenu"), {
  ssr: false,
});

const SingleMenu = dynamic(() => import("~/components/menus/SingleMenu"), {
  ssr: false,
}) as SingleMenuType;

export interface TeamDropdownMenuProps {
  readonly value: string;
  readonly teams: Team[];
  readonly onChange: (value: string) => void;
}

export const TeamDropdownMenu = ({ teams, value, onChange }: TeamDropdownMenuProps) => {
  const menu = useDropdownMenu();

  return (
    <DropdownMenu
      buttonContent="Teams"
      buttonWidth="100%"
      dropdownMenu={menu}
      menu={
        <SingleMenu<string | null, Team>
          items={teams.map(team => ({
            value: team.id,
            label: team.name,
            icon: <TeamAvatar team={team} size={24} />,
            datum: team,
          }))}
          value={value}
          onChange={(value: string, datum: Team) => {
            menu.current.setButtonContent(<TeamAvatar team={datum} size={20} fontSize="xxxs" withName />);
            menu.current.close();
            onChange(value);
          }}
        />
      }
    />
  );
};

export default TeamDropdownMenu;
