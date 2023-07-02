import { z } from "zod";

type CreateCommaSeparatedArraySchemaParams<V extends readonly string[]> = {
  readonly options: V;
  readonly partTransformer?: (v: string) => string;
};

export const createCommaSeparatedArraySchema = <V extends readonly string[]>(
  params: CreateCommaSeparatedArraySchemaParams<V>
) =>
  z.custom<V>((value) => {
    if (typeof value !== "string") {
      return false;
    }
    const parsed = value
      .split(",")
      .map((v) => v.trim())
      .map((v) => (params?.partTransformer ? params.partTransformer(v) : v));

    const invalid = parsed.map(
      (vi) => !params.options.includes(vi as V[number])
    );
    if (invalid.length === 1) {
      return {
        message: `The value '${
          invalid[0]
        }' is invalid, must be one of '${params.options.join(",")}'.`,
      };
    } else if (invalid.length !== 0) {
      return {
        message: `The values '${invalid.join(
          ","
        )}' are invalid, must be one of '${params.options.join(",")}'.`,
      };
    }
    return true;
  });
