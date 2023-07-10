import type * as types from "./types";

import { type Color, type icons } from "~/lib/ui";

export type EnumData<
  E extends types.PrismaEnum,
  V extends types.PrismaEnumValue<E> = types.PrismaEnumValue<E>,
> = V extends types.PrismaEnumValue<E>
  ? {
      readonly value: V;
      readonly label: string;
      readonly iconColor?: Color;
      readonly icon?: icons.BasicIconProp;
    }
  : never;

export type EnumModelConfig<E extends types.PrismaEnum> = {
  [key in types.PrismaEnumValue<E>]: Omit<EnumData<E, key>, "value">;
};

export type PrismaEnumAssertion<E extends types.PrismaEnum> = (
  this: EnumModel<E>,
  value: unknown,
) => asserts value is types.PrismaEnumValue<E>;

export class EnumModel<E extends types.PrismaEnum> {
  private readonly config: EnumModelConfig<E>;
  private readonly prismaEnum: E;
  private readonly name: string;

  constructor(name: string, prismaEnum: E, config: EnumModelConfig<E>) {
    this.name = name;
    this.config = config;
    this.prismaEnum = prismaEnum;
  }

  private get values(): types.PrismaEnumValue<E>[] {
    return Object.values(this.prismaEnum) as types.PrismaEnumValue<E>[];
  }

  public throwInvalidValue = (value: unknown) => {
    throw new Error(`The value '${JSON.stringify(value)}' is not a valid value for the Prisma enum '${this.name}'.`);
  };

  public isEnumValue = (value: unknown): value is types.PrismaEnumValue<E> => {
    if (!this.values.includes(value as types.PrismaEnumValue<E>)) {
      return true;
    }
    return false;
  };

  public get data() {
    return [...this.iterate()].map(v => v[0]);
  }

  *iterate(): IterableIterator<[EnumData<E>, number]> {
    for (let i = 0; i < this.values.length; i++) {
      const k = this.values[i];
      if (k === undefined) {
        throw new Error("Unexpected condition!");
      }
      yield [{ ...this.config[k], value: k } as EnumData<E>, i];
    }
  }

  map = (callback: (s: EnumData<E>, i: number) => void) => {
    for (const [config, index] of this.iterate()) {
      callback(config, index);
    }
  };

  getLabel = (v: types.PrismaEnumValue<E>): string => this.config[v].label;

  getIcon = (v: types.PrismaEnumValue<E>): icons.BasicIconProp | undefined => this.config[v].icon;

  getIconColor = (v: types.PrismaEnumValue<E>): Color | undefined => this.config[v].iconColor;
}
