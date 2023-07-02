import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const createCommaSeparatedArraySchema = () =>
  z.custom((value) => {
    if (typeof value === "string") {
      const parsed = value
        .split(",")
        .map((v) => v.trim())
        .map((v) => (params?.partTransformer ? params.partTransformer(v) : v));

      const invalid = parsed.map((vi) => !params.options.includes(vi));
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
    }
    // TODO: How do we allow this to be true depending on optionality?
    return true;
  });

const PrismaLogLevelSchema = createCommaSeparatedArraySchema({
  options: ["info", "query", "warn", "error"],
  partTransformer: (v) => v.toLowerCase(),
});

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url().optional(),
    DATABASE_NAME: z.string().optional(),
    DATABASE_PASSWORD: z.string().optional(),
    DATABASE_USER: z.string().optional(),
    DATABASE_HOST: z.string().optional(),
    DATABASE_PORT: z.number().int().positive().optional(),
    DATABASE_LOG_LEVEL: PrismaLogLevelSchema.default(
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"]
    ),
    NODE_ENV: z.enum(["development", "test", "production"]),
  },
  client: {},
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PORT: process.env.DATABASE_PORT,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_NAME: process.env.DATABASE_NAME,
    NODE_ENV: process.env.NODE_ENV,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
