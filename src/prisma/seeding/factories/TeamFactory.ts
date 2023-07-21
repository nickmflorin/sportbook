import { Color } from "@prisma/client";

import { ModelFactory } from "./Factory";

export const TeamFactory = new ModelFactory("Team", {
  modelFields: {
    name: params => `Team ${params.count}`,
    color: params => params.factory.randomEnum(Color),
  },
});
