import { z } from "zod";

export const isUuid = (value: unknown): value is string => z.string().uuid().safeParse(value).success;
