import { Prisma, type User } from "@prisma/client";

import { generateRandomDate } from "~/lib/util/random";

import { type PrismaModelType, type ModelConcreteField, type ModelMeta } from "./types";

export const getModel = (name: Prisma.ModelName): Prisma.DMMF.Model => {
  const model = Prisma.dmmf.datamodel.models.find(m => m.name === name);
  if (!model) {
    throw new TypeError(`Invalid model name '${name}'.`);
  }
  return model;
};

export const modelHasField = (name: Prisma.ModelName | Prisma.DMMF.Model, field: string) => {
  const m = typeof name === "string" ? getModel(name) : name;
  return m.fields.find(f => f.name === field) !== undefined;
};

export const getModelDefaultFieldValue = <
  M extends PrismaModelType<N>,
  N extends Prisma.ModelName,
  F extends ModelConcreteField<N>,
>(
  modelName: N,
  fieldName: F,
): M[F] => {
  const model = getModel(modelName);
  const field = model.fields.find(f => f.name === fieldName);
  if (!field) {
    throw new Error(`The provided model field ${field} is invalid!`);
  }
  const defaultValue = field.default;
  if (defaultValue === undefined) {
    throw new Error(`The provided model field ${field} does not have a default!`);
  }
  return defaultValue as M[F];
};

const USER_META_FIELDS = ["createdById", "updatedById"] as const;
const DATE_META_FIELDS = ["createdAt", "updatedAt", "assignedAt"] as const;

export type DynamicGetUser = (options?: { recycle: boolean }) => User;

export const getModelMeta = <M extends Prisma.ModelName>(
  name: M,
  { getUser }: { getUser: DynamicGetUser },
): ModelMeta<M> => {
  const model = getModel(name);

  let data = {} as ModelMeta<M>;
  for (const field of USER_META_FIELDS) {
    if (modelHasField(model, field)) {
      data = { ...data, [field]: getUser({ recycle: true }).id } as ModelMeta<M>;
    }
  }
  for (const field of DATE_META_FIELDS) {
    if (modelHasField(model, field)) {
      data = {
        ...data,
        [field]: generateRandomDate(),
      } as ModelMeta<M>;
    }
  }
  return data;
};
