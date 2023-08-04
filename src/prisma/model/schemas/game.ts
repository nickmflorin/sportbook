import { z } from "zod";

export const CancelGameSchema = z.object({
  cancellationReason: z.string().superRefine((val, ctx) => {
    if (val && val.length !== 0 && val.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 3,
        type: "string",
        message: "The cancellation reason must be at least 3 characers long.",
        inclusive: true,
      });
      return z.NEVER;
    }
  }),
});
