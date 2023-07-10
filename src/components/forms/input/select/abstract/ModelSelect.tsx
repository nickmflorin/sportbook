import { type Model } from "~/lib/api";

import { Select, type SelectProps } from "./Select";

export type ModelSelectOption<M extends Model> = {
  readonly value: M["id"];
  readonly model: M;
  readonly label: string;
};

export interface ModelSelectProps<M extends Model> extends Omit<SelectProps<ModelSelectOption<M>>, "data"> {
  readonly data: M[];
  readonly getLabel: (m: M) => string;
}

export const ModelSelect = <M extends Model>({ data, getLabel, ...props }: ModelSelectProps<M>): JSX.Element => (
  <Select<ModelSelectOption<M>> {...props} data={data.map(d => ({ model: d, value: d.id, label: getLabel(d) }))} />
);
