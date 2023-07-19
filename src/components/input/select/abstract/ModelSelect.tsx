import { type Model } from "~/prisma";

import { Select, type SelectProps, type SelectMode } from "./Select";

/* The model data, M, needs to be nested in a 'model' key - which allows us to safely remove the fields from the prop
   injection into the div. */
export type ModelSelectProps<T extends Model, M extends SelectMode> = Omit<
  SelectProps<{ model: T }, T["id"], M>,
  "getValue" | "getLabel" | "datumKeys" | "data"
> & {
  readonly data: T[];
  readonly getLabel: (m: T) => string;
};

export const ModelSelect = <T extends Model, M extends SelectMode>(props: ModelSelectProps<T, M>): JSX.Element => (
  <Select<{ model: T }, T["id"], M>
    {...props}
    getValue={m => m.model.id}
    getLabel={m => props.getLabel(m.model)}
    datumKeys={["model"]}
    data={props.data.map(m => ({ model: m }))}
  />
);
