/* eslint-disable no-console -- This script runs outside of the logger context. */
import { type Optional } from "utility-types";
import { type Prisma, type User } from "@prisma/client";

import {
  generateRandomDate,
  type RandomLength,
  randomInt,
  selectAtRandom,
  selectSequentially,
} from "~/prisma/seeding/random";

import { type PrismaModelType, getModel, modelHasField } from "../../model";
import { fixtures } from "../fixtures";

type JsonFieldName<
  M extends Prisma.ModelName,
  DATA extends JD[],
  JD extends JsonDatum = DATA[number],
> = keyof DATA[number] & Exclude<keyof PrismaModelType<M>, "id" | ModelBaseField<M>>;
type ModelFieldName<M extends Prisma.ModelName, DATA extends JD[], JD extends JsonDatum = DATA[number]> = Exclude<
  keyof PrismaModelType<M>,
  "id" | ModelBaseField<M> | keyof DATA[number]
>;

type JsonDatum = { [key in string]: string | boolean | number };

type JsonSelectionMode = "random" | "sequential";

type ModelBaseFields = {
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly assignedAt: Date;
  readonly createdById: string;
  readonly updatedById: string;
};

type ModelBaseField<M extends Prisma.ModelName> = keyof ModelBaseFields & keyof PrismaModelType<M>;
type ModelBase<M extends Prisma.ModelName> = { [key in ModelBaseField<M>]: PrismaModelType<M>[key] };

type _ReplaceUndefinedWithNull<T> = T extends undefined ? Exclude<T, undefined> | null : T;

type _Equals<A, B> = _ReplaceUndefinedWithNull<A> extends _ReplaceUndefinedWithNull<B>
  ? _ReplaceUndefinedWithNull<B> extends _ReplaceUndefinedWithNull<A>
    ? true
    : false
  : false;

/* Fields of the JSON data model that do not have the same type as the associated field on the Prisma model.  These
   fields must be provided in the 'fields' argument to the ModelFactory such that the correct type of the field can be
   derived from the JSON form of the field. */
/* type RequiredJsonField<
     M extends Prisma.ModelName,
     J extends JsonFieldName<M>,
     JD extends JsonDatum<M, DATA, JD>,
   > = keyof {
     [key in J as _Equals<JD[key], PrismaModelType<M>[key]> extends true ? never : key]: PrismaModelType<M>[key];
   } &
     J; */

/* Fields of the JSON data model that have the same type as the field on the Prisma model.  These fields do not have to
   be included in the 'fields' argument to the ModelFactory, because their raw JSON values can be injected directly into
   the invocation of the Prisma create. */
export type OptionalJsonField<
  M extends Prisma.ModelName,
  DATA extends JD[],
  JD extends JsonDatum = DATA[number],
> = keyof {
  [key in JsonFieldName<M, DATA, JD> as _Equals<JD[key], PrismaModelType<M>[key]> extends true
    ? key
    : never]: PrismaModelType<M>[key];
} &
  JsonFieldName<M, DATA, JD>;

export type FactoryJsonFieldParams<
  k extends JsonFieldName<M, DATA, JD>,
  M extends Prisma.ModelName,
  DATA extends JD[],
  F extends ModelFieldName<M, DATA, JD>,
  JD extends JsonDatum = DATA[number],
> = {
  readonly jsonValue: JD[k];
  readonly factory: ModelFactory<M, DATA, F, JD>;
  readonly count: number;
  readonly jsonData: JD;
};

export type FactoryModelFieldParams<
  M extends Prisma.ModelName,
  DATA extends JD[],
  F extends ModelFieldName<M, DATA, JD>,
  JD extends JsonDatum = DATA[number],
> = { readonly count: number; readonly factory: ModelFactory<M, DATA, F, JD> };

type FactoryModelField<
  k extends F,
  M extends Prisma.ModelName,
  DATA extends JD[],
  F extends ModelFieldName<M, DATA, JD>,
  JD extends JsonDatum = DATA[number],
> = (params: FactoryModelFieldParams<M, DATA, F, JD>) => PrismaModelType<M>[k];

type FactoryJsonField<
  k extends JsonFieldName<M, DATA, JD>,
  M extends Prisma.ModelName,
  DATA extends JD[],
  F extends ModelFieldName<M, DATA, JD>,
  JD extends JsonDatum = DATA[number],
> = (params: FactoryJsonFieldParams<k, M, DATA, F, JD>) => PrismaModelType<M>[k];

