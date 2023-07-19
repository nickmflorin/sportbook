import { type User } from "@prisma/client";

import { randomSelection } from "~/lib/util/random";

import { type data } from "../fixtures";

import { ModelFactory, RequiredField, type JDR, type Equals } from "./Factory";

type UserData = (typeof data.users)[number];

type R = JDR<User, never, keyof UserData, UserData>;


type K = keyof {[key in keyof UserData & keyof User as Equals<UserData[key], User[key]> extends true ? never : key]: key}

type EQ = Equals<UserData["firstName"], User["firstName"]>;

export const TeamFactory = new ModelFactory<User, never, keyof UserData, UserData>("User", {
  /* name: params => `Team ${params.count}`,
     color: () => randomSelection(Object.values(Color)), */
});
