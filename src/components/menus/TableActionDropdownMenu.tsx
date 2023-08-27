import { EllipsisButton } from "~/components/buttons/EllipsisButton";

import { Dropdown } from "./dropdowns/Dropdown";
import { type ValuelessMenuItem, type IMenuItem } from "./menus";
import { Menu } from "./menus/Menu";

export type TableAction<T> = Omit<ValuelessMenuItem, "onClick"> & {
  readonly onClick: (datum: T, item: IMenuItem, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export type TableActionDropdownMenuProps<T> = {
  readonly actions: TableAction<T>[];
  readonly datum: T;
};

export const TableActionDropdownMenu = <T,>({ actions, datum }: TableActionDropdownMenuProps<T>) => (
  <Dropdown
    width={200}
    content={
      <Menu
        mode="single"
        items={actions.map(a => ({ ...a, onClick: (item, e) => a.onClick(datum, item, e) }))}
        style={{ width: 200 }}
      />
    }
  >
    <EllipsisButton />
  </Dropdown>
);
