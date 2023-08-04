import { EllipsisButton } from "~/components/buttons/EllipsisButton";

import { DropdownMenu } from "./DropdownMenu";
import { Menu } from "./Menu";
import { type ValuelessMenuItem, type IMenuItem } from "./types";

export type TableAction<T> = Omit<ValuelessMenuItem, "onClick"> & {
  readonly onClick: (datum: T, item: IMenuItem, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export type TableActionDropdownMenuProps<T> = {
  readonly actions: TableAction<T>[];
  readonly datum: T;
};

export const TableActionDropdownMenu = <T,>({ actions, datum }: TableActionDropdownMenuProps<T>) => (
  <DropdownMenu
    width={200}
    menu={
      <Menu
        mode="single"
        items={actions.map(a => ({ ...a, onClick: (item, e) => a.onClick(datum, item, e) }))}
        style={{ width: 200 }}
      />
    }
  >
    <EllipsisButton />
  </DropdownMenu>
);
