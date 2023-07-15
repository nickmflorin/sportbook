import { type Model } from "~/lib/api";

import { Select, type SelectProps, type SelectChangeHandler } from "./Select";

/* The model data, M, needs to be nested in a 'model' key - which allows us to safely remove the fields from the prop
   injection into the div. */
export type ModelSelectProps<M extends Model> = Omit<
  SelectProps<{ model: M }, M["id"]>,
  "getValue" | "datumKeys" | "data" | "onChange"
> & {
  readonly data: M[];
  readonly onChange: SelectChangeHandler<M, M["id"]>;
};

export const ModelSelect = <M extends Model>({ onChange, ...props }: ModelSelectProps<M>): JSX.Element => {
  if (!props.data.map) {
    console.error(props);
  }
  return (
    <Select
      {...props}
      getValue={m => m.model.id}
      datumKeys={["model"]}
      data={props.data.map(m => ({ model: m }))}
      onChange={(value, model) => {
        if (value === null || model === null) {
          onChange(null, null);
        } else {
          onChange(value, model.model);
        }
      }}
    />
  );
};
