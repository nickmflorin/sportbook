import { z } from "zod";

import { createRequiredStringField } from "./util";

export const LocationSchema = z.object({
  name: createRequiredStringField({ requiredError: "The name of the location is required." }),
  description: z.string().optional(),
  primaryStreetAddress: createRequiredStringField({
    requiredError: "The primary address of the location is required.",
  }),
  secondaryStreetAddress: z.string().optional(),
  zipCode: createRequiredStringField({
    requiredError: "The zip code of the location is required.",
    tooSmallError: "The zip code must be at least 5 characters.",
    minLength: 5,
  }),
  city: createRequiredStringField({
    requiredError: "The location's city is required.",
    tooSmallError: "The location's city must be at least 3 characters.",
  }),
  state: createRequiredStringField({
    requiredError: "The location's state is required.",
    minLength: 2,
    tooSmallError: "The location's state must be at least 2 characters.",
  }),
});
