import { type Team, Color } from "@prisma/client";

import { randomSelection } from "~/lib/util/random";

import { ModelFactory, type NoJsonData } from "./Factory";

export const TeamFactory = new ModelFactory<Team, NoJsonData, "name" | "color">(
  "Team",
  {
    name: params => `Team ${params.count}`,
    color: () => randomSelection(Object.values(Color)),
  },
  { jsonData: [] },
);
