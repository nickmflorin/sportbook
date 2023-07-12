import { useMemo } from "react";

import { type MantineTheme, LoadingOverlay, ActionIcon, packSx, useMantineTheme } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import { DataTable as MantineDataTable, type DataTableProps as MantineDataTableProps } from "mantine-datatable";

import { ResponseFeedback, type ResponseFeedbackProps } from "~/components/feedback";

import { DataTableActionMenu, type DataTableAction } from "./DataTableActionMenu";
import { DataTableStyle } from "./types";

const DataTableStyleAttributes: {
  [key in DataTableStyle]: (t: MantineTheme) => { th: React.CSSProperties; td: React.CSSProperties };
} = {
  [DataTableStyle.LARGE]: (theme: MantineTheme) => ({
    th: {
      fontWeight: theme.other.fontWeights.semibold,
      fontSize: theme.fontSizes.md,
      lineHeight: theme.other.textLineHeights.md,
      padding: "8px 16px",
    },
    td: {
      padding: "8px 16px",
      fontSize: theme.fontSizes.md,
      lineHeight: theme.other.textLineHeights.md,
    },
  }),
  [DataTableStyle.MEDIUM]: (theme: MantineTheme) => ({
    th: {
      fontWeight: theme.other.fontWeights.medium,
      fontSize: theme.fontSizes.sm,
      lineHeight: theme.other.textLineHeights.sm,
      padding: "4px 8px",
    },
    td: {
      padding: "4px 8px",
      fontSize: theme.fontSizes.sm,
      lineHeight: theme.other.textLineHeights.sm,
    },
  }),
  [DataTableStyle.SMALL]: (theme: MantineTheme) => ({
    th: {
      fontWeight: theme.other.fontWeights.medium,
      fontSize: theme.fontSizes.xs,
      lineHeight: theme.other.textLineHeights.xs,
      padding: "3px 6px",
    },
    td: {
      padding: "3px 6px",
      fontSize: theme.fontSizes.xs,
      lineHeight: theme.other.textLineHeights.xs,
    },
  }),
};

export type Column<T = unknown> = Exclude<MantineDataTableProps<T>["columns"], undefined>[number];

export const EditRowColumn = <T extends Record<string, unknown>>({
  onRowEdit,
  theme,
}: {
  onRowEdit: (t: T) => void;
  theme: MantineTheme;
}): Column<T> => ({
  title: "",
  accessor: "",
  width: 40,
  textAlignment: "center",
  render: (rowData: T) => (
    <ActionIcon
      variant="transparent"
      onClick={() => onRowEdit(rowData)}
      sx={t => ({
        loader: { backgroundColor: "transparent" },
        /* We use the SVG selector to set the color such that the hover color takes affect when the ActionIcon is
           hovered.  If we do not use the > svg selector, and set the color on the Icon directly, the Icon will not
           change color when the ActionIcon is hovered. */
        "> svg": {
          color: theme.colors.blue[6],
        },
        ...t.fn.hover({ "> svg": { color: theme.colors.blue[5] } }),
      })}
    >
      <IconPencil stroke={1.5} size={16} />
    </ActionIcon>
  ),
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
  Omit<ResponseFeedbackProps, "isEmpty" | "overlay"> & {
    readonly tableStyle?: DataTableStyle;
    readonly data: T[];
    readonly onRowEdit?: (t: T) => void;
    readonly actionMenu?: (t: T) => DataTableAction[];
  };

export const DataTable = <T extends Record<string, unknown>>({
  error,
  errorMessage,
  emptyMessage,
  noResultsMessage,
  isFiltered,
  tableStyle = DataTableStyle.MEDIUM,
  columns,
  data,
  onRowEdit,
  actionMenu,
  ...props
}: DataTableProps<T>) => {
  const theme = useMantineTheme();

  const _columns = useMemo(() => {
    if (columns) {
      let cs = [...columns];
      if (onRowEdit) {
        return [...cs, EditRowColumn({ onRowEdit, theme })];
      }
      if (actionMenu) {
        cs = [...cs, ActionMenuColumn({ actionMenu })];
      }
      return cs;
    }
    return undefined;
  }, [columns, theme, onRowEdit, actionMenu]);

  /* Mantine's <DataTable /> component defines the props as a set of base props intersected with a bunch of
     supplementary props, such as 'DataTableEmptyStateProps', each of which is a union type.  This introduces typing
     issues when adding our own props into the fold, because the intersection of our props with their props does not
     distribute our props over the union types.  The only ways around this are to define the props for this component in
     an extremely complicated manner, or simply coerce the props as shown below. */
  const rootProps: MantineDataTableProps<T> = {
    highlightOnHover: true,
    withBorder: false,
    height: "100%",
    customLoader: <LoadingOverlay visible={true} />,
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
    records: data,
    columns: _columns,
    sx: [
      theme => ({
        table: {
          thead: {
            background: theme.colors.gray[0],
            tr: {
              th: {
                borderBottom: "none",
                background: theme.colors.gray[0],
                color: theme.colors.gray[7],
                ...DataTableStyleAttributes[tableStyle](theme).th,
              },
            },
          },
          tbody: {
            tr: {
              td: {
                color: theme.colors.black,
                ...DataTableStyleAttributes[tableStyle](theme).td,
              },
            },
          },
        },
      }),
      ...packSx(props.sx),
    ],
  } as MantineDataTableProps<T>;

  return <MantineDataTable<T> {...rootProps} />;
};
