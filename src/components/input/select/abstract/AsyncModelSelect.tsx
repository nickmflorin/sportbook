import { type Required } from "utility-types";

import { type Model } from "~/prisma";

import { ModelSelect, type ModelSelectProps } from "./ModelSelect";
import { type SelectMode } from "./Select";

export type AsyncModelSelectProps<T extends Model, M extends SelectMode> = Required<
  ModelSelectProps<T, M>,
  "loading"
> & {
  readonly loading: boolean;
};

export const AsyncModelSelect = <T extends Model, M extends SelectMode>(
  props: AsyncModelSelectProps<T, M>,
): JSX.Element => <ModelSelect<T, M> {...props} />;
