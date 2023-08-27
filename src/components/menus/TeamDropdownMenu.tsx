import dynamic from "next/dynamic";

import { TeamAvatar } from "~/components/images/TeamAvatar";
import { type Team } from "~/prisma/model";

import { useDropdownSelectControl } from "./dropdowns/hooks";
import { type SingleMenuType } from "./menus/SingleMenu";

const DropdownSelect = dynamic(() => import("~/components/menus/dropdowns/DropdownSelect"), {
  ssr: false,
});

const SingleMenu = dynamic(() => import("~/components/menus/menus/SingleMenu"), {
  ssr: false,
}) as SingleMenuType;

export interface TeamDropdownMenuProps {
  readonly value: string;
  readonly teams: Team[];
  readonly onChange: (value: string) => void;
}

export const TeamDropdownMenu = ({ teams, value, onChange }: TeamDropdownMenuProps) => {
  const control = useDropdownSelectControl();

  return (
    <DropdownSelect
      inputPlaceholder="Teams"
      inputWidth="100%"
      control={control}
      content={
        <SingleMenu<string | null, Team>
          items={teams.map(team => ({
            value: team.id,
            label: team.name,
            icon: <TeamAvatar team={team} size={24} />,
            datum: team,
          }))}
          value={value}
          onChange={(value: string, datum: Team) => {
            control.current.setValueDisplay(<TeamAvatar team={datum} size={20} fontSize="xxxs" withName />);
            control.current.close();
            onChange(value);
          }}
        />
      }
    />
  );
};

export default TeamDropdownMenu;
