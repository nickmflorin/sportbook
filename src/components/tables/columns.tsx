import { type DataTableProps as MantineDataTableProps } from "mantine-datatable";

import { EditTableRowButton } from "~/components/buttons/EditTableRowButton";
import { TableActionDropdownMenu } from "~/components/menus/TableActionDropdownMenu";

import { type ActionMenu } from "./types";

export type Column<T = unknown> = Exclude<MantineDataTableProps<T>["columns"], undefined>[number];

export const EditRowColumn = <T extends Record<string, unknown>>({
  onRowEdit,
}: {
  onRowEdit: (t: T) => void;
}): Column<T> => ({
  title: "",
  accessor: "",
  width: 40,
  textAlignment: "center",
  render: (rowData: T) => <EditTableRowButton onClick={() => onRowEdit(rowData)} />,
});

export const ActionMenuColumn = <T extends Record<string, unknown>>({
  actionMenu,
}: {
  actionMenu: ActionMenu<T>;
}): Column<T> => ({
  title: "",
  accessor: "",
  width: 40,
  textAlignment: "center",
  render: (rowData: T) => {
    const actions = typeof actionMenu === "function" ? actionMenu(rowData) : actionMenu;
    if (actions) {
      const visibleActions = actions.filter(i => i.hidden !== true && i.visible !== false);
      if (visibleActions.length !== 0) {
        return <TableActionDropdownMenu actions={actions} datum={rowData} />;
      }
    }
    return <></>;
  },
});