type PartialModelResult<
  M extends Prisma.ModelName,
  DATA extends JD[],
  F extends ModelFieldName<M, DATA, JD>,
  JD extends JsonDatum = DATA[number],
> = {
  [key in F]: PrismaModelType<M>[key];
};

type PartialJsonResult<M extends Prisma.ModelName, DATA extends JD[], JD extends JsonDatum> = {
  [key in JsonFieldName<M, DATA, JD>]: PrismaModelType<M>[key];
};

type PartialResult<
  M extends Prisma.ModelName,
  DATA extends JD[],
  F extends ModelFieldName<M, DATA, JD>,
  JD extends JsonDatum = DATA[number],
> = {
  [key in F | JsonFieldName<M, DATA, JD>]: PrismaModelType<M>[key];
};

export type FactoryResult<
  M extends Prisma.ModelName,
  DATA extends JD[],
  F extends ModelFieldName<M, DATA, JD>,
  JD extends JsonDatum = DATA[number],
> = {
  [key in F | JsonFieldName<M, DATA, JD> | ModelBaseField<M>]: PrismaModelType<M>[key];
};

type DynamicGetUser = (options?: { recycle: boolean }) => User;

type FactoryGenerateOptions<DATA extends JD[], JD extends JsonDatum> = {
  readonly user: () => User;
  readonly count: number;
  readonly jsonDatum?: DATA[number];
};

type FactoryCreateOptions<DATA extends JD[], JD extends JsonDatum> = {
  readonly user?: User | (() => User);
  readonly jsonDatum?: DATA[number];
};

type _FactoryJsonFields<
  M extends Prisma.ModelName,
  DATA extends JD[],
  F extends ModelFieldName<M, DATA, JD>,
  JD extends JsonDatum = DATA[number],
> = {
  [key in JsonFieldName<M, DATA, JD>]: FactoryJsonField<key, M, DATA, F, JD>;
};

type FactoryJsonFields<
  M extends Prisma.ModelName,
  DATA extends JD[],
  F extends ModelFieldName<M, DATA, JD>,
  JD extends JsonDatum = DATA[number],
> = Optional<_FactoryJsonFields<M, DATA, F, JD>, OptionalJsonField<M, DATA, JD>>;

type FactoryModelFields<
  M extends Prisma.ModelName,
  DATA extends JD[],
  F extends ModelFieldName<M, DATA, JD>,
  JD extends JsonDatum = DATA[number],
> = {
  [key in F]: FactoryModelField<key, M, DATA, F, JD>;
};

type FactoryJsonOptions<
  M extends Prisma.ModelName,
  DATA extends JD[],
  F extends ModelFieldName<M, DATA, JD>,
  JD extends JsonDatum = DATA[number],
> = {
  readonly jsonData: DATA;
  readonly jsonSelectionMode?: JsonSelectionMode;
  readonly minDate?: Date;
  readonly maxDate?: Date;
  readonly jsonFields: FactoryJsonFields<M, DATA, F, JD>;
  readonly modelFields?: FactoryModelFields<M, DATA, F, JD>;
};

type FactoryBasicOptions<
  M extends Prisma.ModelName,
  DATA extends JD[],
  F extends ModelFieldName<M, DATA, JD>,
  JD extends JsonDatum = DATA[number],
> = {
  readonly jsonData?: never;
  readonly jsonSelectionMode?: never;
  readonly minDate?: Date;
  readonly maxDate?: Date;
  readonly modelFields?: FactoryModelFields<M, DATA, F, JD>;
  readonly jsonFields?: never;
};

type FactoryOptions<
  M extends Prisma.ModelName,
  DATA extends JD[],
  F extends ModelFieldName<M, DATA, JD>,
  JD extends JsonDatum = DATA[number],
> = FactoryJsonOptions<M, DATA, F, JD> | FactoryBasicOptions<M, DATA, F, JD>;

const USER_META_FIELDS = ["createdById", "updatedById"] as const;
const DATE_META_FIELDS = ["createdAt", "updatedAt", "assignedAt"] as const;

export class ModelFactory<
  M extends Prisma.ModelName,
  DATA extends JD[],
  F extends ModelFieldName<M, DATA, JD>,
  JD extends JsonDatum = DATA[number],
