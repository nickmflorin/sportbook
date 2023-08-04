import { type EnumeratedLiteralType, enumeratedLiterals } from "~/lib/util/literals";
import { type TableAction } from "~/components/menus/TableActionDropdownMenu";

export const DataTableSizes = enumeratedLiterals(["sm", "md", "lg"] as const);
export type DataTableSize = EnumeratedLiteralType<typeof DataTableSizes>;

export type ActionMenu<T> = TableAction<T>[] | undefined | ((t: T) => TableAction<T>[] | undefined);
