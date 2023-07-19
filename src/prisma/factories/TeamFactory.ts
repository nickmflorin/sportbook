import { type Team, Color } from "@prisma/client";

import { randomSelection } from "~/lib/util/random";

import { ModelFactory } from "./Factory";

export const TeamFactory = new ModelFactory<Team, "name" | "color">("Team", {
  name: params => `Team ${params.count}`,
  color: () => randomSelection(Object.values(Color)),
});
