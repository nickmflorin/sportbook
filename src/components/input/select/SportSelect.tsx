import { type Sport, Sports } from "~/prisma";

import { EnumSelect, type EnumSelectProps } from "./abstract";

export type SportSelectProps = Omit<
  EnumSelectProps<typeof Sport, "single", null>,
  "mode" | "loading" | "data" | "getLabel" | "model" | "clearable"
>;

export const SportSelect = (props: SportSelectProps) => (
  <EnumSelect placeholder="Sport" {...props} mode="single" model={Sports} clearable={false} />
);