> {
  private readonly _model: Prisma.DMMF.Model;
  private readonly _options: FactoryOptions<M, DATA, F, JD>;
  private _count: number;

  constructor(name: M, options: FactoryOptions<M, DATA, F, JD>) {
    this._model = getModel(name);
    this._options = options;
    this._count = 0;
  }

  private generateModelField = <N extends F>(
    name: N,
    fields: FactoryModelFields<M, DATA, F, JD>,
    { count }: { count: number },
  ): PartialModelResult<M, DATA, F, JD>[N] => {
    const field = fields[name];

    return field({ count, factory: this });
  };

  private generateJsonField = <N extends JsonFieldName<M, DATA, JD>>(
    name: N,
    fields: FactoryJsonFields<M, DATA, F, JD>,
    { count, jsonDatum }: { count: number; jsonDatum: JD },
  ): PartialJsonResult<M, DATA, JD>[N] => {
    const field: FactoryJsonField<N, M, DATA, F, JD> = (fields as _FactoryJsonFields<M, DATA, F, JD>)[
      name
    ] as FactoryJsonField<N, M, DATA, F, JD>;
    const jsonValue: FactoryJsonFieldParams<N, M, DATA, F, JD>["jsonValue"] = jsonDatum[name];
    const params: FactoryJsonFieldParams<N, M, DATA, F, JD> = {
      count,
      factory: this,
      jsonData: jsonDatum,
      jsonValue,
    };
    return field(params);
  };

  private generatePartialModelResult({ count }: { count: number }): PartialModelResult<M, DATA, F, JD> {
    const modelFields = this._options.modelFields;
    let data = {} as PartialModelResult<M, DATA, F, JD>;
    if (modelFields !== undefined) {
      for (const f of Object.keys(modelFields)) {
        const name = f as F;
        const field = modelFields[name];
        data = { ...data, [name]: field({ count, factory: this }) };
      }
    }
    return data;
  }

  private generatePartialJsonResult({
    count,
    jsonData,
    jsonDatum,
  }: {
    count: number;
    jsonData: JD[];
    jsonDatum?: JD;
  }): PartialJsonResult<M, DATA, JD> {
    const jsonFields = this._options.jsonFields;
    let data = {} as PartialJsonResult<M, DATA, JD>;

    const _jsonDatum =
      jsonDatum || this._options.jsonSelectionMode === "sequential"
        ? selectSequentially(jsonData, count)
        : selectAtRandom(jsonData);

    if (jsonFields !== undefined) {
      for (const f of Object.keys(jsonFields)) {
        const name = f as JsonFieldName<M, DATA, JD>;
        data = {
          ...data,
          [name]: this.generateJsonField(name, jsonFields, { count, jsonDatum: _jsonDatum }),
        };
      }
    }
    return { ..._jsonDatum, ...data };
  }

  private generatePartialResult({ count, jsonDatum }: FactoryGenerateOptions<DATA, JD>): PartialResult<M, DATA, F, JD> {
    return {
      ...this.generatePartialModelResult({ count }),
      ...(this._options.jsonData
        ? this.generatePartialJsonResult({ count, jsonDatum, jsonData: this._options.jsonData })
        : {}),
    } as PartialResult<M, DATA, F, JD>;
  }

  public randomDate = () => generateRandomDate({ min: this._options?.minDate, max: this._options?.maxDate });

  public randomSentence = () => selectAtRandom(fixtures.sentences);

  public randomEnum = <E extends Record<string, string>>(enumValue: E): E[keyof E] =>
    selectAtRandom(Object.values(enumValue)) as E[keyof E];

  private generateBase = (getUser: DynamicGetUser): ModelBase<M> => {
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
          [field]: this.randomDate(),
        } as ModelBase<M>;
      }
    }
    return data;
  };

  public create = (options: FactoryCreateOptions<DATA, JD>): FactoryResult<M, DATA, F, JD> => {
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
    const base = this.generateBase(getUser);
    const generated = this.generatePartialResult({ ...options, user: getUser, count: this._count });
    this._count += 1;
    return { ...base, ...generated } as FactoryResult<M, DATA, F, JD>;
  };

  public createMany = (
    count: RandomLength,
    options: FactoryCreateOptions<DATA, JD>,
  ): FactoryResult<M, DATA, F, JD>[] => {
    const results = [];
    for (let i = 0; i < (typeof count === "number" ? count : randomInt(count)); i++) {
      results.push(this.create(options));
    }
    return results;
  };

  public createAll = (options: FactoryCreateOptions<DATA, JD>): FactoryResult<M, DATA, F, JD>[] => {
    if (this._options.jsonFields) {
      const opts = this._options as FactoryJsonOptions<M, DATA, F, JD>;
      return opts.jsonData.map(jsonDatum => this.create({ ...options, jsonDatum }));
    }
    return [];
  };
}
