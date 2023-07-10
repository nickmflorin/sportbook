import { Sport } from "@prisma/client";

import { icons } from "~/lib/ui";

import { EnumModel } from "./model";

export { type EnumModel } from "./model";
export * from "./types";

export const Sports = new EnumModel("sport", Sport, {
  [Sport.HOCKEY]: {
    label: "Hockey",
    icon: icons.IconNames.HOCKEY_PUCK,
    iconColor: "gray.9",
  },
});
