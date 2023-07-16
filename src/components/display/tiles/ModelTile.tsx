import { Tile, type TileProps } from "./Tile";

export type ModelStringField<
  M extends Record<string, unknown>,
  V extends string | null | undefined = string | null | undefined,
> = keyof {
  [key in keyof M as M[key] extends V ? key : never]: M[key];
} &
  keyof M &
  string;

// export type ModelStringField<M extends Record<string, unknown>> = keyof M & string;

/*   [key in keyof M as M[key] extends string | null | undefined ? key : never]: M[key];
   } &
     string; */

const getModelStringFieldValue = <
  M extends Record<string, unknown>,
  S extends ModelStringField<M, string> = ModelStringField<M, string>,
>(
  model: M,
  field: S,
): string => {
  const v = model[field];
  if (typeof v === "string") {
    return v as string;
  }
  throw new Error(`The model field '${field}' did not return a string value on the model!`);
};

const getOptionalModelStringFieldValue = <
  M extends Record<string, unknown>,
  S extends ModelStringField<M> = ModelStringField<M>,
>(
  model: M,
  field: S,
): string | null | undefined => {
  const v = model[field];
  if (v === undefined || v === null || typeof v === "string") {
    return v as string | null | undefined;
  }
  throw new Error(`The model field '${field}' did not return a string or nullish value on the model!`);
};

export interface ModelTileProps<
  M extends Record<string, unknown>,
  S extends ModelStringField<M, string> = ModelStringField<M, string>,
  D extends ModelStringField<M> = ModelStringField<M>,
> extends Omit<TileProps, "title" | "description"> {
  readonly model: M;
  readonly title: S | ((model: M) => string);
  readonly description: D | D[] | ((model: M) => string | (string | null | undefined)[]);
}

export const ModelTile = <
  M extends Record<string, unknown>,
  S extends ModelStringField<M, string> = ModelStringField<M, string>,
  D extends ModelStringField<M> = ModelStringField<M>,
>({
  title,
  description = [],
  model,
  ...props
}: ModelTileProps<M, S, D>): JSX.Element => (
  <Tile
    title={typeof title === "function" ? title(model) : getModelStringFieldValue<M, S>(model, title)}
    description={
      typeof description === "function"
        ? description(model)
        : (Array.isArray(description) ? description : [description]).map(d =>
            getOptionalModelStringFieldValue<M, D>(model, d),
          )
    }
    {...props}
  />
);
