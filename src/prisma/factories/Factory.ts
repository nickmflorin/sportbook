/* eslint-disable no-console -- This script runs outside of the logger context. */
import { type Prisma, type User } from "@prisma/client";

import { generateRandomDate, type RandomLength, randomInt } from "~/lib/util/random";

import { getModel, modelHasField } from "../util";

type ModelValue = Date | string | number | boolean | null;
type Model = Record<string, ModelValue>;

type BaseFields = {
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly createdById: string;
  readonly updatedById: string;
};

type BaseField<M extends Model> = keyof BaseFields & keyof M;
type DynamicField<M extends Model, F extends keyof M> = F & Exclude<keyof M, BaseField<M>>;
type ModelBase<M extends Record<string, ModelValue>> = { [key in BaseField<M>]: M[key] };

const USER_META_FIELDS = ["createdById", "updatedById"] as const;
const DATE_META_FIELDS = ["createdAt", "updatedAt"] as const;

type FieldParams = {
  readonly count: number;
};

type Field<M extends Model, F extends keyof M> = (params: FieldParams) => M[F];

type FactoryFields<M extends Model, F extends keyof M> = { [key in F]: Field<M, F> };

type PartialModelResult<M extends Model, F extends keyof M = never> = { [key in DynamicField<M, F>]: M[key] };
type ModelResult<M extends Model, F extends keyof M = never> = { [key in DynamicField<M, F> | BaseField<M>]: M[key] };

export type FactoryOptions = {
  readonly minDate?: Date;
  readonly maxDate?: Date;
};

type DynamicGetUser = (options?: { recycle: boolean }) => User;

export type FactoryGenerateOptions = {
  readonly user: () => User;
  readonly count: number;
};

export type FactoryCreateOptions = {
  readonly user: User | (() => User);
};

export class ModelFactory<
  M extends Record<string, ModelValue>,
  F extends Exclude<keyof M, keyof M & BaseField<M>> = Exclude<keyof M, keyof M & BaseField<M>>,
> {
  private readonly _model: Prisma.DMMF.Model;
  private readonly _options: FactoryOptions | undefined;
  private _count: number;
  private _fields: { [key in F]: Field<M, F> };

  constructor(name: Prisma.ModelName, fields: FactoryFields<M, F>, options?: FactoryOptions) {
    this._model = getModel(name);
    this._options = options;
    this._count = 0;
    this._fields = fields;
  }

  private generate(options: FactoryGenerateOptions): PartialModelResult<M, DynamicField<M, F>> {
    let data = {} as PartialModelResult<M, DynamicField<M, F>>;
    for (const field of Object.keys(this._fields)) {
      const f = field as F;
      data = { ...data, [f]: this._fields[f]({ count: options.count }) } as PartialModelResult<M, DynamicField<M, F>>;
    }
    return data;
  }

  private preGenerate = (getUser: DynamicGetUser): ModelBase<M> => {
    let data = {} as ModelBase<M>;
    for (const field of USER_META_FIELDS) {
      if (modelHasField(this._model, field)) {
        data = { ...data, [field]: getUser({ recycle: true }).id } as ModelBase<M>;
      }
    }
    for (const field of DATE_META_FIELDS) {
      if (modelHasField(this._model, field)) {
        data = {
          ...data,
          [field]: generateRandomDate({ min: this._options?.minDate, max: this._options?.maxDate }),
        } as ModelBase<M>;
      }
    }
    return data;
  };

  public create = (options: FactoryCreateOptions): ModelResult<M, F> => {
    let generatedUser: User;
    const getUser: DynamicGetUser = (opts?) => {
      if (!generatedUser) {
        generatedUser = typeof options.user === "function" ? options.user() : options.user;
      } else if (opts?.recycle !== true) {
        if (typeof options.user !== "function") {
          console.error("Cannot recycle user when it is not provided as a factory function.");
        } else {
          generatedUser = options.user();
        }
      }
      return generatedUser;
    };
    const base = this.preGenerate(getUser);
    const generated = this.generate({ user: getUser, count: this._count });
    this._count += 1;
    return { ...base, ...generated } as ModelResult<M, F>;
  };

  public createMany = (count: RandomLength, options: FactoryCreateOptions): ModelResult<M, F>[] => {
    const results = [];
    for (let i = 0; i < (typeof count === "number" ? count : randomInt(count)); i++) {
      results.push(this.create(options));
    }
    return results;
  };
}
