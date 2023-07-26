import { type Color } from "~/lib/ui";
import { type BasicIconProp } from "~/components/icons";

export type PrismaEnum = Record<string, string>;
export type PrismaEnumValue<E extends PrismaEnum> = E[keyof E] & string;

export type EnumData<
  E extends PrismaEnum,
  V extends PrismaEnumValue<E> = PrismaEnumValue<E>,
> = V extends PrismaEnumValue<E>
  ? {
      readonly value: V;
      readonly label: string;
      readonly iconColor?: Color;
      readonly icon?: BasicIconProp;
      readonly badgeBackgroundColor?: Color;
      readonly badgeColor?: Color;
    }
  : never;

export type EnumModelConfig<E extends PrismaEnum> = {
  [key in PrismaEnumValue<E>]: Omit<EnumData<E, key>, "value">;
};

export const safeEnumValue = <E extends Record<string, string>>(value: string, prismaEnum: E): E[keyof E] => {
  const v = value.toUpperCase();
  if (prismaEnum[v] === undefined) {
    throw new TypeError(
      `Invalid enum value '${value}' detected for enum, must be one of ${Object.values(prismaEnum).join(", ")}'`,
    );
  }
  return v as E[keyof E];
};
