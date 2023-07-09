"use client";
import { type Model } from "~/lib/api";

import { Select, type SelectProps } from "./Select";

export type ModelSelectOption<M extends Model> = {
  readonly value: M["id"];
  readonly model: M;
};

export interface ModelSelectProps<M extends Model> extends Omit<SelectProps<ModelSelectOption<M>>, "data"> {
  readonly data: M[];
}

export const ModelSelect = <M extends Model>({ data, ...props }: ModelSelectProps<M>): JSX.Element => (
  <Select<ModelSelectOption<M>> {...props} data={data.map(d => ({ model: d, value: d.id }))} />
);
