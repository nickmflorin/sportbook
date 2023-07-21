import { v4 as uuid } from "uuid";
import { Gender } from "@prisma/client";

import { safeEnumValue } from "../../model";
import { fixtures } from "../fixtures";

import { ModelFactory, type FactoryJsonFieldParams } from "./Factory";

type UserDatum = (typeof fixtures.users)[number];

export const UserFactory = new ModelFactory("User", {
  jsonData: fixtures.users,
  jsonFields: {
    // It is annoying that the factory cannot infer the params for the callbacks.  We should figure this out eventually.
    gender: (params: FactoryJsonFieldParams<"gender", "User", UserDatum[], "clerkId">) =>
      safeEnumValue(params.jsonData.gender, Gender),
  },
  modelFields: { clerkId: () => uuid() },
});
