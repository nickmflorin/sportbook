import { EllipsisButton } from "~/components/buttons/EllipsisButton";

import { DropdownMenu } from "./DropdownMenu";
import { Menu } from "./Menu";
import { type ValuelessMenuItem } from "./types";

export type TableAction = ValuelessMenuItem;

export type TableActionDropdownMenuProps = {
  readonly actions: TableAction[];
};

export const TableActionDropdownMenu = ({ actions }: TableActionDropdownMenuProps) => (
  <DropdownMenu width={200} menu={<Menu mode="single" items={actions} style={{ width: 200 }} />}>
    <EllipsisButton />
  </DropdownMenu>
);
