import { z } from "zod";

type CreateRequiredStringFieldParams = {
  readonly requiredError?: string;
  readonly tooSmallError?: string;
  readonly minLength?: number;
};

export const createRequiredStringField = (params: CreateRequiredStringFieldParams) =>
  z
    .string({ required_error: params.requiredError ? params.requiredError : "This field is required." })
    .superRefine((val, ctx) => {
      const min = params.minLength === undefined ? 3 : params.minLength;
      if (val.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: params.requiredError ? params.requiredError : "This field is required.",
        });
        return z.NEVER;
      } else if (val.length < min) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 3,
          type: "string",
          message: params.tooSmallError ? params.tooSmallError : `The field must be at least ${min} characters long.`,
          inclusive: true,
        });
        return z.NEVER;
      }
    });
