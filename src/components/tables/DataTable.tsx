import { useMemo } from "react";

import classNames from "classnames";
import { DataTable as MantineDataTable, type DataTableProps as MantineDataTableProps } from "mantine-datatable";

import { type ClassName } from "~/lib/ui";
import { EditTableRowButton } from "~/components/buttons";
import { ResponseFeedback, type ResponseFeedbackProps } from "~/components/feedback/ResponseFeedback";
import { Loading } from "~/components/loading";

import { DataTableActionMenu, type DataTableAction } from "./DataTableActionMenu";
import { type DataTableSize, DataTableSizes } from "./types";

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
  actionMenu: (t: T) => DataTableAction[];
}): Column<T> => ({
  title: "",
  accessor: "",
  width: 40,
  textAlignment: "center",
  render: (rowData: T) => <DataTableActionMenu actions={actionMenu(rowData)} />,
});

/* In the case of a DataTable, the feedback component will only be shown if no records exist.  As such, we simply set
   isEmpty to true, since that will always be the case in the context in which this is used.  The other props that
   dictate whether or not an error is present or whether or not there is search criteria applied will still render the
   correct form of LocalFeedback. */
export type DataTableProps<T> = Pick<MantineDataTableProps<T>, "columns" | "sx"> &
  Omit<ResponseFeedbackProps, "isEmpty" | "overlay" | "fetching"> & {
    readonly size?: DataTableSize;
    readonly data: T[];
    readonly loading?: boolean;
    readonly className?: ClassName;
    readonly onRowEdit?: (t: T) => void;
    readonly actionMenu?: (t: T) => DataTableAction[];
  };

export const DataTable = <T extends Record<string, unknown>>({
  error,
  errorMessage,
  emptyMessage,
  noResultsMessage,
  isFiltered,
  size = DataTableSizes.SM,
  columns,
  data,
  className,
  loading,
  onRowEdit,
  actionMenu,
  ...props
}: DataTableProps<T>) => {
  const _columns = useMemo(() => {
    if (columns) {
      let cs = [...columns];
      if (onRowEdit) {
        return [...cs, EditRowColumn({ onRowEdit })];
      }
      if (actionMenu) {
        cs = [...cs, ActionMenuColumn({ actionMenu })];
      }
      return cs;
    }
    return undefined;
  }, [columns, onRowEdit, actionMenu]);

  /* Mantine's <DataTable /> component defines the props as a set of base props intersected with a bunch of
     supplementary props, such as 'DataTableEmptyStateProps', each of which is a union type.  This introduces typing
     issues when adding our own props into the fold, because the intersection of our props with their props does not
     distribute our props over the union types.  The only ways around this are to define the props for this component in
     an extremely complicated manner, or simply coerce the props as shown below. */
  const rootProps: MantineDataTableProps<T> = {
    highlightOnHover: true,
    withBorder: false,
    height: "100%",
    className: classNames("table", `table--size-${size}`, className),
    customLoader: <Loading overlay={true} loading={true} />,
    /* Here, we use the ResponseFeedback to show alerts that pertain to an empty state, an error state and a no results
       state (i.e. filters are applied and there is no data, but there is data without filters applied). */
    emptyState: (
      <ResponseFeedback
        isEmpty={true}
        error={error}
        isFiltered={isFiltered}
        noResultsMessage={noResultsMessage}
        errorMessage={errorMessage}
        emptyMessage={emptyMessage}
      />
    ),
    ...props,
    fetching: loading,
    records: data,
    columns: _columns,
  } as MantineDataTableProps<T>;

  return <MantineDataTable<T> {...rootProps} />;
};
