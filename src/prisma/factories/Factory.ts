/* eslint-disable no-console -- This script runs outside of the logger context. */
import { type Prisma, type User } from "@prisma/client";

import {
  generateRandomDate,
  type RandomLength,
  randomInt,
  randomSelection,
  sequentialSelection,
} from "~/lib/util/random";

import { type ModelForm, getModel, modelHasField } from "../model";

export type NoJsonData = Record<never, never>;

export type JsonData<M extends ModelForm> = Partial<Record<keyof M, string | boolean | number>>;

type ModelBaseFields = {
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly createdById: string;
  readonly updatedById: string;
};

type ModelBaseField<M extends ModelForm> = keyof ModelBaseFields & keyof M;
type ModelBase<M extends ModelForm> = { [key in ModelBaseField<M>]: M[key] };

type ModelDynamicField<M extends ModelForm, JD extends JsonData<M> | NoJsonData = NoJsonData> = Exclude<
  keyof M,
  keyof JD | ModelBaseField<M>
>;

type JsonDynamicField<M extends ModelForm, JD extends JsonData<M> | NoJsonData = NoJsonData> = keyof JD & keyof M;

type _Equals<A, B> = A extends B ? (B extends A ? true : false) : false;

type _UnequalJsonFields<M extends ModelForm, JD extends JsonData<M> | NoJsonData = NoJsonData> = keyof {
  [key in JsonDynamicField<M, JD> as _Equals<JD[key], M[key]> extends true ? never : key]: M[key];
} &
  keyof M;

type _EqualJsonFields<M extends ModelForm, JD extends JsonData<M> | NoJsonData = NoJsonData> = keyof {
  [key in JsonDynamicField<M, JD> as _Equals<JD[key], M[key]> extends true ? key : never]: M[key];
} &
  keyof M;

/* Fields of the JSON data model that do not have the same type as the associated field on the Prisma model.  These
   fields must be provided in the 'fields' argument to the ModelFactory such that the correct type of the field can be
   derived from the JSON form of the field. */
export type RequiredField<
  M extends ModelForm,
  JD extends JsonData<M> | NoJsonData = NoJsonData,
  F extends ModelDynamicField<M, JD> = never,
> = F | _UnequalJsonFields<M, JD>;

/* Fields of the JSON data model that have the same type as the field on the Prisma model.  These fields do not have to
   be included in the 'fields' argument to the ModelFactory, because their raw JSON values can be injected directly into
   the invocation of the Prisma create. */
export type OptionalField<M extends ModelForm, JD extends JsonData<M>> = _EqualJsonFields<M, JD>;

export type FactoryFieldParams<M extends ModelForm, JD extends JsonData<M> | NoJsonData = NoJsonData> = {
  readonly count: number;
  readonly jsonData: JD;
};

export type FactoryField<k extends keyof M, M extends ModelForm, JD extends JsonData<M> | NoJsonData = NoJsonData> = (
  params: FactoryFieldParams<M, JD>,
) => M[k];

export type FactoryFields<
  M extends ModelForm,
  JD extends JsonData<M> | NoJsonData = NoJsonData,
  F extends ModelDynamicField<M, JD> = never,
> = {
  [key in RequiredField<M, JD, F>]: FactoryField<key, M, JD>;
} & {
  [key in OptionalField<M, JD>]?: FactoryField<key, M, JD>;
};

type PartialModelResult<
  M extends ModelForm,
  JD extends JsonData<M> | NoJsonData = NoJsonData,
  F extends ModelDynamicField<M, JD> = never,
> = {
  [key in F | JsonDynamicField<M, JD>]: M[key];
};

export type ModelResult<
  M extends ModelForm,
  JD extends JsonData<M> | NoJsonData = NoJsonData,
  F extends ModelDynamicField<M, JD> = never,
> = {
  [key in F | JsonDynamicField<M, JD> | ModelBaseField<M>]: M[key];
};

export type FactoryOptions<M extends ModelForm, JD extends JsonData<M> | NoJsonData = NoJsonData> = {
  readonly jsonData: JD[];
  readonly sequentialJsonSelection?: true;
  readonly minDate?: Date;
  readonly maxDate?: Date;
};

type DynamicGetUser = (options?: { recycle: boolean }) => User;

export type FactoryGenerateOptions = {
  readonly user: () => User;
  readonly count: number;
};

export type FactoryCreateOptions = {
  readonly user?: User | (() => User);
};

const USER_META_FIELDS = ["createdById", "updatedById"] as const;
const DATE_META_FIELDS = ["createdAt", "updatedAt"] as const;

export class ModelFactory<
  M extends ModelForm,
  JD extends JsonData<M> | NoJsonData = NoJsonData,
  F extends ModelDynamicField<M, JD> = never,
> {
  private readonly _model: Prisma.DMMF.Model;
  private readonly _options: FactoryOptions<M, JD> | undefined;
  private _count: number;
  private _fields: FactoryFields<M, JD, F>;

  constructor(name: Prisma.ModelName, fields: FactoryFields<M, JD, F>, options: FactoryOptions<M, JD>) {
    this._model = getModel(name);
    this._options = options;
    this._count = 0;
    this._fields = fields;
  }

  private generate({ count }: FactoryGenerateOptions): PartialModelResult<M, JD, F> {
    let data = {} as PartialModelResult<M, JD, F>;

    let params: FactoryFieldParams<M, JD> = { count } as FactoryFieldParams<M, JD>;
    if (this._options?.jsonData && this._options?.jsonData.length !== 0) {
      params = {
        count,
        jsonData:
          this._options.sequentialJsonSelection === true
            ? sequentialSelection(this._options.jsonData, count)
            : randomSelection(this._options.jsonData),
      } as FactoryFieldParams<M, JD>;
    }

    for (const field of Object.keys(this._fields)) {
      const f = field as F;
      data = {
        ...data,
        [f]: this._fields[f](params),
      } as PartialModelResult<M, JD, F>;
    }
    return { ...params.jsonData, ...data };
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

  public create = (options: FactoryCreateOptions): ModelResult<M, JD, F> => {
    let generatedUser: User;
    const getUser: DynamicGetUser = (opts?) => {
      if (!generatedUser) {
        if (options.user === undefined) {
          throw new Error(
            `The model factory for model '${this._model.name}' requires a reference to a user, which cannot be ` +
              "established without the user factory function.",
          );
        }
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
    return { ...base, ...generated } as ModelResult<M, JD, F>;
  };

  public createMany = (count: RandomLength, options: FactoryCreateOptions): ModelResult<M, JD, F>[] => {
    const results = [];
    for (let i = 0; i < (typeof count === "number" ? count : randomInt(count)); i++) {
      results.push(this.create(options));
    }
    return results;
  };
}
