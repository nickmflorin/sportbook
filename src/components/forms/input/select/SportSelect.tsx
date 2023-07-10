import { type Sport } from "@prisma/client";

import { Sports } from "~/prisma/enums";

import { EnumSelect, type EnumSelectProps } from "./abstract";

export type SportSelectProps = Omit<EnumSelectProps<typeof Sport>, "loading" | "data" | "getLabel" | "model">;

export const SportSelect = (props: SportSelectProps) => <EnumSelect placeholder="Sport" {...props} model={Sports} />;
