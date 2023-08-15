import dynamic from "next/dynamic";

import { type Team } from "~/prisma/model";
import { TeamAvatar } from "~/components/images/TeamAvatar";

const DropdownMenu = dynamic(() => import("~/components/menus/DropdownMenu"), {
  ssr: false,
});

const SingleMenu = dynamic(() => import("~/components/menus/SingleMenu"), {
  ssr: false,
});

export interface TeamDropdownMenuProps {
  readonly value: string;
  readonly teams: Team[];
  readonly onChange: (value: string) => void;
}

export const TeamDropdownMenu = ({ teams, value, onChange }: TeamDropdownMenuProps) => (
  <DropdownMenu
    buttonText="Teams"
    buttonWidth="100%"
    menu={
      <SingleMenu
        items={teams.map(team => ({
          value: team.id,
          label: team.name,
          icon: <TeamAvatar team={team} size={24} />,
        }))}
        value={value}
        onChange={onChange}
      />
    }
  />
);

export default TeamDropdownMenu;
