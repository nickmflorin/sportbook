/* eslint-disable no-console -- This script runs outside of the logger context. */
import { type Prisma, type User } from "@prisma/client";

import { generateRandomDate, type RandomLength, randomInt, randomSelection } from "~/lib/util/random";
import { type ModelForm } from "~/prisma";

import { data } from "../fixtures";
import { getModel, modelHasField } from "../util";

// const jsondata = data.users;

type ModelBaseFields = {
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly createdById: string;
  readonly updatedById: string;
};

// type JsonData<M extends ModelForm, JF extends keyof M> = Record<JF, M>;

type ModelBaseField<M extends ModelForm> = keyof ModelBaseFields & keyof M;
type ModelBase<M extends ModelForm> = { [key in ModelBaseField<M>]: M[key] };

type ModelDynamicField<M extends ModelForm, I extends keyof M = keyof M> = Exclude<I, ModelBaseField<M>>;

const USER_META_FIELDS = ["createdById", "updatedById"] as const;
const DATE_META_FIELDS = ["createdAt", "updatedAt"] as const;

type FieldParams = {
  readonly count: number;
  readonly jsonData?: never;
};

type JsonFieldParams<
  M extends ModelForm,
  F extends ModelDynamicField<M> = ModelDynamicField<M>,
  J extends ModelDynamicField<M, Exclude<keyof M, F>> = never,
  JD extends Record<J, string | boolean | number> = Record<J, string | boolean | number>,
> = {
  readonly count: number;
  readonly jsonData: JD;
};

type Field<M extends ModelForm, F extends ModelDynamicField<M> = ModelDynamicField<M>> = (params: FieldParams) => M[F];

type JsonField<
  M extends ModelForm,
  F extends ModelDynamicField<M> = ModelDynamicField<M>,
  J extends ModelDynamicField<M, Exclude<keyof M, F>> = never,
  JD extends Record<J, string | boolean | number> = Record<J, string | boolean | number>,
> = (params: JsonFieldParams<M, F, J, JD>) => M[F];

type Equals<A, B> = A extends B ? (B extends A ? true : false) : false;

type UnequalJsonFields<
  M extends ModelForm,
  F extends ModelDynamicField<M> = ModelDynamicField<M>,
  J extends ModelDynamicField<M, Exclude<keyof M, F>> = never,
  JD extends Record<J, string | boolean | number> = Record<J, string | boolean | number>,
> = keyof { [key in J as Equals<JD[key], M[key]> extends true ? never : key]: M[key] };

type EqualJsonFields<
  M extends ModelForm,
  F extends ModelDynamicField<M> = ModelDynamicField<M>,
  J extends ModelDynamicField<M, Exclude<keyof M, F>> = never,
  JD extends Record<J, string | boolean | number> = Record<J, string | boolean | number>,
> = keyof { [key in J as Equals<JD[key], M[key]> extends true ? never : key]: M[key] };

type RequiredField<
  M extends ModelForm,
  F extends ModelDynamicField<M> = ModelDynamicField<M>,
  J extends ModelDynamicField<M, Exclude<keyof M, F>> = never,
  JD extends Record<J, string | boolean | number> = Record<J, string | boolean | number>,
> = F | UnequalJsonFields<M, F, J, JD>;

type OptionalField<
  M extends ModelForm,
  F extends ModelDynamicField<M> = ModelDynamicField<M>,
  J extends ModelDynamicField<M, Exclude<keyof M, F>> = never,
  JD extends Record<J, string | boolean | number> = Record<J, string | boolean | number>,
> = EqualJsonFields<M, F, J, JD>;

type FactoryFields<
  M extends ModelForm,
  F extends ModelDynamicField<M> = ModelDynamicField<M>,
  J extends ModelDynamicField<M, Exclude<keyof M, F>> = never,
  JD extends Record<J, string | boolean | number> = Record<J, string | boolean | number>,
> = {
  [key in RequiredField<M, F, J, JD>]: key extends J ? JsonField<M, F, key, JD> : key extends F ? Field<M, key> : never;
} & {
  [key in OptionalField<M, F, J, JD>]-?: key extends J
    ? JsonField<M, F, key, JD>
    : key extends F
    ? Field<M, key>
    : never;
};

type PartialModelResult<
  M extends ModelForm,
  F extends ModelDynamicField<M> = ModelDynamicField<M>,
  J extends ModelDynamicField<M, Exclude<keyof M, F>> = never,
> = {
  [key in F | J]: M[key];
};

type ModelResult<
  M extends ModelForm,
  F extends ModelDynamicField<M> = ModelDynamicField<M>,
  J extends ModelDynamicField<M, Exclude<keyof M, F>> = never,
> = {
  [key in F | J | ModelBaseField<M>]: M[key];
};

export type FactoryOptions<
  M extends ModelForm,
  F extends ModelDynamicField<M> = ModelDynamicField<M>,
  J extends ModelDynamicField<M, Exclude<keyof M, F>> = never,
  JD extends Record<J, string | boolean | number> = Record<J, string | boolean | number>,
> = {
  readonly minDate?: Date;
  readonly maxDate?: Date;
  readonly jsonData?: JD[];
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
  F extends ModelDynamicField<M> = ModelDynamicField<M>,
  J extends ModelDynamicField<M, Exclude<keyof M, F>> = never,
  JD extends Record<J, string | boolean | number> = Record<J, string | boolean | number>,
> {
  private readonly _model: Prisma.DMMF.Model;
  private readonly _options: FactoryOptions<M, F, J, JD> | undefined;
  private _count: number;
  private _fields: FactoryFields<M, F, J, JD>;

  constructor(name: Prisma.ModelName, fields: FactoryFields<M, F, J, JD>, options?: FactoryOptions<M, F, J, JD>) {
    this._model = getModel(name);
    this._options = options;
    this._count = 0;
    this._fields = fields;
  }

  private generate({ count }: FactoryGenerateOptions): PartialModelResult<M, F, J> {
    let data = {} as PartialModelResult<M, F, J>;
    for (const field of Object.keys(this._fields)) {
      const f = field as F;
      const _fieldFactory = this._fields[f];
      if (this._options?.jsonData) {
        const fieldFactory = _fieldFactory as JsonField<M, F, J, JD>;
        data = {
          ...data,
          [f]: fieldFactory({ count, jsonData: randomSelection(this._options.jsonData) }),
        } as PartialModelResult<M, F, J>;
      } else {
        const fieldFactory = _fieldFactory as Field<M, F>;
        data = { ...data, [f]: fieldFactory({ count }) };
      }
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
