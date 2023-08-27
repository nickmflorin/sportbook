import dynamic from "next/dynamic";

import { type Optional } from "utility-types";

import { TeamAvatar } from "~/components/images/TeamAvatar";
import { type Team } from "~/prisma/model";

import {
  type DropdownSingleModelSelectProps,
  type DropdownSingleModelSelectType,
} from "./dropdowns/DropdownSingleModelSelect";

const DropdownSingleModelSelect = dynamic(
  () => import("./dropdowns/DropdownSingleModelSelect"),
) as DropdownSingleModelSelectType;

export type TeamDropdownSingleSelectProps = Optional<
  Omit<DropdownSingleModelSelectProps<Team>, "getItemLabel" | "getItemIcon" | "valueRenderer">,
  "placeholder"
>;

export const TeamDropdownSingleSelect = (props: TeamDropdownSingleSelectProps) => (
  <DropdownSingleModelSelect<Team>
    placeholder="Select a team..."
    {...props}
    getItemLabel={team => team.name}
    getItemIcon={team => <TeamAvatar team={team} size={24} />}
    valueRenderer={team => <TeamAvatar withName team={team} size={20} fontSize="xxxs" />}
  />
);

export default TeamDropdownSingleSelect;
