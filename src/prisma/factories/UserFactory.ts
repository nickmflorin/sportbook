import { v4 as uuid } from "uuid";
import { type User, Gender } from "@prisma/client";

import { data } from "../fixtures";
import { safeEnumValue } from "../model";

import { ModelFactory } from "./Factory";

type UserData = (typeof data.users)[number];

export const UserFactory = new ModelFactory<User, UserData, "clerkId">(
  "User",
  // The clerkId must be unique.
  { gender: params => safeEnumValue(params.jsonData.gender, Gender), clerkId: () => uuid() },
  { jsonData: data.users },
);
