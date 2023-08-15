import { z } from "zod";

export type InitialsArray = [string | undefined | null, string | undefined | null];
export type InitialsString = string | InitialsArray;

export const InitialsStringSchema = z.union([z.string(), z.array(z.string().optional().nullable())]);

export const isInitialsString = (value: unknown): value is InitialsString =>
  InitialsStringSchema.safeParse(value).success;

export const parseInitials = (value: InitialsString): string => {
  if (Array.isArray(value)) {
    const v: InitialsArray = [value[0] ? value[0].trim() : value[0], value[1] ? value[1].trim() : value[1]];
    if (v[0] && v[1]) {
      return `${v[0].charAt(0)}${v[1].charAt(0)}`.toUpperCase();
    } else if (v[0]) {
      return v[0].charAt(0).toUpperCase();
    } else if (v[1]) {
      return v[1].charAt(0).toUpperCase();
    }
    return "";
  } else if (value.trim().includes(" ")) {
    const parts: [string | undefined, string | undefined] = [
      value.trim().split(" ")[0]?.trim(),
      value.trim().split(" ")[1]?.trim(),
    ];
    return parseInitials(parts);
  }
  const matched = value.match(/[A-Z][a-z]+/g);
  if (matched !== null) {
    return parseInitials([matched[0], matched[1]]);
  }
  return parseInitials([value.trim().charAt(0), value.trim().charAt(1)]);
};
