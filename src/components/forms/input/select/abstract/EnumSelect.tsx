import { type PrismaEnum, type PrismaEnumValue, type EnumModel, type EnumData } from "~/prisma";

import { Select, type SelectProps } from "./Select";

export type EnumSelectProps<E extends PrismaEnum> = Omit<
  SelectProps<EnumData<E>, PrismaEnumValue<E>>,
  | "data"
  | "onError"
  | "rightSection"
  | "optionComponent"
  | "disableSelectedItemFiltering"
  | "onChange"
  | "value"
  | "datumKeys"
> & {
  readonly model: EnumModel<E>;
  readonly value?: PrismaEnumValue<E>;
  readonly onChange?: (v: PrismaEnumValue<E> | null) => void;
};

export const EnumSelect = <E extends PrismaEnum>({ model, onChange, ...props }: EnumSelectProps<E>) => (
  <Select
    clearable
    searchable={false}
    {...props}
    datumKeys={[]}
    onChange={(v: string | null) => {
      if (v) {
        onChange?.(model.toEnumValue(v));
      } else {
        onChange?.(null);
      }
    }}
    data={model.data}
  />
);
