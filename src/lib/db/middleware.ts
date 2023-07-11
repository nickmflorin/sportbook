import { Prisma } from "@prisma/client";

type UpdateAction = Extract<Prisma.PrismaAction, `update${string}`>;

const UPDATE_ACTIONS: UpdateAction[] = ["update", "updateMany"];
const UPDATE_OR_UPSERT_ACTIONS: (UpdateAction | "upsert")[] = [...UPDATE_ACTIONS, "upsert"];

const modelHasField = (name: Prisma.ModelName, field: string) => {
  const model = Prisma.dmmf.datamodel.models.find(m => m.name === name);
  if (!model) {
    throw new TypeError(`Invalid model name '${name}'.`);
  }
  return model.fields.find(f => f.name === field) !== undefined;
};

/**
 * Middleware for the Prisma ORM that enforces the following:
 *
 * 1. The 'updatedById' (pertaining to a {@link User}) is provided when updating a model via an "upsert", "updateMany"
 *    or "update" operation if the model has an 'updatedById' field.
 * 2. The 'createdById' (pertaining to a {@link User}) is NOT provided when updating a model via an "upsert",
 *    "updateMany" or "update" operation if the model has an 'createdById' field.
 */
export const userModelMetaDataMiddleware: Prisma.Middleware = async ({ action, model, args, ...params }, next) => {
  if (UPDATE_OR_UPSERT_ACTIONS.includes(action as UpdateAction | "upsert") && model) {
    const updateData = {
      upsert: args.update,
      update: args.data,
      updateMany: args.data,
    }[action as UpdateAction | "upsert"];
    if (
      modelHasField(model, "updatedById") &&
      (updateData === undefined ||
        (typeof updateData === "object" && updateData !== null && updateData.updatedById === undefined))
    ) {
      throw new Error(
        `For action '${action}' on model '${model}', the 'updatedBy' field is required in the updating data.`,
      );
    } else if (
      modelHasField(model, "createdById") &&
      typeof updateData === "object" &&
      updateData !== null &&
      updateData.createdById !== undefined
    ) {
      throw new Error(`For action '${action}' on model '${model}', the 'createdById' field is prohibited.`);
    }
  }
  return next({ ...params, action, model, args });
};
