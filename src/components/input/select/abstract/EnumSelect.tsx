import { type PrismaEnum, type PrismaEnumValue, type EnumModel, type EnumData } from "~/prisma";

import { Select, type SelectProps, type SelectMode } from "./Select";

type OnChangeHandlerValue<
  E extends PrismaEnum,
  M extends SelectMode,
  Nullable extends null | never,
> = M extends "multiple" ? (PrismaEnumValue<E> | Nullable)[] : PrismaEnumValue<E> | Nullable;

type OnChangeHandler<E extends PrismaEnum, M extends SelectMode, Nullable extends null | never> = (
  value: OnChangeHandlerValue<E, M, Nullable>,
) => void;

export type EnumSelectProps<E extends PrismaEnum, M extends SelectMode, Nullable extends null | never> = Omit<
  SelectProps<EnumData<E>, PrismaEnumValue<E> | Nullable, M>,
  "data" | "optionComponent" | "onChange" | "value" | "datumKeys"
> & {
  readonly model: EnumModel<E>;
  readonly value: PrismaEnumValue<E> | Nullable;
  readonly onChange: OnChangeHandler<E, M, Nullable>;
};

export const EnumSelect = <E extends PrismaEnum, M extends SelectMode, Nullable extends null | never>({
  model,
  onChange,
  ...props
}: EnumSelectProps<E, M, Nullable>) => (
  <Select<EnumData<E>, PrismaEnumValue<E> | Nullable, M>
    searchable={false}
    {...props}
    datumKeys={[]}
    onChange={value => {
      if (props.mode === "multiple") {
        const fn = onChange as OnChangeHandler<E, "multiple", Nullable>;
        return fn((value as (PrismaEnumValue<E> | Nullable)[]).map(v => model.toEnumValue(v)));
      } else {
        const fn = onChange as OnChangeHandler<E, "single", Nullable>;
        return fn(model.toEnumValue(value));
      }
    }}
    data={model.data}
  />
);
