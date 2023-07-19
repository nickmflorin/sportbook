/* eslint-disable no-console -- This script runs outside of the logger context. */
import { type Prisma, type User } from "@prisma/client";

import { generateRandomDate, type RandomLength, randomInt } from "~/lib/util/random";
import { type ModelForm, type ModelDynamicField, type ModelBaseField, type ModelBase } from "~/prisma";

import { getModel, modelHasField } from "../util";

const USER_META_FIELDS = ["createdById", "updatedById"] as const;
const DATE_META_FIELDS = ["createdAt", "updatedAt"] as const;

type FieldParams = {
  readonly count: number;
};

type Field<M extends ModelForm, F extends keyof M> = (params: FieldParams) => M[F];

type FactoryFields<M extends ModelForm, F extends keyof M> = { [key in F]: Field<M, F> };

type PartialModelResult<M extends ModelForm, F extends keyof M = never> = { [key in ModelDynamicField<M, F>]: M[key] };
type ModelResult<M extends ModelForm, F extends keyof M = never> = {
  [key in ModelDynamicField<M, F> | ModelBaseField<M>]: M[key];
};

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
  M extends ModelForm,
  F extends Exclude<keyof M, keyof M & ModelBaseField<M>> = Exclude<keyof M, keyof M & ModelBaseField<M>>,
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

  private generate(options: FactoryGenerateOptions): PartialModelResult<M, ModelDynamicField<M, F>> {
    let data = {} as PartialModelResult<M, ModelDynamicField<M, F>>;
    for (const field of Object.keys(this._fields)) {
      const f = field as F;
      data = { ...data, [f]: this._fields[f]({ count: options.count }) } as PartialModelResult<
        M,
        ModelDynamicField<M, F>
      >;
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
