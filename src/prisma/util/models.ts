import { Prisma } from "@prisma/client";

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
