import { type Color, type icons } from "~/lib/ui";

export type PrismaEnum = Record<string, string>;
export type PrismaEnumValue<E extends PrismaEnum> = E[keyof E];

export type EnumData<
  E extends PrismaEnum,
  V extends PrismaEnumValue<E> = PrismaEnumValue<E>,
> = V extends PrismaEnumValue<E>
  ? {
      readonly value: V;
      readonly label: string;
      readonly iconColor?: Color;
      readonly icon?: icons.BasicIconProp;
    }
  : never;

export type EnumModelConfig<E extends PrismaEnum> = {
  [key in PrismaEnumValue<E>]: Omit<EnumData<E, key>, "value">;
};
