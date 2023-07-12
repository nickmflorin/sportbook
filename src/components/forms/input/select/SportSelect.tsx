import { type Sport, Sports } from "~/prisma";

import { EnumSelect, type EnumSelectProps } from "./abstract";

export type SportSelectProps = Omit<EnumSelectProps<typeof Sport>, "loading" | "data" | "getLabel" | "model">;

export const SportSelect = (props: SportSelectProps) => <EnumSelect placeholder="Sport" {...props} model={Sports} />;
